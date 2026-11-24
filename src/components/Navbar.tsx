import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Shield, Star, User } from "lucide-react";
import { getUserTotalStars } from "@/lib/advent-logic";
import { useAdvent } from "@/lib/advent-store";

export function Navbar() {
  const { currentUser, logout } = useAdvent();
  const navigate = useNavigate();
  const totalStars = currentUser ? getUserTotalStars(currentUser) : 0;

  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 text-foreground">
          <Star className="size-5 fill-star text-star" aria-hidden="true" />
          <span className="font-display text-lg font-semibold tracking-tight">
            UB Code Advent
          </span>
        </Link>

        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link
            to="/"
            activeProps={{ className: "bg-secondary text-star" }}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Calendar
          </Link>
          <Link
            to="/leaderboard"
            activeProps={{ className: "bg-secondary text-star" }}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Leaderboard
          </Link>
          <Link
            to="/about"
            activeProps={{ className: "bg-secondary text-star" }}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          {currentUser?.isAdmin && (
            <Link
              to="/admin"
              activeProps={{ className: "bg-secondary text-star" }}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Shield className="size-3.5" aria-hidden="true" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-star/60"
              >
                <User className="size-3.5 text-muted-foreground" aria-hidden="true" />
                <span className="max-w-32 truncate">{currentUser.name}</span>
                <span className="inline-flex items-center gap-1 font-mono text-xs text-star">
                  {totalStars}
                  <Star className="size-3 fill-star text-star" aria-hidden="true" />
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Sign out"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-md bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}