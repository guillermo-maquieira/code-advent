import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Download, Lock, Star } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  downloadTextFile,
  hasSolvedPart,
  isPuzzleUnlocked,
} from "@/lib/advent-logic";
import { useAdvent } from "@/lib/advent-store";
import type { Language } from "@/lib/advent-types";

export const Route = createFileRoute("/puzzle/$day")({
  head: ({ params }) => ({
    meta: [
      { title: `Day ${params.day} Puzzle — UB Code Advent` },
      {
        name: "description",
        content: `Solve Day ${params.day} of the Universidad de Belgrano Python coding advent calendar.`,
      },
      { property: "og:title", content: `Day ${params.day} — UB Code Advent` },
      {
        property: "og:description",
        content: `Bilingual Python coding challenge for Day ${params.day}.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PuzzlePage,
});

function PuzzlePage() {
  const { day: dayParam } = Route.useParams();
  const dayNumber = Number(dayParam);
  const { puzzles, currentUser, submitAnswer } = useAdvent();
  const [lang, setLang] = useState<Language>("en");
  const [part1Input, setPart1Input] = useState("");
  const [part2Input, setPart2Input] = useState("");
  const [part1Error, setPart1Error] = useState("");
  const [part2Error, setPart2Error] = useState("");
  const [openedAt] = useState(() => Date.now());

  useEffect(() => {
    setPart1Input("");
    setPart2Input("");
    setPart1Error("");
    setPart2Error("");
  }, [dayNumber]);

  const puzzle = puzzles.find((p) => p.day === dayNumber);

  if (!puzzle) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold">Puzzle not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Doors run from Day 1 to Day 12.
        </p>
        <Link to="/" className="mt-6 inline-block text-sm font-medium text-star underline">
          Back to Advent Calendar
        </Link>
      </div>
    );
  }

  const unlocked = isPuzzleUnlocked(puzzle);
  if (!unlocked && !currentUser?.isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Lock className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-semibold">Day {puzzle.day} is still locked</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This door opens on <span className="font-mono text-foreground">{puzzle.unlockDate}</span>.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-star hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to Calendar
        </Link>
      </div>
    );
  }

  const solved1 = hasSolvedPart(currentUser, puzzle.day, 1);
  const solved2 = hasSolvedPart(currentUser, puzzle.day, 2);
  const previewLines = puzzle.inputData.split("\n").slice(0, 6).join("\n");

  function handleSubmit(e: FormEvent, part: 1 | 2) {
    e.preventDefault();
    const raw = part === 1 ? part1Input : part2Input;
    const setErr = part === 1 ? setPart1Error : setPart2Error;
    setErr("");
    if (!raw.trim()) {
      setErr("Enter your computed answer before submitting.");
      return;
    }
    const elapsedSeconds = Math.max(30, Math.round((Date.now() - openedAt) / 1000));
    const res = submitAnswer(puzzle!.day, part, raw, elapsedSeconds);
    if (res.ok) {
      toast.success(res.message);
    } else {
      setErr(res.message);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to Calendar
        </Link>

        <div className="inline-flex rounded-lg border border-border bg-card p-1" role="group" aria-label="Story language">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang("es")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              lang === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Español
          </button>
        </div>
      </div>

      <div className="mt-6 border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-wider text-star">
          Dec {puzzle.day} · {puzzle.topic[lang]}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {puzzle.title[lang]}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => downloadTextFile(puzzle.inputData, puzzle.inputFilename)}
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Download className="size-4 text-star" aria-hidden="true" />
            Download {puzzle.inputFilename}
          </button>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <Star className={`size-4 ${solved1 ? "fill-star text-star" : "text-star-muted"}`} />
            <Star className={`size-4 ${solved2 ? "fill-star text-star" : "text-star-muted"}`} />
            {(solved1 ? 1 : 0) + (solved2 ? 1 : 0)} / 2 stars
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-4">
        <p className="font-mono text-xs text-muted-foreground">
          Input preview ({puzzle.inputFilename} · {puzzle.inputData.split("\n").length} lines)
        </p>
        <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-foreground/90">
          {previewLines}
        </pre>
      </div>

      <article className="mt-8 space-y-8">
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold">
              {lang === "en" ? "Part 1" : "Parte 1"}
            </h2>
            {solved1 && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-evergreen">
                <CheckCircle2 className="size-4" aria-hidden="true" /> Star Earned
              </span>
            )}
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {puzzle.storyPart1[lang]}
          </p>

          {!solved1 && (
            <form onSubmit={(e) => handleSubmit(e, 1)} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={part1Input}
                onChange={(e) => setPart1Input(e.target.value)}
                placeholder={lang === "en" ? "Enter Part 1 answer..." : "Ingresá la respuesta de Parte 1..."}
                aria-label="Part 1 answer"
                className="flex-1 rounded-lg border border-input bg-background px-3.5 py-2 font-mono text-sm text-foreground focus:outline-2 focus:outline-ring"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Submit Part 1
              </button>
            </form>
          )}
          {part1Error && <p className="mt-2 text-sm text-destructive">{part1Error}</p>}
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold">
              {lang === "en" ? "Part 2" : "Parte 2"}
            </h2>
            {solved2 && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-evergreen">
                <CheckCircle2 className="size-4" aria-hidden="true" /> Star Earned
              </span>
            )}
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {puzzle.storyPart2[lang]}
          </p>

          {!solved2 && (
            <form onSubmit={(e) => handleSubmit(e, 2)} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={part2Input}
                onChange={(e) => setPart2Input(e.target.value)}
                placeholder={lang === "en" ? "Enter Part 2 answer..." : "Ingresá la respuesta de Parte 2..."}
                aria-label="Part 2 answer"
                className="flex-1 rounded-lg border border-input bg-background px-3.5 py-2 font-mono text-sm text-foreground focus:outline-2 focus:outline-ring"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Submit Part 2
              </button>
            </form>
          )}
          {part2Error && <p className="mt-2 text-sm text-destructive">{part2Error}</p>}
        </section>
      </article>

      {!currentUser && (
        <p className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
          Want to record your stars on the leaderboard?{" "}
          <Link to="/auth" className="font-medium text-star underline">
            Sign in with your Universidad de Belgrano email
          </Link>
          .
        </p>
      )}
    </div>
  );
}