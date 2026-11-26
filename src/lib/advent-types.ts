export type Language = "en" | "es";

export type YearOfStudy =
  | "1st Year"
  | "2nd Year"
  | "3rd Year"
  | "4th Year"
  | "5th Year";

export const YEARS_OF_STUDY: readonly YearOfStudy[] = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year",
] as const;

export const YEAR_OF_STUDY_LABELS: Record<YearOfStudy, string> = {
  "1st Year": "1.º año",
  "2nd Year": "2.º año",
  "3rd Year": "3.º año",
  "4th Year": "4.º año",
  "5th Year": "5.º año",
};

export const ALLOWED_EMAIL_DOMAINS = ["ub.edu.ar", "comunidad.ub.edu.ar"] as const;

export const DOMAIN_ERROR_MESSAGE =
  "Solo pueden participar correos de la Universidad de Belgrano";

export const SEEDED_ADMIN_EMAILS = [
  "guillermo.maquieira@comunidad.ub.edu.ar",
  "natalia.cerda@comunidad.ub.edu.ar",
] as const;

export interface BilingualText {
  en: string;
  es: string;
}

export interface Puzzle {
  day: number;
  title: BilingualText;
  topic: BilingualText;
  storyPart1: BilingualText;
  storyPart2: BilingualText;
  inputFilename: string;
  inputData: string;
  answerPart1: string;
  answerPart2: string;
  /** ISO date string YYYY-MM-DD when the door unlocks */
  unlockDate: string;
  isPlaceholder?: boolean;
}

export interface SolveRecord {
  day: number;
  part: 1 | 2;
  /** ISO timestamp when solved */
  solvedAt: string;
  /** Solving duration in seconds from door open / start */
  solveSeconds: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  yearOfStudy: YearOfStudy;
  isAdmin: boolean;
  solves: SolveRecord[];
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  email: string;
  yearOfStudy: YearOfStudy;
  stars: number;
  totalSolveSeconds: number;
}