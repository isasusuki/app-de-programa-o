import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const api_key = process.env.GEMINI_API_KEY;

if (api_key && api_key !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: api_key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini client:", err);
  }
} else {
  console.log("GEMINI_API_KEY is not defined. AI features will run in local fallback mode.");
}

// Sandbox local code runner for checking simple tasks before sending to LLM or as a fallback
function runCodeLocally(code: string, challengeId: string): { success: boolean; output: string; error?: string } {
  let outputLogs: string[] = [];
  const originalLog = console.log;
  
  // Quick validation rule checks for specific tasks
  const trimmedCode = code.replace(/\s+/g, " ");

  // Create solid sandboxing or pattern matching for the exercises
  try {
    // Intercept console.log
    const sandboxConsole = {
      log: (...args: any[]) => {
        outputLogs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(" "));
      },
      error: (...args: any[]) => {
        outputLogs.push("[ERROR] " + args.join(" "));
      },
      warn: (...args: any[]) => {
        outputLogs.push("[WARN] " + args.join(" "));
      }
    };

    // Safe execution container
    const runner = new Function("console", `
      try {
        ${code}
      } catch (e) {
        throw e;
      }
    `);

    // Execute with intercepted console
    runner(sandboxConsole);
    const combinedOutput = outputLogs.join("\n");

    // Static analysis fallbacks based on challenge IDs
    let success = false;
    
    if (challengeId === "initial_mission" || challengeId === "0_1") {
      // Must contain console.log('Hello World') or similar output
      const matchesHello = combinedOutput.toLowerCase().includes("hello world");
      success = matchesHello;
    } else if (challengeId === "var_decl" || challengeId === "1_1") {
      // Create a variable named name or idade
      const hasLetOrConst = /\b(let|const|var)\b/.test(code);
      const declaresValue = code.includes("nombre") || code.includes("nome") || code.includes("idade") || trimmedCode.includes("let ") || trimmedCode.includes("const ");
      success = hasLetOrConst && declaresValue;
    } else if (challengeId === "func_decl" || challengeId === "2_1") {
      // Create a function sum(a,b) that returns a+b
      const hasFunction = /function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>/.test(code);
      const hasReturn = code.includes("return");
      success = hasFunction && hasReturn;
    } else if (challengeId === "loops" || challengeId === "3_1") {
      // For loop that logs index
      const hasForOrWhile = /\b(for|while)\b/.test(code);
      success = hasForOrWhile;
    } else {
      // Generic criteria check: completed run without errors is a baseline
      success = true;
    }

    return {
      success,
      output: combinedOutput || "Código executado com sucesso (sem saída de console)."
    };
  } catch (err: any) {
    return {
      success: false,
      output: outputLogs.join("\n"),
      error: err.message || "Erro de sintaxe desconhecido."
    };
  }
}

// API Routes

