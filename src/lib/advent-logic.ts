import {
  ALLOWED_EMAIL_DOMAINS,
  DOMAIN_ERROR_MESSAGE,
  type LeaderboardEntry,
  type Puzzle,
  type UserAccount,
  type YearOfStudy,
} from "./advent-types";

const EMAIL_REGEX = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/i;

export function validateUbEmail(
  rawEmail: string,
): { valid: true; normalized: string } | { valid: false; error: string } {
  const normalized = rawEmail.trim().toLowerCase();
  const match = EMAIL_REGEX.exec(normalized);
  if (!match) {
    return { valid: false, error: DOMAIN_ERROR_MESSAGE };
  }
  const domain = match[1]?.toLowerCase() ?? "";
  const isAllowed = (ALLOWED_EMAIL_DOMAINS as readonly string[]).includes(domain);
  if (!isAllowed) {
    return { valid: false, error: DOMAIN_ERROR_MESSAGE };
  }
  return { valid: true, normalized };
}

export function getTodayIso(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isPuzzleUnlocked(puzzle: Pick<Puzzle, "unlockDate">, now: Date = new Date()): boolean {
  if (!puzzle.unlockDate) return false;
  return puzzle.unlockDate <= getTodayIso(now);
}

export function checkPuzzleAnswer(submitted: string, expected: string): boolean {
  const cleanSub = submitted.trim().toLowerCase();
  const cleanExp = expected.trim().toLowerCase();
  if (!cleanSub || !cleanExp) return false;
  return cleanSub === cleanExp;
}

export function getUserStarsForDay(user: UserAccount | null, day: number): number {
  if (!user) return 0;
  const parts = new Set(user.solves.filter((s) => s.day === day).map((s) => s.part));
  return parts.size;
}

export function hasSolvedPart(user: UserAccount | null, day: number, part: 1 | 2): boolean {
  if (!user) return false;
  return user.solves.some((s) => s.day === day && s.part === part);
}

export function getUserTotalStars(user: UserAccount): number {
  const unique = new Set(user.solves.map((s) => `${s.day}-${s.part}`));
  return unique.size;
}

export function getUserTotalSolveSeconds(user: UserAccount): number {
  return user.solves.reduce((sum, s) => sum + s.solveSeconds, 0);
}

export function buildLeaderboard(
  users: readonly UserAccount[],
  yearFilter: YearOfStudy | "all" = "all",
): LeaderboardEntry[] {
  const filtered =
    yearFilter === "all" ? users : users.filter((u) => u.yearOfStudy === yearFilter);

  return filtered
    .map((u) => ({
      userId: u.id,
      name: u.name,
      email: u.email,
      yearOfStudy: u.yearOfStudy,
      stars: getUserTotalStars(u),
      totalSolveSeconds: getUserTotalSolveSeconds(u),
    }))
    .sort((a, b) => {
      if (b.stars !== a.stars) return b.stars - a.stars;
      if (a.stars > 0 && a.totalSolveSeconds !== b.totalSolveSeconds) {
        return a.totalSolveSeconds - b.totalSolveSeconds;
      }
      return a.name.localeCompare(b.name);
    });
}

export function formatSolveDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "—";
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hrs > 0) return `${hrs}h ${String(mins).padStart(2, "0")}m`;
  if (mins > 0) return `${mins}m ${String(secs).padStart(2, "0")}s`;
  return `${secs}s`;
}

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}