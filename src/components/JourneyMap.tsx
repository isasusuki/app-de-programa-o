import React from "react";
import { motion } from "motion/react";
import { Module } from "../types";
import { 
  Compass, 
  Variable, 
  Zap, 
  Repeat, 
  MousePointer, 
  Globe, 
  Lock, 
  CheckCircle2, 
  Star 
} from "lucide-react";

interface JourneyMapProps {
  modules: Module[];
  activeModuleId: string;
  onSelectModule: (module: Module) => void;
}

// Icon selector utility helper
const getModuleIcon = (name: string, className: string) => {
  const props = { className };
  switch (name) {
    case "Compass": return <Compass {...props} />;
    case "Variable": return <Variable {...props} />;
    case "Zap": return <Zap {...props} />;
    case "Repeat": return <Repeat {...props} />;
    case "MousePointer": return <MousePointer {...props} />;
    case "Globe": return <Globe {...props} />;
    default: return <Star {...props} />;
  }
};

export default function JourneyMap({ modules, activeModuleId, onSelectModule }: JourneyMapProps) {
  // zigzag layout helper to place nodes alternatively left-to-right
  const getZigzagClasses = (index: number) => {
    switch (index % 3) {
      case 0: return "md:col-start-1 md:col-span-1 flex-row";
      case 1: return "md:col-start-2 md:col-span-1 md:translate-x-12 flex-row-reverse";
      case 2: return "md:col-start-3 md:col-span-1 flex-row";
      default: return "";
    }
  };

  return (
    <div className="relative w-full py-8 px-4" id="journey-map-container">
      {/* SVG Connectors: Animated pathway line behind nodes */}
      <div className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-slate-800 z-0 hidden md:block" />

      <div className="max-w-4xl mx-auto flex flex-col md:grid md:grid-cols-3 gap-y-16 gap-x-8 relative z-10">
        {modules.map((mod, idx) => {
          const isActive = mod.id === activeModuleId;
          const isUnlocked = mod.unlocked;
          const isCompleted = mod.completed;
          const iconColor = isCompleted 
            ? "text-zinc-950" 
            : isActive 
            ? "text-yellow-400" 
            : isUnlocked 
            ? "text-zinc-200" 
            : "text-zinc-600";

          // Zigzag column placement
          const alignmentClass = getZigzagClasses(idx);

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className={`flex items-center gap-4 justify-start md:justify-center ${alignmentClass}`}
            >
              {/* Node bubble */}
              <div className="relative flex flex-col items-center">
                <button
                  disabled={!isUnlocked}
                  onClick={() => onSelectModule(mod)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-3 font-semibold transition-all relative cursor-pointer
                    ${isActive 
                      ? "bg-zinc-900 border-yellow-400 shadow-xl shadow-yellow-400/25 ring-4 ring-yellow-400/10 scale-110 text-yellow-400" 
                      : isCompleted
                      ? "bg-yellow-400 border-yellow-400 hover:bg-yellow-350 shadow-xl shadow-yellow-550/30 text-zinc-950"
                      : isUnlocked
                      ? "bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:border-yellow-400/60 hover:scale-105 text-zinc-100"
                      : "bg-zinc-950 border-zinc-900 cursor-not-allowed opacity-60 text-zinc-550"
                    }
                  `}
                  id={`journey-node-${mod.id}`}
                >
                  {/* Status Indicator Badges */}
                  {!isUnlocked ? (
                    <div className="absolute -top-1 -right-1 bg-zinc-800 text-zinc-400 p-1.5 rounded-full border border-zinc-700">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  ) : isCompleted ? (
                    <div className="absolute -top-1 -right-1 bg-zinc-950 text-yellow-400 p-1 rounded-full border border-zinc-800 shadow-md">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                    </div>
                  ) : isActive ? (
                    <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-zinc-950 px-1.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase animate-bounce">
                      Atual
                    </div>
                  ) : null}

                  {/* Dynamic icon */}
                  {getModuleIcon(mod.iconName, "w-9 h-9 " + iconColor)}
                </button>

                {/* Vertical line indicator for mobile */}
                {idx < modules.length - 1 && (
                  <div className="h-10 w-0.5 bg-zinc-800 my-2 md:hidden" />
                )}
              </div>

              {/* Module Text Details */}
              <div className="flex-1 md:text-center text-left py-2">
                <span className="text-xs font-mono font-bold text-zinc-500 tracking-wider block mb-1">
                  MÓDULO {idx}
                </span>
                <h4 className={`text-base font-black tracking-tight ${isUnlocked ? "text-zinc-100" : "text-zinc-500"}`}>
                  {mod.title.split(": ")[1] || mod.title}
                </h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed md:mx-auto">
                  {mod.description}
                </p>

                {isUnlocked && (
                  <button
                    onClick={() => onSelectModule(mod)}
                    className="text-xs font-extrabold text-yellow-400 hover:text-yellow-350 mt-2 flex items-center md:justify-center gap-1 cursor-pointer hover:underline"
                  >
                    {isCompleted ? "Rever lições" : isActive ? "Estudar Agora!" : "Avançar →"}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