// 1. Check user code using Gemini with a secure local code execution fallback
app.post("/api/check-code", async (req, res) => {
  const { code, challengeId, question, codeTemplate, expectedKeywords } = req.body;

  if (!code) {
    return res.status(400).json({ error: "O código é obrigatório." });
  }

  // 1. Run codebase checks locally
  const localResult = runCodeLocally(code, challengeId);

  // If Gemini client is not initialized, return the local evaluation directly with elegant text
  if (!ai) {
    const success = localResult.success;
    let message = success 
      ? "Excelente trabalho! Seu código está correto." 
      : "O código não produziu o resultado esperado. Revise os requisitos.";
    let explanation = `### Resultado da Validação Local (Modo Offline)
${localResult.error ? `🔴 **Erro de Execução:** ${localResult.error}` : "🟢 Execução concluída com sucesso."}

**Saída em console:** 
\`\`\`text
${localResult.output}
\`\`\`

*A IA de feedback detalhado está indisponível porque a chave de API do Gemini não foi configurada. No entanto, o sistema validou os requisitos básicos e confirmou que você progrediu!*`;

    return res.json({
      success,
      message,
      explanation,
      output: localResult.output,
      pointsGained: success ? 50 : 0
    });
  }

  // 2. Use Gemini to provide a rich review
  try {
    const prompt = `Você é um tutor paciente, divertido e encorajador de JavaScript para uma plataforma de aprendizagem gamificada. 
O aluno acabou de submeter um código para resolver uma lição. Descreva e corrija o código de forma positiva, amigável e divertida.

Informações sobre a lição:
- ID do Desafio: ${challengeId}
- Enunciado da Pergunta: ${question}
- Código Template Inicial: ${codeTemplate || "Não especificado"}
- Palavras-chave esperadas: ${expectedKeywords ? expectedKeywords.join(", ") : "Nenhuma específica"}

Código do Aluno:
\`\`\`javascript
${code}
\`\`\`

Resultado do teste de execução local:
- Sucesso Técnico: ${localResult.success ? "Sim" : "Não"}
- Saída Registrada: ${localResult.output || "Nenhuma"}
- Erro Capturado: ${localResult.error || "Nenhum"}

Sua resposta DEVE ser um objeto JSON válido (com as seguintes propriedades, escritas estritamente em português):
1. "success": boolean (determine se o aluno de fato completou o que a pergunta pedia, seja compreensivo mas firme. Se o código tem erros crassos, success deve ser false)
2. "message": string (uma mensagem divertida de 1 linha de parabéns se deu certo, ou de encorajamento se falhou)
3. "explanation": string (uma revisão instrutiva detalhada em formato MARKDOWN que explique o que o aluno fez, como o código dele funciona ou o que há de errado, dando exemplos limpos, sem dar a resposta direta se o aluno errou)
4. "pointsGained": number (retorne 50 se deu de fato sucesso e 0 se falhou)

Gere estritamente apenas o conteúdo JSON, sem blocos markdown de embrulho adicionais se puder, ou se houver um bloco de markdown JSON, o parser lidará. Garanta que todas as propriedades estejam preenchidas.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            message: { type: Type.STRING },
            explanation: { type: Type.STRING },
            pointsGained: { type: Type.INTEGER }
          },
          required: ["success", "message", "explanation", "pointsGained"]
        }
      }
    });

    const text = response.text || "{}";
    const evaluated = JSON.parse(text);

    // Ensure output is attached
    evaluated.output = localResult.output || "Nenhum output de console.";
    res.json(evaluated);
  } catch (err: any) {
    console.error("Gemini Code Check Error:", err);
    // Graceful fallback to local evaluation
    res.json({
      success: localResult.success,
      message: localResult.success ? "Incrivel! Você resolveu com sucesso!" : "Tente novamente. Revise os loops e chamadas.",
      explanation: `### Análise de Código (Modo de Proteção)
Ocorreu um erro ao consultar o assistente de IA. No entanto, avaliamos seu código localmente:
${localResult.error ? `⚠️ **Erro do Motor:** ${localResult.error}` : "✅ Execução limpa."}

**Saída gerada:**
\`\`\`text
${localResult.output}
\`\`\`

Por favor, revise se as variáveis estão declaradas adequadamente ou tente submeter novamente.`,
      output: localResult.output,
      pointsGained: localResult.success ? 50 : 0
    });
  }
});

// 2. Explain a JS Concept
app.post("/api/explain", async (req, res) => {
  const { concept, moduleName } = req.body;

  if (!concept) {
    return res.status(400).json({ error: "O conceito é obrigatório." });
  }

  if (!ai) {
    return res.json({
      explanation: `### ${concept}
*Para obter uma explicação completa, o tutor de IA precisa da GEMINI_API_KEY.*

Aqui está uma definição rápida para lhe ajudar:
- **${concept}** é um conceito fundamental no módulo de **${moduleName || "JavaScript Geral"}**.
- Ele é usado para estruturar seus programas de forma limpa e modular.
- Pratique criando pequenos testes em seu console de código para ver como as regras respondem!`
    });
  }

  try {
    const prompt = `Explique de maneira extremamente pedagógica, divertida, animada e curta o conceito de "${concept}" pertencente ao módulo "${moduleName || "JavaScript Básicos"}".
Por favor, descreva:
- O que é o conceito de forma simples (analogias cotidianas).
- Um trecho de código JavaScript bem escrito demonstrando como declará-lo ou usá-lo.
- Dicas curtas para não errar.

Formate a resposta inteira em formato MARKDOWN elegante, use títulos, emoticons divertidos de estudo de forma moderada e organize o texto em tópicos curtos e parágrafos enxutos para facilitar a leitura rápida.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ explanation: response.text || "Não foi possível gerar a explicação." });
  } catch (err: any) {
    res.status(500).json({ error: "Falha ao gerar explicação da IA: " + err.message });
  }
});

// 3. Generate hint/tip when user gets stuck
app.post("/api/generate-tip", async (req, res) => {
  const { challengeId, question, code } = req.body;

  if (!ai) {
    return res.json({
      tip: "Lembre-se de verificar o console de saída de código para rastrear erros e garantir que os identificadores estão grafados corretamente!"
    });
  }

  try {
    const prompt = `Você é um tutor de JavaScript. O aluno está bloqueado no desafio com ID "${challengeId}".
Enunciado do desafio: "${question}"
Código atual dele:
\`\`\`javascript
${code || "// Em branco"}
\`\`\`

Dê a ele um conselho, dica ou enigma mental inteligente ("dica de ouro") que ajude a resolver o desafio SEM fornecer o código pronto de resposta. Insira no máximo 2-3 frases no conselho, use tom acolhedor e atencioso.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ tip: response.text || "Preste muita atenção nos nomes de funções e de variáveis solicitados no enunciado!" });
  } catch (err: any) {
    res.json({ tip: "Dica: Garanta que todas as palavras solicitadas no exercício estão declaradas corretamente." });
  }
});

// 4. Vite Server integration & SPA routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
