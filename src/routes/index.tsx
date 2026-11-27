import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock, Star, Unlock } from "lucide-react";
import { RetroChristmasSnake } from "@/components/RetroChristmasSnake";
import { Button } from "@/components/ui/button";
import { getUserStarsForDay, getUserTotalStars, isPuzzleUnlocked } from "@/lib/advent-logic";
import { useAdvent } from "@/lib/advent-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Code Advent — Una Navidad muy Python en la Universidad de Belgrano" },
      {
        name: "description",
        content:
          "Desbloqueá 12 desafíos de programación en Python del 1 al 12 de diciembre, ganá estrellas doradas y competí en el Leaderboard de la Universidad de Belgrano.",
      },
      { property: "og:title", content: "Code Advent — Universidad de Belgrano" },
      {
        property: "og:description",
        content: "12 desafíos de programación en Python para estudiantes de la Universidad de Belgrano, del 1 al 12 de diciembre.",
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
      <section className="border-b border-border/60 bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="font-mono text-xs font-medium tracking-widest text-star uppercase">
              Universidad de Belgrano · 1 al 12 de diciembre
            </p>
            <h1 className="mt-3 max-w-2xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              Una Navidad muy Python
            </h1>
            <p className="mt-4 max-w-xl text-base text-foreground/85 sm:text-lg">
              Descargá el archivo de entrada de cada día, programá tu solución en Python en tu
              computadora y enviá ambas respuestas para juntar las 24 estrellas doradas.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {currentUser ? (
                <Button asChild>
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Star className="size-4 fill-primary-foreground" aria-hidden="true" />
                    {totalStars} / 24 estrellas ganadas
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Sumate con tu correo UB
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link
                  to="/leaderboard"
                  className="inline-flex items-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Ver Leaderboard
                </Link>
              </Button>
            </div>
          </div>

          <RetroChristmasSnake />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Calendario de Adviento
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cada puerta se desbloquea en su fecha programada de diciembre. Ganá hasta 2 estrellas por día.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Unlock className="size-3.5 text-star" aria-hidden="true" /> Desbloqueado
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-evergreen" aria-hidden="true" /> Completado
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="size-3.5 text-muted-foreground" aria-hidden="true" /> Bloqueado
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
                      Dic {puzzle.day}
                    </span>
                    <p className="mt-0.5 font-mono text-3xl font-semibold text-foreground">
                      {String(puzzle.day).padStart(2, "0")}
                    </p>
                  </div>
                  {completed ? (
                    <CheckCircle2 className="size-5 text-evergreen" aria-label="Completado" />
                  ) : unlocked ? (
                    <Unlock className="size-4 text-star" aria-label="Desbloqueado" />
                  ) : (
                    <Lock className="size-4 text-muted-foreground" aria-label="Bloqueado" />
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-base font-medium leading-snug text-foreground">
                    {unlocked || currentUser?.isAdmin
                      ? puzzle.title.es
                      : `Se abre el ${puzzle.unlockDate}`}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {unlocked || currentUser?.isAdmin ? puzzle.topic.es : "Volvé el día de apertura"}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {completed
                      ? "Completado"
                      : unlocked
                        ? stars === 1
                          ? "1/2 estrellas"
                          : "Abrir →"
                        : "Bloqueado"}
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
