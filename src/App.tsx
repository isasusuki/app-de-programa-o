import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  MessageSquare, 
  User, 
  Compass, 
  Variable, 
  CheckCircle,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  ChevronRight,
  LogOut,
  Target
} from "lucide-react";

import { Module, UserStats, Achievement, CommunityPost, RankingUser } from "./types";
import { INITIAL_MODULES, INITIAL_ACHIEVEMENTS, INITIAL_POSTS, INITIAL_LEADERBOARD } from "./data";

import WelcomeTutorial from "./components/WelcomeTutorial";
import JourneyMap from "./components/JourneyMap";
import CodePlayground from "./components/CodePlayground";
import CommunitySection from "./components/CommunitySection";
import UserProfile from "./components/UserProfile";

export default function App() {
  // State definitions
  const [stats, setStats] = useState<UserStats>({
    level: 0,
    xp: 0,
    streak: 1, // Started today
    studyTimeToday: 0, // Minutes
    dailyGoal: 15, // Minutes
    hasCompletedFUX: false,
    initialMissionCompleted: false,
    onboardingStep: 0
  });

  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [leaderboard, setLeaderboard] = useState<RankingUser[]>(INITIAL_LEADERBOARD);
  
  const [activeTab, setActiveTab] = useState<"journey" | "community" | "profile">("journey");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showCelebration, setShowCelebration] = useState<string | null>(null);

  // Load from LocalStorage on mount to preserve achievements and stats safely
  useEffect(() => {
    const cachedStats = localStorage.getItem("js_learner_stats");
    const cachedModules = localStorage.getItem("js_learner_modules");
    const cachedAchievements = localStorage.getItem("js_learner_achievements");
    
    if (cachedStats) setStats(JSON.parse(cachedStats));
    if (cachedModules) setModules(JSON.parse(cachedModules));
    if (cachedAchievements) setAchievements(JSON.parse(cachedAchievements));
  }, []);

  // Save State helper
  const saveGameState = (newStats: UserStats, newModules: Module[], newAchieve: Achievement[]) => {
    setStats(newStats);
    setModules(newModules);
    setAchievements(newAchieve);
    localStorage.setItem("js_learner_stats", JSON.stringify(newStats));
    localStorage.setItem("js_learner_modules", JSON.stringify(newModules));
    localStorage.setItem("js_learner_achievements", JSON.stringify(newAchieve));
  };

  // Close tutorial onboarding modal
  const handleCloseOnboarding = () => {
    const updated = { ...stats, hasCompletedFUX: true, onboardingStep: -1 };
    setStats(updated);
    localStorage.setItem("js_learner_stats", JSON.stringify(updated));
  };

  // Handle successful submission in CodePlayground
  const handleChallengeSuccess = (challengeId: string, xpGained: number) => {
    // 1. Mark challenge as completed
    const updatedModules = modules.map(mod => {
      const isInitialMission = challengeId === "initial_mission";
      
      return {
        ...mod,
        challenges: mod.challenges.map(ch => {
          if (ch.id === challengeId) {
            return { ...ch, isCompleted: true };
          }
          return ch;
        }),
        // Complete current module if all its challenges are complete
        completed: mod.id === "mod_0" && challengeId === "initial_mission" 
          ? true 
          : mod.id === "mod_1" && challengeId === "var_decl"
          ? true
          : mod.id === "mod_2" && challengeId === "func_decl"
          ? true
          : mod.id === "mod_3" && challengeId === "loops"
          ? true
          : mod.id === "mod_4" && challengeId === "dom_select"
          ? true
          : mod.id === "mod_5" && challengeId === "fetch_api"
          ? true
          : mod.completed
      };
    });

    // 2. Progressive unlock: Complete current unlocks subsequent modules
    let unlockedNextModuleId = "";
    if (challengeId === "initial_mission") {
      unlockedNextModuleId = "mod_1";
    } else if (challengeId === "var_decl") {
      unlockedNextModuleId = "mod_2";
    } else if (challengeId === "var_decl") {
      unlockedNextModuleId = "mod_2";
    } else if (challengeId === "func_decl") {
      unlockedNextModuleId = "mod_3";
    } else if (challengeId === "loops") {
      unlockedNextModuleId = "mod_4";
    } else if (challengeId === "dom_select") {
      unlockedNextModuleId = "mod_5";
    }

    const nextModules = updatedModules.map(mod => {
      if (mod.id === unlockedNextModuleId) {
        return { ...mod, unlocked: true };
      }
      return mod;
    });

    // 3. Compute new XP and Level
    const newXp = stats.xp + xpGained;
    const computedLevel = Math.floor(newXp / 100);
    const didLevelUp = computedLevel > stats.level;

    const newStats: UserStats = {
      ...stats,
      xp: newXp,
      level: computedLevel,
      initialMissionCompleted: stats.initialMissionCompleted || challengeId === "initial_mission"
    };

    // 4. Handle achievement badges unlocks
    const nextAchievements = achievements.map(ach => {
      let shouldUnlock = ach.unlocked;
      if (challengeId === "initial_mission" && ach.id === "hello_world") {
        shouldUnlock = true;
      } else if (challengeId === "var_decl" && ach.id === "var_master") {
        shouldUnlock = true;
      } else if (challengeId === "func_decl" && ach.id === "func_wizard") {
        shouldUnlock = true;
      } else if (challengeId === "loops" && ach.id === "loop_king") {
        shouldUnlock = true;
      } else if (challengeId === "dom_select" && ach.id === "dom_hacker") {
        shouldUnlock = true;
      } else if (challengeId === "fetch_api" && ach.id === "api_wizard") {
        shouldUnlock = true;
      }

      if (shouldUnlock && !ach.unlocked) {
        return { ...ach, unlocked: true, dateUnlocked: new Date().toLocaleDateString("pt-BR") };
      }
      return ach;
    });

    // 5. Update Leaderboard position in real-time
    const nextLeaderboard = leaderboard.map(user => {
      if (user.isCurrentUser) {
        return { ...user, xp: newXp, level: computedLevel };
      }
      return user;
    }).sort((a, b) => b.xp - a.xp);

    setLeaderboard(nextLeaderboard);

    // Save state
    saveGameState(newStats, nextModules, nextAchievements);

    // Trigger celebration notifications
    if (didLevelUp) {
      setShowCelebration(`🎉 SUBIU DE NÍVEL! Você agora está no Nível ${computedLevel}!`);
    } else {
      setShowCelebration(`🤩 Desafio Resolvido! Ganhou +${xpGained} XP!`);
    }

    // Auto-update select module detail view
    const nextCurrentMod = nextModules.find(m => m.id === selectedModule?.id);
    if (nextCurrentMod) {
      setSelectedModule(nextCurrentMod);
    }

    // Auto close notification after 4s
    setTimeout(() => {
      setShowCelebration(null);
    }, 4500);
  };

  // Add tip to community tab from complete solution
  const handleShareSolution = (code: string, challengeTitle: string) => {
    const authorName = "Você (Aprendiz)";
    
    const newPost: CommunityPost = {
      id: "sh_" + Date.now(),
      author: authorName,
      userTitle: "🦁 Novato",
      avatarColor: "bg-cyan-500",
      content: `Compartilhei meu código de solução para o exercício de JavaScript: "${challengeTitle}". Fico feliz de avançar na trilha!`,
      codeSnippet: code,
      likes: 0,
      createdAt: "Agora mesmo",
      comments: []
    };

    const nextPosts = [newPost, ...posts];
    setPosts(nextPosts);
    setActiveTab("community");

    // Trigger simulated praise reply from helper bots
    setTimeout(() => {
      setPosts(prevPosts => {
        return prevPosts.map(p => {
          if (p.id === newPost.id) {
            const simulatedComments = [
              {
                id: "sc_1_" + Date.now(),
                author: "AnaDev_JS",
                avatarColor: "bg-emerald-500",
                content: "Uow, seu código ficou impecável! Muito organizado e seguiu as boas práticas. Continue evoluindo! 🚀",
                createdAt: "Há poucos segundos"
              },
              {
                id: "sc_2_" + Date.now(),
                author: "DevCurioso",
                avatarColor: "bg-cyan-500",
                content: "Excelente solução! Aprendi bastante vendo seu formato de retorno. Valeu por compartilhar!",
                createdAt: "Há poucos segundos"
              }
            ];
            return {
              ...p,
              comments: [...p.comments, ...simulatedComments]
            };
          }
          return p;
        });
      });
    }, 2800);
  };

  // Add post directly
  const handleAddPost = (content: string, codeSnippet?: string) => {
    const newPost: CommunityPost = {
      id: "p_" + Date.now(),
      author: "Você (Aprendiz)",
      userTitle: "🦁 Novato",
      avatarColor: "bg-cyan-500",
      content,
      codeSnippet,
      likes: 0,
      createdAt: "Agora mesmo",
      comments: []
    };

    setPosts([newPost, ...posts]);

    // Simulate reply after 3s
    setTimeout(() => {
      setPosts(prev => prev.map(p => {
        if (p.id === newPost.id) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: "sc_3_" + Date.now(),
                author: "GatoCodificador",
                avatarColor: "bg-amber-500",
                content: "Boa sacada! Fórum de apoio é a melhor forma de fixar o aprendizado. Conte conosco por aqui! 🐾",
                createdAt: "Há poucos segundos"
              }
            ]
          };
        }
        return p;
      }));
    }, 3000);
  };

  // Add comments dynamically
  const handleAddComment = (postId: string, commentText: string) => {
    const updatedPost = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: "u_c_" + Date.now(),
              author: "Você (Aprendiz)",
              avatarColor: "bg-cyan-500",
              content: commentText,
              createdAt: "Agora mesmo"
            }
          ]
        };
      }
      return p;
    });
    setPosts(updatedPost);
  };

  // Like posts
  const handleLikePost = (postId: string) => {
    const nextPosts = posts.map(p => {
      if (p.id === postId) {
        const liked = !p.hasLiked;
        return {
          ...p,
          likes: liked ? p.likes + 1 : p.likes - 1,
          hasLiked: liked
        };
      }
      return p;
    });
    setPosts(nextPosts);
  };

  // Set study goals
  const handleSetDailyGoal = (mins: number) => {
    const newStats = { ...stats, dailyGoal: mins };
    saveGameState(newStats, modules, achievements);
  };

  // Simulate study minutes
  const handleSimulateStudy = (mins: number) => {
    const nextMinutes = stats.studyTimeToday + mins;
    
    let nextAchievements = [...achievements];
    const reachGoal = nextMinutes >= stats.dailyGoal;

    if (reachGoal) {
      nextAchievements = achievements.map(ach => {
        if (ach.id === "goal_reached" && !ach.unlocked) {
          setShowCelebration("🏆 Parabéns! Você bateu sua meta diária de estudos de JavaScript hoje!");
          return { ...ach, unlocked: true, dateUnlocked: new Date().toLocaleDateString("pt-BR") };
        }
        return ach;
      });
    }

    const newStats = { ...stats, studyTimeToday: nextMinutes };
    saveGameState(newStats, modules, nextAchievements);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col antialiased">
      {/* Onboarding Tutorial Modal open on initial load */}
      <WelcomeTutorial 
        isOpen={!stats.hasCompletedFUX} 
        onClose={handleCloseOnboarding} 
      />

      {/* Top Header Navbar */}
      <header className="bg-zinc-950/60 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-40 px-6 md:px-10 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {/* Glowing Platform Icon */}
          <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.35)] shrink-0 border border-yellow-300/25">
            <span className="font-extrabold text-zinc-950 font-sans text-2xl tracking-tighter">JS</span>
          </div>
          <div>
            <h1 className="text-sm font-black text-zinc-100 uppercase tracking-wider block">Aprenda JavaScript</h1>
            <span className="text-[10px] text-yellow-500 font-mono tracking-wider block uppercase">A trilha gamificada de programação</span>
          </div>
        </div>

        {/* Global Stats indicators header */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden sm:flex items-center gap-2 bg-zinc-900/50 px-3.5 py-1.5 rounded-full border border-zinc-800" title="Sua pontuação acumulada">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold font-mono text-zinc-200">Nível {stats.level}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <span className="text-xs font-medium font-mono text-zinc-400">{stats.xp} XP</span>
          </div>

          <div className="flex items-center gap-1.5 bg-orange-950/20 px-3 py-1.5 rounded-full border border-orange-500/15" title="Chama de ofensiva diária">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-extrabold text-orange-400 font-mono">{stats.streak} Dias</span>
          </div>

          <div className="flex items-center gap-2 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20" title="Meta diária batida">
            <Target className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold font-mono text-yellow-400">{Math.min(100, Math.floor((stats.studyTimeToday / stats.dailyGoal) * 100))}%</span>
          </div>
        </div>
      </header>

      {/* Main Dynamic View Content layout Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDE BAR NAVIGATION */}
        <aside className="lg:col-span-1 space-y-5" id="navigation-aside">
          {/* Quick instructions / onboarding progress stats card with Bento grid style */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden shadow-xl shadow-zinc-950/20">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-yellow-400/10 blur-[60px] rounded-full" />
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-zinc-950 text-yellow-400 border border-zinc-800 text-[9px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded uppercase">
                Metas Ativas
              </span>
            </div>
            
            <h3 className="text-sm font-extrabold text-zinc-100 tracking-tight">Sua Missão Principal:</h3>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Escreva seu primeiro <code className="text-yellow-400 font-mono text-[10px]">console.log</code> e envie para validar o Módulo 1!
            </p>

            <div className="space-y-3 mt-4 pt-4 border-t border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                  stats.initialMissionCompleted ? "bg-yellow-400 border-yellow-400 text-zinc-950" : "bg-zinc-950 border-zinc-800"
                }`}>
                  {stats.initialMissionCompleted && <span className="text-[10px] font-bold">✓</span>}
                </div>
                <span className={`text-xs ${stats.initialMissionCompleted ? "text-zinc-500 line-through" : "text-zinc-200 font-medium"}`}>
                  Completar missão básica (Módulo 0)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                  stats.studyTimeToday >= stats.dailyGoal ? "bg-yellow-400 border-yellow-400 text-zinc-950" : "bg-zinc-950 border-zinc-800"
                }`}>
                  {stats.studyTimeToday >= stats.dailyGoal && <span className="text-[10px] font-bold">✓</span>}
                </div>
                <span className={`text-xs ${stats.studyTimeToday >= stats.dailyGoal ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
                  Meta Diária ({stats.studyTimeToday}/{stats.dailyGoal} min)
                </span>
              </div>
            </div>
          </div>

          {/* Core Tab Selector Navigation Controls */}
          <nav className="bg-zinc-900 border border-zinc-800 p-3 rounded-[2rem] flex flex-col gap-1.5 shadow-xl shadow-zinc-950/20">
            <button
              onClick={() => {
                setActiveTab("journey");
                setSelectedModule(null); // Back to map view
              }}
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "journey" && !selectedModule
                  ? "bg-yellow-400 text-zinc-950 shadow-lg shadow-yellow-400/25 border border-yellow-300/30" 
                  : "text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
              }`}
              id="nav-btn-journey"
            >
              <Compass className="w-4 h-4 shrink-0" />
              Mapa de Estudos (Trilha)
            </button>

            <button
              onClick={() => {
                setActiveTab("community");
                setSelectedModule(null);
              }}
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "community" 
                  ? "bg-yellow-400 text-zinc-950 shadow-lg shadow-yellow-400/25 border border-yellow-300/30" 
                  : "text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
              }`}
              id="nav-btn-community"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              Fórum de Aprendizes
            </button>

            <button
              onClick={() => {
                setActiveTab("profile");
                setSelectedModule(null);
              }}
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "profile" 
                  ? "bg-yellow-400 text-zinc-950 shadow-lg shadow-yellow-400/25 border border-yellow-300/30" 
                  : "text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
              }`}
              id="nav-btn-profile"
            >
              <User className="w-4 h-4 shrink-0" />
              Estatísticas & Títulos
            </button>
          </nav>
        </aside>

        {/* MAIN DISPLAY REGION */}
        <section className="lg:col-span-3 space-y-6">
          {/* Floating animated success or level up notifications overlay panel */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.95 }}
                className="bg-yellow-400 border border-yellow-300 text-zinc-950 p-4.5 rounded-2xl shadow-xl shadow-yellow-400/10 font-bold flex items-center justify-between gap-3 text-xs tracking-wider uppercase"
                id="celebration-toast"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-zinc-950 fill-zinc-950 animate-spin" />
                  <span>{showCelebration}</span>
                </div>
                <button 
                  onClick={() => setShowCelebration(null)} 
                  className="font-black text-zinc-900 text-xs px-2 hover:bg-yellow-500 rounded"
                >
                  X
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTIVE SCENE RENDER SWITCHER */}
          {activeTab === "journey" && (
            <>
              {selectedModule ? (
                /* Inside a loaded session module: Render editor space */
                <div className="space-y-4" id="active-module-lesson-playground">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedModule(null)}
                      className="text-xs text-yellow-400 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                      id="back-to-map-btn"
                    >
                      ← Voltar ao Mapa de Estudos
                    </button>
                    <span className="text-xs font-mono font-medium text-zinc-500">
                      Progresso da Sessão
                    </span>
                  </div>

                  <CodePlayground 
                    module={selectedModule} 
                    onChallengeSuccess={handleChallengeSuccess}
                    onShareSolution={handleShareSolution}
                  />
                </div>
              ) : (
                /* Default view: Zigzag islands maps pathway */
                <div className="space-y-6">
                  <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                    <div className="absolute -right-16 -top-16 w-64 h-64 bg-yellow-400/10 blur-[80px] rounded-full" />
                    <h2 className="text-xl font-black text-zinc-100 tracking-tight flex items-center gap-2">
                       Trilha de Aprendizagem
                    </h2>
                    <p className="text-xs text-zinc-400 mt-2 max-w-xl leading-relaxed">
                      Você está no início de sua aventura de programação. Complete os módulos em sequência para desbloquear novas lições com nosso tutor de Inteligência Artificial!
                    </p>
                  </div>

                  <JourneyMap 
                    modules={modules} 
                    activeModuleId={stats.initialMissionCompleted ? "mod_1" : "mod_0"} 
                    onSelectModule={(module) => setSelectedModule(module)}
                  />
                </div>
              )}
            </>
          )}

          {activeTab === "community" && (
            <CommunitySection 
              posts={posts} 
              onAddPost={handleAddPost}
              onAddComment={handleAddComment}
              onLikePost={handleLikePost}
            />
          )}

          {activeTab === "profile" && (
            <UserProfile 
              stats={stats} 
              achievements={achievements}
              leaderboard={leaderboard}
              onSetDailyGoal={handleSetDailyGoal}
              onSimulateStudy={handleSimulateStudy}
            />
          )}
        </section>
      </main>

      {/* Persistent global humble footer element */}
      <footer className="bg-zinc-950 border-t border-zinc-950 py-6 text-center text-zinc-600 text-xs mt-auto">
        <p>© 2026 Plataforma de Aprendizagem de JavaScript. Desenvolvido para capacitar programadores.</p>
      </footer>
    </div>
  );
}
