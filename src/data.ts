import { Module, Achievement, CommunityPost, RankingUser } from "./types";

export const INITIAL_MODULES: Module[] = [
  {
    id: "mod_0",
    title: "Módulo 0: Missão Inicial",
    description: "Dê o primeiro passo no mundo da programação escrevendo seu primeiro script em JavaScript.",
    unlocked: true,
    completed: false,
    iconName: "Compass",
    lessons: [
      {
        id: "l_0_1",
        title: "O que é JavaScript?",
        description: "Introdução ao papel do JavaScript na Web moderna e o uso do console do navegador.",
        content: `### O que é o JavaScript?
O **JavaScript (JS)** é a linguagem de programação que torna as páginas da web interativas. Enquanto o HTML define a estrutura e o CSS define o estilo, o JavaScript dá **comportamento** e vida às páginas!

### Introdução ao console.log
A ferramenta mais básica e indispensável de qualquer desenvolvedor é o \`console.log()\`. Ele é uma função embutida que imprime informações diretamente no console de depuração do navegador ou servidor.

\`\`\`javascript
console.log("Olá do JavaScript!");
\`\`\`

Isso é fundamental para depurar suas ideias e entender as saídas à medida que você programa. Vamos escrever seu primeiro "Hello World" na aba de Desafios ao lado!`,
        snippet: "console.log('Olá Mundo!');"
      }
    ],
    challenges: [
      {
        id: "initial_mission",
        title: "Sua Primeira Missão",
        description: "Escreva seu primeiro comando JavaScript.",
        question: "Use a instrução 'console.log' para exibir o texto 'Hello World' na tela. Lembre-se de colocar as aspas adequadamente e fechar com parênteses.",
        template: "// Digite abaixo seu primeiro comando\nconsole.log('Hello World');",
        expectedKeywords: ["console.log", "Hello World"],
        isCompleted: false
      }
    ]
  },
  {
    id: "mod_1",
    title: "Módulo 1: Variáveis e Tipos",
    description: "Aprenda a armazenar valores, nomear referências e usar tipos primitivos de dados.",
    unlocked: false,
    completed: false,
    iconName: "Variable",
    lessons: [
      {
        id: "l_1_1",
        title: "Declarando Variáveis com let e const",
        description: "A diferença fundamental entre valores modificáveis e variáveis estáticas.",
        content: `### O que são Variáveis?
Variáveis são como caixas com rótulos onde guardamos dados que usaremos mais tarde. Em JavaScript moderno, usamos principalmente três palavras-chave:

1. **\`let\`**: Para valores que podem mudar ao longo da execução (variáveis reatribuíveis).
2. **\`const\`**: Para valores que nunca mudam depois de definidos (constantes).
3. **\`var\`**: Antigo método (evitado hoje em dia devido a problemas de escopo global).

\`\`\`javascript
let saldo = 100;
saldo = 120; // Válido!

const pi = 3.1415;
// pi = 3; // Erro! Constantes não aceitam alterações
\`\`\`

### Tipos de Dados Básicos (Primitivos)
- **String**: Linhas de texto declaradas entre aspas (\`"Texto"\` ou \`'Texto'\`).
- **Number**: Números inteiros ou decimais (\`25\`, \`3.14\`).
- **Boolean**: Valores lógicos: \`true\` (verdadeiro) ou \`false\` (falso).`,
        snippet: "let nome = \"Carlos\";\nconst idade = 20;"
      }
    ],
    challenges: [
      {
        id: "var_decl",
        title: "Crie suas Próprias Variáveis",
        description: "Pratique a criação de let e const.",
        question: "Declare uma variável usando 'let' chamada 'nome_aprendiz' com qualquer nome em texto, e uma constante 'pontuacao' definida de início com o valor numérico '100'.",
        template: "// Escreva seu código de declarações aqui\n",
        expectedKeywords: ["let", "const", "nome_aprendiz", "pontuacao"],
        isCompleted: false
      }
    ]
  },
  {
    id: "mod_2",
    title: "Módulo 2: Funções Poderosas",
    description: "Organize seus scripts em blocos de códigos reutilizáveis que realizam ações e retornam valores.",
    unlocked: false,
    completed: false,
    iconName: "Zap",
    lessons: [
      {
        id: "l_2_1",
        title: "O que são Funções?",
        description: "Entenda parâmetros, retornos e a sintaxe clássica versus arrow functions.",
        content: `### O que são Funções?
Considere uma função como uma receita de bolo: você passa certos ingredientes (parâmetros/argumentos), executa passos definidos e fornece um resultado final (retorno).

### Sintaxe Clássica:
\`\`\`javascript
function prepararSuco(fruta) {
  return "Suco de " + fruta;
}

let meuSuco = prepararSuco("Uva");
console.log(meuSuco); // Exibe: "Suco de Uva"
\`\`\`

### Arrow Functions (Funções de Seta):
Uma forma limpa de escrever funções introduzida no ES6:
\`\`\`javascript
const triplicar = (numero) => {
  return numero * 3;
};
\`\`\`

**Atenção:** Se você não usar a palavra-chave **\`return\`**, sua função retornará \`undefined\` por padrão!`,
        snippet: "function somar(a, b) {\n  return a + b;\n}"
      }
    ],
    challenges: [
      {
        id: "func_decl",
        title: "Sua Primeira Função de Retorno",
        description: "Crie uma lógica para somar valores.",
        question: "Crie uma função declarada tradicionalmente chamada 'calcularDobro' que aceita um parâmetro numérico (ex: 'numero') e retorna o dobro desse número. Teste chamando seu método com um valor qualquer no console.",
        template: "function calcularDobro(numero) {\n  // Escreva o return aqui\n}",
        expectedKeywords: ["function", "return", "calcularDobro"],
        isCompleted: false
      }
    ]
  },
  {
    id: "mod_3",
    title: "Módulo 3: Tomada de Decisão & Loops",
    description: "Ensine seu código a agir de modos diferentes com if/else e repetir tarefas usando loops estruturados.",
    unlocked: false,
    completed: false,
    iconName: "Repeat",
    lessons: [
      {
        id: "l_3_1",
        title: "Condicionais e Loops",
        description: "Tomando decisões de fluxo com if/else e realizando loops de repetição para varrer listas.",
        content: `### Lógica Condicional: if e else
O bloco \`if\` executa um trecho de código apenas se uma condição for verdadeira. Se for falsa, passa ao \`else\`.

\`\`\`javascript
let temperatura = 32;
if (temperatura > 30) {
  console.log("Está muito quente!");
} else {
  console.log("Está ameno.");
}
\`\`\`

### Loops de Repetição: O famoso Loop for
Muitas vezes precisamos repetir uma rotina várias vezes. O loop \`for\` resolve isso com maestria:

\`\`\`javascript
for (let i = 0; i < 3; i++) {
  console.log("Execução número: " + i);
}
// Logará 0, depois 1, depois 2
\`\`\``,
        snippet: "for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}"
      }
    ],
    challenges: [
      {
        id: "loops",
        title: "Repetindo Mensagens no Console",
        description: "Pratique loops básicos.",
        question: "Desenvolva um loop 'for' simples que conta de 1 a 3. Em cada iteração, mostre a contagem no console usando 'console.log(i)'.",
        template: "// Desenvolva o bloco for aqui de 1 a 3\n",
        expectedKeywords: ["for", "console.log"],
        isCompleted: false
      }
    ]
  },
  {
    id: "mod_4",
    title: "Módulo 4: Manipulação de DOM",
    description: "Torne-se capaz de alterar textos de páginas HTML, reagir a cliques de botões e estilizar elementos dinamicamente.",
    unlocked: false,
    completed: false,
    iconName: "MousePointer",
    lessons: [
      {
        id: "l_4_1",
        title: "Interagindo com Páginas Web",
        description: "Conheça o documento global, como buscar elementos no browser e responder com eventos de clique.",
        content: `### O que é o DOM?
O **DOM (Document Object Model)** é a representação em memória do HTML da página. No JS do navegador, a variável global \`document\` é nossa ponte para falar com ele.

### Selecionando Elementos
- \`document.querySelector(".classe")\`: Seleciona o primeiro elemento que corresponde à classe CSS.
- \`document.getElementById("id-unico")\`: Seleciona pelo atributo ID.

### Ouvindo Cliques e Eventos
Você pode fazer com que um elemento execute funções sob eventos. O mais comum é o de clique:

\`\`\`javascript
const botao = document.querySelector("#meuBotao");
botao.addEventListener("click", () => {
  console.log("O botão foi clicado!");
});
\`\`\`

### Alterando o Texto e Estilo
\`\`\`javascript
const container = document.querySelector("#titulo");
container.textContent = "Olá da Manipulação!";
container.style.color = "blue";
\`\`\``,
        snippet: "const titulo = document.getElementById('titulo');\ntitulo.style.fontSize = '24px';"
      }
    ],
    challenges: [
      {
        id: "dom_select",
        title: "Simule interações de DOM",
        description: "Crie escutas eletrônicas de interações.",
        question: "Crie uma seleção com 'document.querySelector' guardando o elemento de classe '.botao-avancar' em uma const chamada 'botao'. A seguir, adicione um ouvinte para o evento 'click' que executa um console.log('DOM ativo').",
        template: "// Declare a const botao e depois chame addEventListener\n",
        expectedKeywords: ["document.querySelector", ".botao-avancar", "addEventListener", "click"],
        isCompleted: false
      }
    ]
  },
  {
    id: "mod_5",
    title: "Módulo 5: Comunicação com APIs",
    description: "Obtenha dados do mundo real em servidores externos através de requisições assíncronas.",
    unlocked: false,
    completed: false,
    iconName: "Globe",
    lessons: [
      {
        id: "l_5_1",
        title: "Requisições com Fetch e Promises",
        description: "Utilize chamadas à internet com fetch, async, await e retornos do tipo JSON.",
        content: `### O que são APIs e chamadas assíncronas?
Muitas vezes, as páginas precisam de informações de outros servidores (ex.: clima atualizado, cotações). Para buscar isso sem congelar a tela do usuário, o JavaScript usa operações **assíncronas**.

### A API Fetch moderna
O método \`fetch()\` faz uma requisição HTTP pela internet. Como isso leva tempo, ele retorna uma **Promise** (Promessa de resposta futura).

### Usando Async/Await
A sintaxe moderna e elegante para gerenciar Promises:

\`\`\`javascript
async function buscarClima() {
  const resposta = await fetch("https://api.weather.com/dados");
  const dadosInJSON = await resposta.json();
  console.log("Temperatura atual:", dadosInJSON.temp);
}
\`\`\`

Pratique estruturando uma requisição na aba de desafios!`,
        snippet: "async function carregarDados() {\n  const res = await fetch('url');\n  return await res.json();\n}"
      }
    ],
    challenges: [
      {
        id: "fetch_api",
        title: "Seu primeiro fetch assíncrono",
        description: "Capture dados remotos de forma assíncrona.",
        question: "Crie uma função assíncrona usando 'async function' chamada 'obterUsuarios' que realiza uma requisição 'fetch' no endereço fictício 'https://api.usuarios.com'. Em seguida, use 'await' para obter o JSON da resposta e retorne o resultado.",
        template: "async function obterUsuarios() {\n  // Implemente o fetch e o json da resposta\n}",
        expectedKeywords: ["async function", "fetch", "await", "return"],
        isCompleted: false
      }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "hello_world",
    title: "Primeiro Script",
    description: "Escreveu 'Hello World' com sucesso no console.",
    iconName: "CheckCircle",
    unlocked: false,
    rarity: "Comum"
  },
  {
    id: "var_master",
    title: "Mestre das Caixas",
    description: "Criou e nomeou variáveis primitivas com let e const.",
    iconName: "Variable",
    unlocked: false,
    rarity: "Comum"
  },
  {
    id: "func_wizard",
    title: "Arquiteto de Funções",
    description: "Declarou funções recursivas ou com retorno estruturado.",
    iconName: "Zap",
    unlocked: false,
    rarity: "Raro"
  },
  {
    id: "loop_king",
    title: "Soberano dos Loops",
    description: "Criou rotinas autônomas de contagem incremental.",
    iconName: "Repeat",
    unlocked: false,
    rarity: "Raro"
  },
  {
    id: "dom_hacker",
    title: "Mestre da Web Dinâmica",
    description: "Capturou cliques adicionando ouvintes ao DOM do navegador.",
    iconName: "MousePointer",
    unlocked: false,
    rarity: "Épico"
  },
  {
    id: "api_wizard",
    title: "Místico Assíncrono",
    description: "Integrou requisições de servidores reais com async/await.",
    iconName: "Globe",
    unlocked: false,
    rarity: "Lendário"
  },
  {
    id: "streak_3",
    title: "Constância do Programador",
    description: "Mantenha o círculo de aprendizado ativo por mais de 3 dias.",
    iconName: "Flame",
    unlocked: false,
    rarity: "Raro"
  },
  {
    id: "goal_reached",
    title: "Meta Diária Conquistada",
    description: "Estude por 15 minutos ou mais no mesmo dia.",
    iconName: "Award",
    unlocked: false,
    rarity: "Comum"
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post_1",
    author: "AnaDev_JS",
    userTitle: "🌟 Veterana",
    avatarColor: "bg-emerald-500",
    content: "Pessoal, para quem está apanhando com funções de seta (Arrow Functions), pensem nelas como atalhos inteligentes. Se não colocar chaves '{}', o retorno é implícito! Ex: 'const dobro = x => x * 2'. Economiza muito código!",
    likes: 24,
    hasLiked: false,
    createdAt: "Hoje às 14:15",
    comments: [
      {
        id: "c_1_1",
        author: "DevCurioso",
        avatarColor: "bg-cyan-500",
        content: "Nossa, isso clareou muito minha mente! Estava quebrando a cabeça porque faltava o 'return' quando eu abria chaves.",
        createdAt: "Hoje às 14:26"
      }
    ]
  },
  {
    id: "post_2",
    author: "GatoCodificador",
    userTitle: "🐱 Mascote JS",
    avatarColor: "bg-amber-500",
    content: "Acabei de completar a missão semanal de Arrays! A dica é usar sempre 'const' para inicializar arrays. Você não pode reatribuir o array, mas pode usar '.push()' para mudar elementos dele! #DicaDoGato 🐾",
    likes: 19,
    hasLiked: false,
    createdAt: "Ontem às 18:03",
    comments: []
  },
  {
    id: "post_3",
    author: "MarcosVite",
    userTitle: "🎓 Monitor de Turma",
    avatarColor: "bg-indigo-500",
    content: "Alguém já realizou requisições para a API do Github? É um ótimo exercício pós-módulo 5 para buscar avatares de desenvolvedores. Recomendo usar async/await para deixar o visual limpo.",
    likes: 12,
    hasLiked: false,
    createdAt: "Há 2 dias",
    comments: []
  }
];

export const INITIAL_LEADERBOARD: RankingUser[] = [
  { id: "r_1", name: "Vinicius_ProMaster", xp: 1250, level: 8, avatar: "👨‍💻", isCurrentUser: false },
  { id: "r_2", name: "Leticia_Codes", xp: 870, level: 5, avatar: "👩‍🚀", isCurrentUser: false },
  { id: "r_3", name: "Eduardo_JS_Zero", xp: 520, level: 3, avatar: "👨‍🎓", isCurrentUser: false },
  { id: "r_user", name: "Você (Aprendiz)", xp: 0, level: 0, avatar: "🦁", isCurrentUser: true },
  { id: "r_4", name: "Dev_Gato", xp: 350, level: 2, avatar: "🐱", isCurrentUser: false },
  { id: "r_5", name: "Isabela_Vite", xp: 190, level: 1, avatar: "👩‍💻", isCurrentUser: false }
];
