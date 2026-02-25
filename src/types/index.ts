export type Level = "beginner" | "intermediate";

export interface Exercise {
  id: string;
  question: string;
  hint: string;
  answer: string;
  expectedColumns: string[];
}

export interface Lesson {
  slug: string;
  title: string;
  level: Level;
  order: number;
  description: string;
  content: string; // Markdown-style HTML
  exercises: Exercise[];
}

export interface LessonWithProgress extends Lesson {
  completed: boolean;
  solvedExercises: string[];
}

// NextAuth の型拡張
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
