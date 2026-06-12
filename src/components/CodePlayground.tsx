import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Module, Challenge, Lesson } from "../types";
import { 
  Play, 
  Send, 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  ChevronRight, 
  Terminal, 
  RefreshCw,
  Share2
} from "lucide-react";

interface CodePlaygroundProps {
  module: Module;
  onChallengeSuccess: (challengeId: string, xpGained: number) => void;
  onShareSolution: (code: string, challengeTitle: string) => void;
}

export default function CodePlayground({ module, onChallengeSuccess, onShareSolution }: CodePlaygroundProps) {
  const [activeTab, setActiveTab] = useState<"lesson" | "editor">("lesson");
  const [activeLesson, setActiveLesson] = useState<Lesson>(module.lessons[0]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge>(module.challenges[0]);

  const [code, setCode] = useState(activeChallenge.template);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [isRunningLocal, setIsRunningLocal] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGettingTip, setIsGettingTip] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  
  const [evaluationResult, setEvaluationResult] = useState<{
    success: boolean;
    message: string;
    explanation: string;
  } | null>(null);

  const [aiTip, setAiTip] = useState<string | null>(null);
  const [aiTopicDetail, setAiTopicDetail] = useState<string | null>(null);

  // Sync state when active module changes
  useEffect(() => {
    setActiveLesson(module.lessons[0]);
    setActiveChallenge(module.challenges[0]);
    setCode(module.challenges[0].template);
    setConsoleOutput("");
    setEvaluationResult(null);
    setAiTip(null);
    setAiTopicDetail(null);
    setActiveTab("lesson");
  }, [module]);

  // Execute Code Locally
  const handleRunLocalByAPI = async () => {
    setIsRunningLocal(true);
    setConsoleOutput("Executando script...");
    try {
      const response = await fetch("/api/check-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          challengeId: activeChallenge.id,
          question: activeChallenge.question,
          codeTemplate: activeChallenge.template,
          onlyLocal: true
        })
      });
      const data = await response.json();
      setConsoleOutput(data.output || "Nenhum output de log registrado.");
    } catch (err: any) {
      setConsoleOutput("[Erro Crítico]: Falha ao comunicar com o servidor: " + err.message);
    } finally {
      setIsRunningLocal(false);
    }
  };

  // Submit code for AI tutor evaluation
  const handleEvaluateAI = async () => {
    setIsEvaluating(true);
    setEvaluationResult(null);
    setAiTip(null);
    try {
      const response = await fetch("/api/check-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          challengeId: activeChallenge.id,
          question: activeChallenge.question,
          codeTemplate: activeChallenge.template,
          expectedKeywords: activeChallenge.expectedKeywords
        })
      });

      const data = await response.json();
      setEvaluationResult({
        success: data.success,
        message: data.message,
        explanation: data.explanation
      });

      if (data.output) {
        setConsoleOutput(data.output);
      }

      if (data.success) {
        onChallengeSuccess(activeChallenge.id, data.pointsGained || 50);
      }
    } catch (err: any) {
      setEvaluationResult({
        success: false,
        message: "Ocorreu uma falha no sistema de ia.",
        explanation: "Dificuldade na conexão. Resolução local: seu código possui algum erro de execução que impediu a resposta. Verifique as aspas e os pontos e vírgulas."
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  // Request tutor tip
  const handleGetTip = async () => {
    setIsGettingTip(true);
    setAiTip(null);
    try {
      const response = await fetch("/api/generate-tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: activeChallenge.id,
          question: activeChallenge.question,
          code
        })
      });
      const data = await response.json();
      setAiTip(data.tip || "Procure ajustar as declarações de strings.");
    } catch (err) {
      setAiTip("Verifique as restrições básicas do exercício para encontrar a saída.");
    } finally {
      setIsGettingTip(false);
    }
  };

  // AI Concept breakdown
  const handleExplainConcept = async (concept: string) => {
    setIsExplaining(true);
    setAiTopicDetail(null);
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept,
          moduleName: module.title
        })
      });
      const data = await response.json();
      setAiTopicDetail(data.explanation);
    } catch (err) {
      setAiTopicDetail("Houve um problema de conexão com a IA. Tente mais tarde.");
    } finally {
      setIsExplaining(false);
    }
  };

  // Reset Template
  const handleReset = () => {
    setCode(activeChallenge.template);
    setEvaluationResult(null);
    setAiTip(null);
    setConsoleOutput("");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] shadow-xl overflow-hidden flex flex-col min-h-[550px] relative" id="playground-panel">
      {/* Module Title Header */}
      <div className="bg-zinc-950 border-b border-zinc-800 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-yellow-400/5 blur-[25px] rounded-full" />
        <div className="relative z-10">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-yellow-500 block mb-0.5">
            {module.id === "mod_0" ? "Iniciação Obrigatória" : "Estudo Prático"}
          </span>
          <h3 className="text-lg font-black text-zinc-100 tracking-tight">
            {module.title}
          </h3>
        </div>

        {/* Tab Selector */}
        <div className="bg-zinc-900 p-1 border border-zinc-800 rounded-xl flex self-stretch sm:self-auto relative z-10">
          <button
            onClick={() => setActiveTab("lesson")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer uppercase tracking-wider ${
              activeTab === "lesson" 
                ? "bg-yellow-400 text-zinc-950 shadow-md" 
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            id="tab-btn-lesson"
          >
            <BookOpen className="w-3.5 h-3.5" />
            1. Lição Teórica
          </button>
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer uppercase tracking-wider ${
              activeTab === "editor" 
                ? "bg-yellow-400 text-zinc-950 shadow-md" 
                : "text-zinc-400 hover:text-zinc-200"
            }`}
            id="tab-btn-editor"
          >
            <Terminal className="w-3.5 h-3.5" />
            2. Desafio Prático
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:grid md:grid-cols-2 overflow-hidden">
        {/* LEFT COLUMN: THEORY or TASK STATEMENT */}
        <div className="border-r border-zinc-800 p-6 overflow-y-auto max-h-[500px]">
          {activeTab === "lesson" ? (
            <div className="space-y-6" id="lesson-text-view">
              <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed space-y-4">
                {/* Dynamically simulated simple markdown renderer split for formatting */}
                {activeLesson.content.split("\n\n").map((para, pIdx) => {
                  if (para.startsWith("### ")) {
                    return (
                      <h4 key={pIdx} className="text-base font-bold text-zinc-100 mt-6 tracking-tight border-b border-zinc-800 pb-1">
                        {para.replace("### ", "")}
                      </h4>
                    );
                  }
                  if (para.startsWith("1. ") || para.startsWith("- ")) {
                    return (
                      <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-zinc-300">
                        {para.split("\n").map((li, lIdx) => (
                          <li key={lIdx}>{li.replace(/^(\d+\.\s*|-\s*)/, "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (para.startsWith("```")) {
                    const cleanCode = para.replace(/```javascript|```/g, "").trim();
                    return (
                      <pre key={pIdx} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-xs text-center text-yellow-400 overflow-x-auto">
                        <code>{cleanCode}</code>
                      </pre>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-zinc-300 text-sm leading-relaxed">
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* Concepts Explaining buttons - dynamic tutors */}
              <div className="pt-4 border-t border-zinc-800/60">
                <h5 className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider">
                  Dúvidas sobre o conteúdo? Pergunte à nossa IA:
                </h5>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={isExplaining}
                    onClick={() => handleExplainConcept(activeLesson.title)}
                    className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    Explicar noções de {activeLesson.title.split(": ")[1] || activeLesson.title}
                  </button>
                </div>

                {/* AI Explanation Drawer inside the view */}
                <AnimatePresence>
                  {aiTopicDetail && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs text-zinc-300 leading-relaxed max-h-[300px] overflow-y-auto"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-850 pb-2 mb-2">
                        <span className="font-bold text-yellow-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-zinc-950" /> Tutoria Inteligente
                        </span>
                        <button 
                          onClick={() => setAiTopicDetail(null)} 
                          className="text-zinc-500 hover:text-zinc-300 text-[10px]"
                        >
                          Fechar
                        </button>
                      </div>
                      <div className="space-y-3 prose-mini font-sans">
                        {aiTopicDetail.split("\n").map((line, lidx) => (
                          <p key={lidx}>{line}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Advance to Editor Trigger Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setActiveTab("editor")}
                  className="bg-yellow-400 hover:bg-yellow-350 text-zinc-950 text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-yellow-400/10 uppercase tracking-widest"
                >
                  Ir para os Exercícios
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Tab === "editor": Challenge view details */
            <div className="space-y-4" id="challenge-details-view">
              <span className="bg-zinc-950 border border-zinc-800 text-yellow-400 text-[10px] font-bold font-mono px-2.5 py-1 rounded">
                EXERCÍCIO PRÁTICO
              </span>
              <h4 className="text-base font-black text-zinc-100">
                {activeChallenge.title}
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/65 p-4 rounded-xl border border-zinc-850 font-medium">
                {activeChallenge.question}
              </p>

              {/* Highlight expected variables/methods */}
              <div>
                <span className="text-[10px] text-zinc-550 font-mono block uppercase mb-1">
                  Requisitos analisados pelo validador:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeChallenge.expectedKeywords.map(keyword => (
                    <span 
                      key={keyword}
                      className="bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs px-2.5 py-1 font-mono rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hints panel */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <button
                    disabled={isGettingTip}
                    onClick={handleGetTip}
                    className="bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-350 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    {isGettingTip ? "Solicitando Dica..." : "Pedir Dica (Tutor IA)"}
                  </button>
                </div>

                <AnimatePresence>
                  {aiTip && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 bg-amber-950/20 border border-amber-900/30 p-3.5 rounded-xl text-xs text-amber-300 leading-relaxed"
                    >
                      💡 <strong>Dica de Ouro:</strong> {aiTip}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CODING WORKSPACE */}
        <div className="flex flex-col bg-zinc-950">
          {/* Header Controls for code panel */}
          <div className="bg-zinc-900 p-3 border-b border-zinc-850 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-zinc-450" />
              script.js
            </span>
            <button
              onClick={handleReset}
              className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Resetar Código
            </button>
          </div>

          {/* Interactive text editor zone */}
          <div className="flex-1 relative min-h-[220px] flex">
            {/* Line numbers effect */}
            <div className="w-10 bg-zinc-950/40 select-none text-right pr-2 pt-4 font-mono text-xs text-zinc-600 border-r border-zinc-900 leading-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-transparent p-4 font-mono text-xs text-yellow-400 leading-6 resize-none focus:outline-none focus:ring-0 w-full"
              placeholder="// Digite aqui o código javascript do seu módulo..."
              id="js-code-textarea"
            />
          </div>

          {/* Console / Output logs terminal bar */}
          <div className="bg-zinc-900/80 border-t border-zinc-800 p-4">
            <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block mb-2">
              Saída do Console do Aluno:
            </div>
            <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800 font-mono text-xs text-zinc-300 min-h-[60px] max-h-[100px] overflow-y-auto">
              {consoleOutput ? (
                <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
              ) : (
                <span className="text-zinc-600 block italic">Nenhum output registrado. Clique em 'Rodar código' para iniciar.</span>
              )}
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="bg-zinc-900 p-4 border-t border-zinc-800 flex items-center gap-2">
            <button
              disabled={isRunningLocal || isEvaluating}
              onClick={handleRunLocalByAPI}
              className="bg-zinc-800 hover:bg-zinc-750 text-zinc-250 text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
              title="Testar apenas saída de console locais rapidamente."
              id="run-local-script"
            >
              <Play className="w-3.5 h-3.5" />
              Rodar Código
            </button>

            <button
              disabled={isEvaluating}
              onClick={handleEvaluateAI}
              className="flex-1 bg-yellow-400 hover:bg-yellow-350 text-zinc-950 text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-yellow-400/10 uppercase tracking-widest disabled:opacity-50"
              id="evaluate-submission"
            >
              <Send className="w-3.5 h-3.5" />
              {isEvaluating ? "Validando no Servidor..." : "Enviar Resposta (Validar IA)"}
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER AREA / CONFIRMATIONS AND RESULTS */}
      <AnimatePresence>
        {evaluationResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`border-t p-5 transition-all ${
              evaluationResult.success 
                ? "bg-yellow-450/10 border-yellow-400/30" 
                : "bg-rose-950/20 border-rose-500/30"
            }`}
            id="evaluation-result-panel"
          >
            <div className="flex items-start gap-3">
              {evaluationResult.success ? (
                <CheckCircle className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5 animate-bounce" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-450 shrink-0 mt-0.5" />
              )}
              
              <div className="space-y-1.5">
                <span className={`text-sm font-bold block ${
                  evaluationResult.success ? "text-yellow-450" : "text-rose-400"
                }`}>
                  {evaluationResult.success ? "Desafio Concluído!" : "Correção do Tutor:"}
                </span>
                
                <p className="text-xs text-zinc-100 font-semibold leading-relaxed">
                  {evaluationResult.message}
                </p>

                {/* Rich markdown breakdown of corrections */}
                <div className="text-xs text-zinc-300 leading-relaxed font-normal bg-zinc-950/50 p-3 rounded border border-zinc-800/40 mt-2 max-h-[150px] overflow-y-auto prose-eval text-left">
                  {evaluationResult.explanation.split("\n").map((line, idx) => {
                    if (line.startsWith("### ")) return <h5 key={idx} className="font-bold text-zinc-200 mt-2 mb-1">{line.replace("### ", "")}</h5>;
                    if (line.startsWith("**")) return <p key={idx} className="font-semibold text-zinc-250">{line}</p>;
                    return <p key={idx} className="mb-1">{line}</p>;
                  })}
                </div>

                {evaluationResult.success && (
                  <div className="flex items-center gap-2 pt-3">
                    <span className="text-xs text-yellow-400 font-bold">
                      🎉 +50 XP Adicionados no seu perfil!
                    </span>
                    <button
                      onClick={() => onShareSolution(code, activeChallenge.title)}
                      className="bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-[11px] px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5 text-yellow-400" />
                      Compartilhar com a Comunidade
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
