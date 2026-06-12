export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown or long explanation
  snippet?: string; // Example code
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  question: string;
  template: string;
  expectedKeywords: string[];
  isCompleted: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  lessons: Lesson[];
  challenges: Challenge[];
  iconName: string; // name of Lucide icon
}

export interface UserStats {
  level: number;
  xp: number;
  streak: number;
  studyTimeToday: number; // in minutes
  dailyGoal: number; // in minutes, e.g., 15
  hasCompletedFUX: boolean;
  initialMissionCompleted: boolean;
  onboardingStep: number; // -1 means onboarding is done
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon name
  unlocked: boolean;
  rarity: "Comum" | "Raro" | "Épico" | "Lendário";
  dateUnlocked?: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  userTitle?: string;
  avatarColor: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
  codeSnippet?: string;
  createdAt: string;
  comments: {
    id: string;
    author: string;
    avatarColor: string;
    content: string;
    createdAt: string;
  }[];
}

export interface RankingUser {
  id: string;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  isCurrentUser?: boolean;
}
