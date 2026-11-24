import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Shield, Star } from "lucide-react";
import {
  formatSolveDuration,
  getUserStarsForDay,
  getUserTotalSolveSeconds,
  getUserTotalStars,
} from "@/lib/advent-logic";
import { useAdvent } from "@/lib/advent-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — UB Code Advent" },
      {
        name: "description",
        content: "Track your earned stars and completed days in UB Code Advent.",
      },
      { property: "og:title", content: "Your Profile — UB Code Advent" },
      { property: "og:description", content: "Your UB Code Advent star progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { currentUser, puzzles } = useAdvent();

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Sign in to view your profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track your earned stars and puzzle completion history with your UB account.
        </p>
        <Link
          to="/auth"
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const totalStars = getUserTotalStars(currentUser);
  const totalSeconds = getUserTotalSolveSeconds(currentUser);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold tracking-tight">{currentUser.name}</h1>
            {currentUser.isAdmin && (
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-star">
                <Shield className="size-3" aria-hidden="true" /> Admin
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {currentUser.email} · {currentUser.yearOfStudy}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card px-5 py-3 text-right">
          <p className="font-mono text-2xl font-bold text-star">
            {totalStars} / 24{" "}
            <Star className="inline size-5 fill-star text-star" aria-hidden="true" />
          </p>
          <p className="text-xs text-muted-foreground">
            Cumulative time: {formatSolveDuration(totalSeconds)}
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-semibold">Star Progress by Day</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {puzzles.map((puzzle) => {
          const stars = getUserStarsForDay(currentUser, puzzle.day);
          return (
            <div
              key={puzzle.day}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="font-mono text-xs text-muted-foreground">Dec {puzzle.day}</p>
                <p className="text-sm font-medium text-foreground">{puzzle.title.en}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2].map((n) => (
                  <Star
                    key={n}
                    className={
                      n <= stars ? "size-4 fill-star text-star" : "size-4 text-star-muted"
                    }
                  />
                ))}
                {stars === 2 && (
                  <CheckCircle2 className="ml-1 size-4 text-evergreen" aria-label="Completed" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}