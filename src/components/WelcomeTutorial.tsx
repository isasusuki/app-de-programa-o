import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Trophy, Flame, ChevronRight, Play, Star } from "lucide-react";

interface WelcomeTutorialProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function WelcomeTutorial({ onClose, isOpen }: WelcomeTutorialProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Boas-vindas, Futuro Mestre do JavaScript! 🚀",
      description: "Esta é a sua plataforma gamificada de aprendizagem de JavaScript. Aqui você aprende na prática, cumpre desafios e acumula conhecimento real.",
      icon: <Star className="w-16 h-16 text-yellow-500 animate-pulse" />,
      highlight: "Você começa no Nível 0 e sem metas acumuladas."
    },
    {
      title: "Como Progredir e Subir de Nível? 🏆",
      description: "Complete lições explicativas e resolva desafios práticos de programação. Cada desafio bem-sucedido concede 50 XP. Acelere sua pontuação para passar de nível e subir no ranking semanal!",
      icon: <Trophy className="w-16 h-16 text-yellow-400" />,
      highlight: "Desbloqueie conquistas exclusivas à medida que ganha XP."
    },
    {
      title: "Mantenha o Foco e a Constância! 🔥",
      description: "O segredo para se tornar um ótimo dev é a prática recorrente. Configure sua meta diária de estudo (ex.: 15 minutos). Mantenha sua chama (Streak) ativa estudando todos os dias sem interrupção!",
      icon: <Flame className="w-16 h-16 text-orange-500" />,
      highlight: "Seus dias seguidos de estudo são calculados em tempo real!"
    },
    {
      title: "Sua Primeira Missão! 🧭",
      description: "Para desbloquear o primeiro módulo conceitual (Variáveis), você recebeu uma missão simples de estreia: Escreva seu primeiro 'console.log(\"Hello World\")' no mini-editor.",
      icon: <Compass className="w-16 h-16 text-yellow-500" />,
      highlight: "Conclua a missão de boas-vindas para destravar o Módulo 1!"
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-zinc-900 border border-zinc-800 max-w-lg w-full rounded-[2.2rem] shadow-2xl overflow-hidden p-8 relative"
          id="welcome-modal"
        >
          {/* Glowing ambient blob inside tutorial */}
          <div className="absolute -right-16 -top-16 w-36 h-36 bg-yellow-400/5 blur-[55px] rounded-full" />
          
          {/* Progress indicators */}
          <div className="flex gap-1.5 justify-center mb-6 relative z-10">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === step ? "w-8 bg-yellow-400" : "w-2 bg-zinc-800"
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col items-center text-center relative z-10">
            {/* Step Icon */}
            <div className="mb-6 bg-zinc-950 p-5 rounded-full border border-zinc-800 shadow-inner">
              {steps[step].icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-black text-zinc-100 mb-3 tracking-tight">
              {steps[step].title}
            </h3>

            {/* Description */}
            <p className="text-zinc-350 text-sm mb-6 leading-relaxed font-medium">
              {steps[step].description}
            </p>

            {/* Informational tip box */}
            <div className="w-full bg-zinc-950 border border-zinc-850 p-4 rounded-2xl mb-6">
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase block mb-1 font-bold">
                Dica do Sistema
              </span>
              <p className="text-xs text-yellow-400 font-medium">
                💡 {steps[step].highlight}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between mt-4 relative z-10">
            <button
              onClick={onClose}
              className="text-xs text-zinc-500 hover:text-zinc-350 transition-colors font-bold uppercase tracking-wider cursor-pointer"
              id="skip-tutorial"
            >
              Pular tutorial
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(prev => prev + 1)}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-md"
                id="next-tutorial-step"
              >
                Continuar
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="bg-yellow-400 hover:bg-yellow-350 text-zinc-950 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-yellow-400/10 transition-all cursor-pointer"
                id="finish-tutorial"
              >
                Começar Jornada!
                <Play className="w-4 h-4 fill-zinc-950" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
