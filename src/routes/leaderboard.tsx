import { createFileRoute } from "@tanstack/react-router";
import { Star, Trophy } from "lucide-react";
import { useState } from "react";
import { buildLeaderboard, formatSolveDuration } from "@/lib/advent-logic";
import { useAdvent } from "@/lib/advent-store";
import { YEAR_OF_STUDY_LABELS, YEARS_OF_STUDY, type YearOfStudy } from "@/lib/advent-types";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Code Advent" },
      {
        name: "description",
        content:
          "Ranking de estudiantes de la Universidad de Belgrano por estrellas ganadas y tiempo de resolución.",
      },
      { property: "og:title", content: "Leaderboard — Code Advent" },
      {
        property: "og:description",
        content: "Mirá los mejores puntajes de Python por año de cursada en la UB.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { users, currentUser } = useAdvent();
  const [yearFilter, setYearFilter] = useState<YearOfStudy | "all">("all");
  const rows = buildLeaderboard(users, yearFilter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ordenado por total de estrellas ganadas; en caso de empate define el menor tiempo acumulado.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="year-filter" className="text-xs font-medium text-muted-foreground">
            Año de cursada
          </label>
          <select
            id="year-filter"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value as YearOfStudy | "all")}
            className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-2 focus:outline-ring"
          >
            <option value="all">Todos los años</option>
            {YEARS_OF_STUDY.map((yr) => (
              <option key={yr} value={yr}>
                {YEAR_OF_STUDY_LABELS[yr]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3.5">Puesto</th>
              <th className="px-4 py-3.5">Participante</th>
              <th className="px-4 py-3.5">Año</th>
              <th className="px-4 py-3.5 text-right">Estrellas</th>
              <th className="px-4 py-3.5 text-right">Tiempo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No hay participantes registrados para{" "}
                  {yearFilter === "all" ? "este filtro" : YEAR_OF_STUDY_LABELS[yearFilter]}.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => {
                const isSelf = currentUser?.id === row.userId;
                return (
                  <tr key={row.userId} className={isSelf ? "bg-secondary/60" : undefined}>
                    <td className="px-4 py-3.5 font-mono font-semibold text-foreground">
                      {idx === 0 ? (
                        <span className="inline-flex items-center gap-1 text-star">
                          <Trophy className="size-4" aria-hidden="true" /> 1
                        </span>
                      ) : (
                        idx + 1
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-foreground">
                        {row.name}
                        {isSelf && (
                          <span className="ml-2 font-mono text-xs text-star">(Vos)</span>
                        )}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">{row.email}</p>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {YEAR_OF_STUDY_LABELS[row.yearOfStudy]}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-star">
                      <span className="inline-flex items-center justify-end gap-1">
                        {row.stars}
                        <Star className="size-3.5 fill-star text-star" aria-hidden="true" />
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-muted-foreground">
                      {formatSolveDuration(row.totalSolveSeconds)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}