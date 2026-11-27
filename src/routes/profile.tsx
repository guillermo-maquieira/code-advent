import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Shield, Star } from "lucide-react";
import {
  formatSolveDuration,
  getUserStarsForDay,
  getUserTotalSolveSeconds,
  getUserTotalStars,
} from "@/lib/advent-logic";
import { useAdvent } from "@/lib/advent-store";
import { YEAR_OF_STUDY_LABELS } from "@/lib/advent-types";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Tu Perfil — Code Advent" },
      {
        name: "description",
        content: "Seguí tus estrellas ganadas y días completados en Code Advent.",
      },
      { property: "og:title", content: "Tu Perfil — Code Advent" },
      { property: "og:description", content: "Tu progreso de estrellas en Code Advent." },
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
        <h1 className="text-3xl font-bold">Iniciá sesión para ver tu perfil</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Seguí tus estrellas ganadas y tu historial de desafíos con tu cuenta UB.
        </p>
        <Link
          to="/auth"
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Iniciar sesión
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
            {currentUser.email} · {YEAR_OF_STUDY_LABELS[currentUser.yearOfStudy]}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card px-5 py-3 text-right">
          <p className="font-mono text-2xl font-bold text-star">
            {totalStars} / 24{" "}
            <Star className="inline size-5 fill-star text-star" aria-hidden="true" />
          </p>
          <p className="text-xs text-muted-foreground">
            Tiempo acumulado: {formatSolveDuration(totalSeconds)}
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-semibold">Progreso de estrellas por día</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {puzzles.map((puzzle) => {
          const stars = getUserStarsForDay(currentUser, puzzle.day);
          return (
            <div
              key={puzzle.day}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="font-mono text-xs text-muted-foreground">Dic {puzzle.day}</p>
                <p className="text-sm font-medium text-foreground">{puzzle.title.es}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                  {stars} / 2
                </span>
                {stars === 2 && (
                  <CheckCircle2 className="ml-1 size-4 text-evergreen" aria-label="Completado" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
