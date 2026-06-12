import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserStats, Achievement, RankingUser } from "../types";
import { 
  Award, 
  Flame, 
  Clock, 
  Trophy, 
  Compass, 
  Variable, 
  Zap, 
  Repeat, 
  MousePointer, 
  Globe, 
  CheckCircle,
  HelpCircle,
  Settings,
  ArrowUp
} from "lucide-react";

interface UserProfileProps {
  stats: UserStats;
  achievements: Achievement[];
  leaderboard: RankingUser[];
  onSetDailyGoal: (minutes: number) => void;
  onSimulateStudy: (minutes: number) => void;
}

// Icon mapper for achievements
const getBadgeIcon = (name: string, className: string) => {
  const props = { className };
  switch (name) {
    case "CheckCircle": return <CheckCircle {...props} />;
    case "Variable": return <Variable {...props} />;
    case "Zap": return <Zap {...props} />;
    case "Repeat": return <Repeat {...props} />;
    case "MousePointer": return <MousePointer {...props} />;
    case "Globe": return <Globe {...props} />;
    case "Flame": return <Flame {...props} />;
    case "Award": return <Award {...props} />;
    default: return <Award {...props} />;
  }
};

export default function UserProfile({ stats, achievements, leaderboard, onSetDailyGoal, onSimulateStudy }: UserProfileProps) {
  const [showGoalSettings, setShowGoalSettings] = useState(false);
  const [activeSeconds, setActiveSeconds] = useState(0);

  // Active studying timer emulation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSeconds(prev => {
        if (prev >= 59) {
          onSimulateStudy(1); // Add 1 minute studied automatically to state
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onSimulateStudy]);

  // Compute stats helper
  const nextLevelXpNeeded = 100;
  const currentLevelXpProgress = stats.xp % 100;
  const levelProgressPercentage = Math.min(100, Math.floor((currentLevelXpProgress / nextLevelXpNeeded) * 100));
  
  const studyGoalPercentage = Math.min(100, Math.floor((stats.studyTimeToday / stats.dailyGoal) * 100));

  return (
    <div className="space-y-6" id="user-profile-wrapper">
      {/* Grid of Profile Stats cards (Bento cells) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Nível Level Box */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-yellow-400/5 blur-[30px] rounded-full" />
          <div className="w-14 h-14 rounded-full border-4 border-yellow-400 bg-zinc-950 flex items-center justify-center font-black font-sans text-yellow-400 text-xl mb-3 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
            {stats.level}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono font-bold tracking-wider uppercase">Nível do Aluno</span>
          <span className="text-sm font-extrabold text-zinc-200 mt-1">{stats.xp} Total XP</span>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-2 border border-zinc-850 overflow-hidden">
            <div className="bg-yellow-400 h-full transition-all duration-500" style={{ width: `${levelProgressPercentage}%` }} />
          </div>
          <span className="text-[9px] text-zinc-500 font-mono mt-1.5">{currentLevelXpProgress}/100 XP para Nvl {stats.level + 1}</span>
        </motion.div>

        {/* Diarias Streak Fire Box */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-orange-500/5 blur-[30px] rounded-full" />
          <div className="w-14 h-14 rounded-full bg-orange-950/20 flex items-center justify-center mb-3 border border-orange-500/25 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <span className="text-[10px] text-zinc-500 font-mono font-bold tracking-wider uppercase">Dias Seguidos</span>
          <span className="text-xl font-black text-orange-400 mt-1">{stats.streak} {stats.streak === 1 ? "Dia" : "Dias"}</span>
          <span className="text-[9px] text-zinc-500 font-mono mt-1.5">Estude todo dia para manter a chama!</span>
        </motion.div>

        {/* Study Goal Today Box */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-yellow-405/5 blur-[30px] rounded-full" />
          <div className="w-14 h-14 rounded-full bg-yellow-400/10 flex items-center justify-center mb-3 border border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
            <Clock className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-zinc-500 font-mono font-bold tracking-wider uppercase">Estudos Hoje</span>
            <button 
              onClick={() => setShowGoalSettings(prev => !prev)}
              className="text-zinc-400 hover:text-yellow-400 transition-colors"
              title="Ajustar Meta Diária de estudos"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <span className="text-sm font-extrabold text-zinc-200 mt-1">
            {stats.studyTimeToday} / {stats.dailyGoal} min
          </span>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-2 border border-zinc-850 overflow-hidden">
            <div className="bg-yellow-400 h-full transition-all duration-500" style={{ width: `${studyGoalPercentage}%` }} />
          </div>
          <span className="text-[9px] text-zinc-500 font-mono mt-1.5">Meta: {studyGoalPercentage}% concluída</span>
        </motion.div>

        {/* Active virtual study session helper */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/5 blur-[30px] rounded-full" />
          <div className="w-14 h-14 rounded-full bg-purple-950/20 border border-purple-500/25 flex items-center justify-center font-mono text-purple-400 font-extrabold mb-3 text-xs shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            {String(Math.floor(activeSeconds / 60)).padStart(2, "0")}:{String(activeSeconds % 60).padStart(2, "0")}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono font-bold tracking-wider uppercase">Timer de Estudo</span>
          <button
            onClick={() => onSimulateStudy(5)}
            className="mt-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[9px] text-zinc-300 font-black px-2.5 py-1.5 rounded-xl cursor-pointer hover:border-yellow-400 transition-colors uppercase tracking-wider"
          >
            ⚡ Simular +5m
          </button>
        </motion.div>
      </div>

      {/* Goal Settings popup panel */}
      <AnimatePresence>
        {showGoalSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] shadow-xl"
          >
            <h4 className="text-xs font-bold text-zinc-300 tracking-wider uppercase block mb-3">Defina sua Meta Diária de estudos de JavaScript:</h4>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 15, 30, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    onSetDailyGoal(mins);
                    setShowGoalSettings(false);
                  }}
                  className={`flex-1 text-xs px-4 py-3 font-extrabold rounded-2xl border cursor-pointer transition-all ${
                    stats.dailyGoal === mins 
                      ? "bg-yellow-400 text-zinc-950 border-yellow-400 shadow-md shadow-yellow-400/10" 
                      : "bg-zinc-950 text-zinc-400 border-zinc-850 hover:border-zinc-750"
                  }`}
                  id={`goal-option-${mins}`}
                >
                  {mins} min/dia
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Badges container (Achievements: 2 columns wide on desktop) */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-yellow-400/5 blur-[100px] rounded-full" />
            <h3 className="text-sm font-black text-zinc-150 tracking-wider mb-6 uppercase">
              Minhas Medalhas de Honra ({achievements.filter(a => a.unlocked).length}/{achievements.length})
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10">
              {achievements.map(ach => (
                <div
                  key={ach.id}
                  className={`border p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all relative ${
                    ach.unlocked 
                      ? "bg-zinc-950/60 border-zinc-800 shadow-lg" 
                      : "bg-zinc-950/15 border-zinc-90 w/40 opacity-40 select-none pb-4"
                  }`}
                >
                  {/* Badge Rarity label */}
                  <span className={`text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full absolute top-2 right-2 uppercase ${
                    ach.rarity === "Lendário" 
                      ? "bg-yellow-950/40 text-yellow-500 border border-yellow-800/30" 
                      : ach.rarity === "Épico" 
                      ? "bg-purple-950/40 text-purple-400 border border-purple-800/30"
                      : ach.rarity === "Raro"
                      ? "bg-blue-950/40 text-blue-400 border border-blue-800/30"
                      : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                  }`}>
                    {ach.rarity}
                  </span>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 mt-3 ${
                    ach.unlocked 
                      ? "bg-zinc-900 text-yellow-400 ring-2 ring-yellow-400/10" 
                      : "bg-zinc-950 text-zinc-500"
                  }`}>
                    {getBadgeIcon(ach.iconName, "w-6 h-6")}
                  </div>

                  {/* Text details */}
                  <h4 className="text-xs font-bold text-zinc-200 truncate max-w-[130px]">{ach.title}</h4>
                  <p className="text-[10px] text-zinc-400 leading-snug mt-1 max-w-[120px]">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard panel */}
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-yellow-400/5 blur-[100px] rounded-full" />
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />
              <h3 className="text-sm font-black text-zinc-150 tracking-wider uppercase">
                Ranking Semanal (Liga Crayon)
              </h3>
            </div>

            <div className="space-y-3 relative z-10">
              {leaderboard.map((ranking, idx) => {
                const position = idx + 1;
                
                return (
                  <div
                    key={ranking.id}
                    className={`p-3 rounded-2xl flex items-center justify-between border ${
                      ranking.isCurrentUser 
                        ? "bg-zinc-950 border-yellow-400 shadow-md shadow-yellow-450/10" 
                        : "bg-zinc-950/40 border-zinc-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Position placement badge */}
                      <span className={`w-5 text-center text-xs font-mono font-bold ${
                        position === 1 ? "text-yellow-400" : position === 2 ? "text-zinc-400" : position === 3 ? "text-amber-600" : "text-zinc-500"
                      }`}>
                        #{position}
                      </span>
                      
                      {/* Avatar */}
                      <span className="text-lg">{ranking.avatar}</span>
                      
                      <div>
                        <span className="text-xs font-bold text-zinc-200 block truncate max-w-[120px]">
                          {ranking.name}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono">Nível {ranking.level}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-right">
                      <span className="text-xs font-bold text-zinc-300">{ranking.xp} XP</span>
                      {ranking.isCurrentUser && (
                        <ArrowUp className="w-3 h-3 text-yellow-400 animate-bounce" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
