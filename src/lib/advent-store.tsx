import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { checkPuzzleAnswer, validateUbEmail } from "./advent-logic";
import { SEED_PUZZLES, SEED_USERS } from "./advent-seed";
import {
  SEEDED_ADMIN_EMAILS,
  type Puzzle,
  type UserAccount,
  type YearOfStudy,
} from "./advent-types";

const STORAGE_KEYS = {
  puzzles: "ub_advent_puzzles_v1",
  users: "ub_advent_users_v1",
  sessionEmail: "ub_advent_session_v1",
} as const;

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface SubmitResult {
  ok: boolean;
  alreadySolved?: boolean;
  message: string;
}

interface AdventContextValue {
  puzzles: Puzzle[];
  users: UserAccount[];
  currentUser: UserAccount | null;
  hydrated: boolean;
  login: (email: string, password: string) => AuthResult;
  signup: (input: {
    name: string;
    email: string;
    password: string;
    yearOfStudy: YearOfStudy;
  }) => AuthResult;
  logout: () => void;
  submitAnswer: (day: number, part: 1 | 2, answer: string, elapsedSeconds: number) => SubmitResult;
  updatePuzzle: (day: number, patch: Partial<Puzzle>) => boolean;
  toggleUserAdmin: (userId: string) => boolean;
  removeUser: (userId: string) => boolean;
}

