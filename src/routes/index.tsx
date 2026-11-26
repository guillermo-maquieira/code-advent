import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock, Star, Unlock } from "lucide-react";
import adventHero from "@/assets/advent-hero.jpg";
import { Button } from "@/components/ui/button";
import { getUserStarsForDay, getUserTotalStars, isPuzzleUnlocked } from "@/lib/advent-logic";
import { useAdvent } from "@/lib/advent-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UB Code Advent — 12 Days of Python at Universidad de Belgrano" },
      {
        name: "description",
        content:
          "Unlock 12 Python coding puzzles from December 1 to 12, earn golden stars, and compete on the Universidad de Belgrano leaderboard.",
      },
      { property: "og:title", content: "UB Code Advent — Universidad de Belgrano" },
      {
        property: "og:description",
        content: "12 Python coding challenges for Universidad de Belgrano students, Dec 1–12.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { puzzles, currentUser } = useAdvent();
  const totalStars = currentUser ? getUserTotalStars(currentUser) : 0;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <img
          src={adventHero}
          alt="Snowy Universidad de Belgrano courtyard under golden starlight constellations"
          width={1600}
          height={896}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="hero-scrim relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="font-mono text-xs font-medium tracking-widest text-star uppercase">
            Universidad de Belgrano · Dec 1 – Dec 12
          </p>
          <h1 className="mt-3 max-w-2xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Twelve Nights of Python
          </h1>
          <p className="mt-4 max-w-xl text-base text-foreground/85 sm:text-lg">
            Download each day&apos;s puzzle input, write your Python solution locally, and submit
            both answers to collect all 24 golden stars.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {currentUser ? (
              <Button asChild>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Star className="size-4 fill-primary-foreground" aria-hidden="true" />
                  {totalStars} / 24 Stars Earned
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Join with your UB Email
                </Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link
                to="/leaderboard"
                className="inline-flex items-center rounded-lg border border-border bg-background/70 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-secondary"
              >
                View Leaderboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Advent Calendar
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Each door unlocks on its scheduled date in December. Earn up to 2 stars per day.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Unlock className="size-3.5 text-star" aria-hidden="true" /> Unlocked
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-evergreen" aria-hidden="true" /> Completed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="size-3.5 text-muted-foreground" aria-hidden="true" /> Locked
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {puzzles.map((puzzle) => {
            const unlocked = isPuzzleUnlocked(puzzle);
            const stars = getUserStarsForDay(currentUser, puzzle.day);
            const completed = stars === 2;
            const canOpen = unlocked || Boolean(currentUser?.isAdmin);

            const stateClass = completed
              ? "door-completed"
              : unlocked
                ? "door-unlocked"
                : "door-locked";

            const cardBody = (
              <div className="flex h-full flex-col justify-between p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Dec {puzzle.day}
                    </span>
                    <p className="mt-0.5 font-mono text-3xl font-semibold text-foreground">
                      {String(puzzle.day).padStart(2, "0")}
                    </p>
                  </div>
                  {completed ? (
                    <CheckCircle2 className="size-5 text-evergreen" aria-label="Completed" />
                  ) : unlocked ? (
                    <Unlock className="size-4 text-star" aria-label="Unlocked" />
                  ) : (
                    <Lock className="size-4 text-muted-foreground" aria-label="Locked" />
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-base font-medium leading-snug text-foreground">
                    {unlocked || currentUser?.isAdmin
                      ? puzzle.title.en
                      : `Unlocks ${puzzle.unlockDate}`}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {unlocked || currentUser?.isAdmin ? puzzle.topic.en : "Come back on unlock day"}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {completed
                      ? "Done"
                      : unlocked
                        ? stars === 1
                          ? "1/2 stars"
                          : "Open →"
                        : "Locked"}
                  </span>
                </div>
              </div>
            );

            if (!canOpen) {
              return (
                <div key={puzzle.day} aria-disabled="true" className={`door-card ${stateClass}`}>
                  {cardBody}
                </div>
              );
            }

            return (
              <Link
                key={puzzle.day}
                to="/puzzle/$day"
                params={{ day: String(puzzle.day) }}
                className={`door-card block focus-visible:outline-2 focus-visible:outline-ring ${stateClass}`}
              >
                {cardBody}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
