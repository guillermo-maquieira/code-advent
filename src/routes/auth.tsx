import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useAdvent } from "@/lib/advent-store";
import { YEARS_OF_STUDY, type YearOfStudy } from "@/lib/advent-types";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — UB Code Advent" },
      {
        name: "description",
        content:
          "Sign in or create an account with your Universidad de Belgrano email to participate in UB Code Advent.",
      },
      { property: "og:title", content: "Sign In — UB Code Advent" },
      { property: "og:description", content: "UB email authentication for UB Code Advent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { login, signup, currentUser } = useAdvent();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState<YearOfStudy>("1st Year");
  const [error, setError] = useState("");

  if (currentUser) {
    navigate({ to: "/profile" });
    return null;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const result =
      mode === "login"
        ? login(email, password)
        : signup({ name, email, password, yearOfStudy });
    if (!result.ok) {
      setError(result.error ?? "Authentication failed.");
      return;
    }
    toast.success(mode === "login" ? "Welcome back!" : "Account created! Good luck solving.");
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {mode === "login" ? "Sign in" : "Create UB account"}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Requires a <span className="font-mono text-star">@ub.edu.ar</span> or{" "}
          <span className="font-mono text-star">@comunidad.ub.edu.ar</span> address.
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-lg border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "signup"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-medium text-muted-foreground">
                Full name
              </label>
              <input
                id="auth-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Valentina Gómez"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-2 focus:outline-ring"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-medium text-muted-foreground">
              University email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@comunidad.ub.edu.ar"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm text-foreground focus:outline-2 focus:outline-ring"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-medium text-muted-foreground">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-2 focus:outline-ring"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label htmlFor="auth-year" className="block text-xs font-medium text-muted-foreground">
                Year of study
              </label>
              <select
                id="auth-year"
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value as YearOfStudy)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-2 focus:outline-ring"
              >
                {YEARS_OF_STUDY.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Seeded demo accounts (mock auth):</p>
          <p className="mt-1 font-mono">
            Admin: guillermo.maquieira@comunidad.ub.edu.ar / ub-admin-2026
          </p>
          <p className="font-mono">
            Admin: natalia.cerda@comunidad.ub.edu.ar / ub-admin-2026
          </p>
          <p className="font-mono">
            Student: sofia.fernandez@comunidad.ub.edu.ar / student123
          </p>
        </div>
      </div>
    </div>
  );
}