const AdventContext = createContext<AdventContextValue | null>(null);

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function AdventProvider({ children }: { children: ReactNode }) {
  const [puzzles, setPuzzles] = useState<Puzzle[]>(SEED_PUZZLES);
  const [users, setUsers] = useState<UserAccount[]>(SEED_USERS);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedPuzzles = readJson<Puzzle[]>(STORAGE_KEYS.puzzles);
    if (savedPuzzles !== null) setPuzzles(savedPuzzles);

    const savedUsers = readJson<UserAccount[]>(STORAGE_KEYS.users);
    if (savedUsers !== null) setUsers(savedUsers);

    const savedEmail = window.localStorage.getItem(STORAGE_KEYS.sessionEmail);
    if (savedEmail) setSessionEmail(savedEmail);

    setHydrated(true);
  }, []);

  const persistPuzzles = useCallback((next: Puzzle[]) => {
    setPuzzles(next);
    window.localStorage.setItem(STORAGE_KEYS.puzzles, JSON.stringify(next));
  }, []);

  const persistUsers = useCallback((next: UserAccount[]) => {
    setUsers(next);
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(next));
  }, []);

  const currentUser = useMemo(() => {
    if (!sessionEmail) return null;
    return users.find((u) => u.email === sessionEmail) ?? null;
  }, [users, sessionEmail]);

  const login = useCallback(
    (rawEmail: string, password: string): AuthResult => {
      const emailCheck = validateUbEmail(rawEmail);
      if (!emailCheck.valid) return { ok: false, error: emailCheck.error };
      const found = users.find((u) => u.email === emailCheck.normalized);
      if (!found) {
        return { ok: false, error: "No account found for this UB email. Please sign up first." };
      }
      if (found.password !== password) {
        return { ok: false, error: "Incorrect password. Please try again." };
      }
      setSessionEmail(found.email);
      window.localStorage.setItem(STORAGE_KEYS.sessionEmail, found.email);
      return { ok: true };
    },
    [users],
  );

  const signup = useCallback(
    (input: {
      name: string;
      email: string;
      password: string;
      yearOfStudy: YearOfStudy;
    }): AuthResult => {
      const cleanName = input.name.trim();
      if (cleanName.length < 2) {
        return { ok: false, error: "Please enter your full name." };
      }
      const emailCheck = validateUbEmail(input.email);
      if (!emailCheck.valid) return { ok: false, error: emailCheck.error };
      if (input.password.length < 6) {
        return { ok: false, error: "Password must be at least 6 characters." };
      }
      if (users.some((u) => u.email === emailCheck.normalized)) {
        return { ok: false, error: "This UB email is already registered. Please log in." };
      }
      const isAdmin = (SEEDED_ADMIN_EMAILS as readonly string[]).includes(emailCheck.normalized);
      const created: UserAccount = {
        id: `user-${Date.now()}`,
        name: cleanName,
        email: emailCheck.normalized,
        password: input.password,
        yearOfStudy: input.yearOfStudy,
        isAdmin,
        solves: [],
      };
      persistUsers([...users, created]);
      setSessionEmail(created.email);
      window.localStorage.setItem(STORAGE_KEYS.sessionEmail, created.email);
      return { ok: true };
    },
    [users, persistUsers],
  );

  const logout = useCallback(() => {
    setSessionEmail(null);
    window.localStorage.removeItem(STORAGE_KEYS.sessionEmail);
  }, []);

  const submitAnswer = useCallback(
    (day: number, part: 1 | 2, answer: string, elapsedSeconds: number): SubmitResult => {
      if (!currentUser) {
        return { ok: false, message: "Sign in with your UB email to submit answers." };
      }
      const puzzle = puzzles.find((p) => p.day === day);
      if (!puzzle) return { ok: false, message: "Puzzle not found." };
      const already = currentUser.solves.some((s) => s.day === day && s.part === part);
      if (already) {
        return { ok: true, alreadySolved: true, message: "You already earned this star!" };
      }
      const expected = part === 1 ? puzzle.answerPart1 : puzzle.answerPart2;
      if (!checkPuzzleAnswer(answer, expected)) {
        return { ok: false, message: "Not quite right — double-check your Python script and try again." };
      }
      const record = {
        day,
        part,
        solvedAt: new Date().toISOString(),
        solveSeconds: Math.max(15, Math.round(elapsedSeconds)),
      };
      const updated = users.map((u) =>
        u.id === currentUser.id ? { ...u, solves: [...u.solves, record] } : u,
      );
      persistUsers(updated);
      return { ok: true, message: `Correct! You earned a gold star for Day ${day} Part ${part}.` };
    },
    [currentUser, puzzles, users, persistUsers],
  );

  const updatePuzzle = useCallback(
    (day: number, patch: Partial<Puzzle>): boolean => {
      if (!currentUser?.isAdmin) return false;
      const next = puzzles.map((p) =>
        p.day === day ? { ...p, ...patch, isPlaceholder: false } : p,
      );
      persistPuzzles(next);
      return true;
    },
    [currentUser, puzzles, persistPuzzles],
  );

  const toggleUserAdmin = useCallback(
    (userId: string): boolean => {
      if (!currentUser?.isAdmin || currentUser.id === userId) return false;
      const next = users.map((u) => (u.id === userId ? { ...u, isAdmin: !u.isAdmin } : u));
      persistUsers(next);
      return true;
    },
    [currentUser, users, persistUsers],
  );

  const removeUser = useCallback(
    (userId: string): boolean => {
      if (!currentUser?.isAdmin || currentUser.id === userId) return false;
      persistUsers(users.filter((u) => u.id !== userId));
      return true;
    },
    [currentUser, users, persistUsers],
  );

  const value = useMemo(
    () => ({
      puzzles,
      users,
      currentUser,
      hydrated,
      login,
      signup,
      logout,
      submitAnswer,
      updatePuzzle,
      toggleUserAdmin,
      removeUser,
    }),
    [
      puzzles,
      users,
      currentUser,
      hydrated,
      login,
      signup,
      logout,
      submitAnswer,
      updatePuzzle,
      toggleUserAdmin,
      removeUser,
    ],
  );

  return <AdventContext.Provider value={value}>{children}</AdventContext.Provider>;
}

export function useAdvent(): AdventContextValue {
  const ctx = useContext(AdventContext);
  if (!ctx) throw new Error("useAdvent must be used inside AdventProvider");
  return ctx;
}