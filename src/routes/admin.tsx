import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert, Star, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  buildLeaderboard,
  formatSolveDuration,
  getUserTotalStars,
} from "@/lib/advent-logic";
import { useAdvent } from "@/lib/advent-store";
import { YEAR_OF_STUDY_LABELS } from "@/lib/advent-types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de Admin — Code Advent" },
      {
        name: "description",
        content:
          "Administrá desafíos, fechas de apertura, el Leaderboard y los participantes de Code Advent.",
      },
      { property: "og:title", content: "Panel de Admin — Code Advent" },
      { property: "og:description", content: "Herramientas de administración para Code Advent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

type AdminTab = "puzzles" | "leaderboard" | "participants";

const ADMIN_TAB_LABELS: Record<AdminTab, string> = {
  puzzles: "Desafíos",
  leaderboard: "Leaderboard",
  participants: "Participantes",
};

function AdminPage() {
  const { puzzles, users, currentUser, updatePuzzle, toggleUserAdmin, removeUser } = useAdvent();
  const [tab, setTab] = useState<AdminTab>("puzzles");
  const [selectedDay, setSelectedDay] = useState(1);

  const selectedPuzzle = puzzles.find((p) => p.day === selectedDay) ?? puzzles[0]!;

  const [titleEn, setTitleEn] = useState(selectedPuzzle.title.en);
  const [titleEs, setTitleEs] = useState(selectedPuzzle.title.es);
  const [story1En, setStory1En] = useState(selectedPuzzle.storyPart1.en);
  const [story1Es, setStory1Es] = useState(selectedPuzzle.storyPart1.es);
  const [story2En, setStory2En] = useState(selectedPuzzle.storyPart2.en);
  const [story2Es, setStory2Es] = useState(selectedPuzzle.storyPart2.es);
  const [inputData, setInputData] = useState(selectedPuzzle.inputData);
  const [answerPart1, setAnswerPart1] = useState(selectedPuzzle.answerPart1);
  const [answerPart2, setAnswerPart2] = useState(selectedPuzzle.answerPart2);
  const [unlockDate, setUnlockDate] = useState(selectedPuzzle.unlockDate);

  useEffect(() => {
    const p = puzzles.find((item) => item.day === selectedDay);
    if (!p) return;
    setTitleEn(p.title.en);
    setTitleEs(p.title.es);
    setStory1En(p.storyPart1.en);
    setStory1Es(p.storyPart1.es);
    setStory2En(p.storyPart2.en);
    setStory2Es(p.storyPart2.es);
    setInputData(p.inputData);
    setAnswerPart1(p.answerPart1);
    setAnswerPart2(p.answerPart2);
    setUnlockDate(p.unlockDate);
  }, [selectedDay, puzzles]);

  if (!currentUser?.isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <ShieldAlert className="mx-auto size-10 text-destructive" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-bold">Se requiere acceso de Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Solo los administradores autorizados de la Universidad de Belgrano pueden acceder a este panel.
        </p>
        <Link to="/" className="mt-6 inline-block text-sm font-medium text-star hover:underline">
          Volver al Calendario
        </Link>
      </div>
    );
  }

  function handleSavePuzzle(e: FormEvent) {
    e.preventDefault();
    if (!titleEn.trim() || !answerPart1.trim() || !answerPart2.trim() || !unlockDate) {
      toast.error("El título, ambas respuestas esperadas y la fecha de apertura son obligatorios.");
      return;
    }
    const saved = updatePuzzle(selectedDay, {
      title: { en: titleEn.trim(), es: titleEs.trim() || titleEn.trim() },
      storyPart1: { en: story1En, es: story1Es },
      storyPart2: { en: story2En, es: story2Es },
      inputData,
      answerPart1: answerPart1.trim(),
      answerPart2: answerPart2.trim(),
      unlockDate,
    });
    if (saved) toast.success(`Se guardó el desafío del Día ${selectedDay}.`);
  }

  const leaderboardRows = buildLeaderboard(users, "all");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">Panel de Admin</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sesión iniciada como {currentUser.name} ({currentUser.email})
      </p>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4">
        {(["puzzles", "leaderboard", "participants"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {ADMIN_TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "puzzles" && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-1.5">
            {puzzles.map((p) => (
              <button
                key={p.day}
                type="button"
                onClick={() => setSelectedDay(p.day)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  selectedDay === p.day
                    ? "border-star bg-secondary text-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-mono font-medium">Day {String(p.day).padStart(2, "0")}</span>
                <span className="truncate pl-2 text-xs">{p.unlockDate}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSavePuzzle} className="space-y-4 rounded-xl border border-border bg-card p-6 lg:col-span-3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ed-title-en" className="block text-xs font-medium text-muted-foreground">
                  Título (Inglés)
                </label>
                <input
                  id="ed-title-en"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="ed-title-es" className="block text-xs font-medium text-muted-foreground">
                  Título (Español)
                </label>
                <input
                  id="ed-title-es"
                  value={titleEs}
                  onChange={(e) => setTitleEs(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="ed-unlock" className="block text-xs font-medium text-muted-foreground">
                  Fecha de apertura
                </label>
                <input
                  id="ed-unlock"
                  type="date"
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm"
                />
              </div>
              <div>
                <label htmlFor="ed-ans1" className="block text-xs font-medium text-muted-foreground">
                  Respuesta esperada (Parte 1)
                </label>
                <input
                  id="ed-ans1"
                  value={answerPart1}
                  onChange={(e) => setAnswerPart1(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm"
                />
              </div>
              <div>
                <label htmlFor="ed-ans2" className="block text-xs font-medium text-muted-foreground">
                  Respuesta esperada (Parte 2)
                </label>
                <input
                  id="ed-ans2"
                  value={answerPart2}
                  onChange={(e) => setAnswerPart2(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ed-s1-en" className="block text-xs font-medium text-muted-foreground">
                  Consigna Parte 1 (Inglés)
                </label>
                <textarea
                  id="ed-s1-en"
                  rows={5}
                  value={story1En}
                  onChange={(e) => setStory1En(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="ed-s1-es" className="block text-xs font-medium text-muted-foreground">
                  Consigna Parte 1 (Español)
                </label>
                <textarea
                  id="ed-s1-es"
                  rows={5}
                  value={story1Es}
                  onChange={(e) => setStory1Es(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ed-s2-en" className="block text-xs font-medium text-muted-foreground">
                  Consigna Parte 2 (Inglés)
                </label>
                <textarea
                  id="ed-s2-en"
                  rows={4}
                  value={story2En}
                  onChange={(e) => setStory2En(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="ed-s2-es" className="block text-xs font-medium text-muted-foreground">
                  Consigna Parte 2 (Español)
                </label>
                <textarea
                  id="ed-s2-es"
                  rows={4}
                  value={story2Es}
                  onChange={(e) => setStory2Es(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ed-input" className="block text-xs font-medium text-muted-foreground">
                Archivo de entrada descargable ({selectedPuzzle.inputFilename})
              </label>
              <textarea
                id="ed-input"
                rows={4}
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Guardar cambios del Día {selectedDay}
            </button>
          </form>
        </div>
      )}

      {tab === "leaderboard" && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Año</th>
                <th className="px-4 py-3 text-right">Estrellas</th>
                <th className="px-4 py-3 text-right">Tiempo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {leaderboardRows.map((row, idx) => (
                <tr key={row.userId}>
                  <td className="px-4 py-3 font-mono">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{row.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {YEAR_OF_STUDY_LABELS[row.yearOfStudy]}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-star">
                    {row.stars} <Star className="inline size-3.5 fill-star" />
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                    {formatSolveDuration(row.totalSolveSeconds)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "participants" && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Participante</th>
                <th className="px-4 py-3">Año</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3 text-right">Estrellas</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((u) => {
                const isSelf = u.id === currentUser.id;
                return (
                  <tr key={u.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{u.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{u.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {YEAR_OF_STUDY_LABELS[u.yearOfStudy]}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {u.isAdmin ? "Admin" : "Estudiante"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-star">
                      {getUserTotalStars(u)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isSelf ? (
                        <span className="text-xs text-muted-foreground">Admin actual</span>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              toggleUserAdmin(u.id);
                              toast.success(`Se actualizó el rol de ${u.name}.`);
                            }}
                            className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-secondary"
                          >
                            {u.isAdmin ? "Quitar Admin" : "Hacer Admin"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              removeUser(u.id);
                              toast.success(`Se eliminó a ${u.name}.`);
                            }}
                            aria-label={`Eliminar a ${u.name}`}
                            className="rounded-md border border-destructive/40 p-1.5 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}