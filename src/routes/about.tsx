import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Code Advent" },
      {
        name: "description",
        content:
          "Scoring rules, honor code, and December 1–12 schedule for the Universidad de Belgrano Python coding advent calendar.",
      },
      { property: "og:title", content: "About — Code Advent" },
      {
        property: "og:description",
        content: "Scoring, honor code, and schedule for Code Advent.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">About Code Advent</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Inspired by Advent of Code, Code Advent is a 12-day Python programming challenge
        designed for students of Universidad de Belgrano.
      </p>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-2xl font-semibold text-foreground">Scoring</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90">
            <li>
              Every puzzle has <strong>two parts</strong> (Part 1 and Part 2). Each correct
              answer earns <strong>1 gold star</strong>, for up to 24 stars across the 12 days.
            </li>
            <li>
              You write and run your Python script locally on your own computer using the
              downloadable input file, then paste only your final computed result here.
            </li>
            <li>
              The leaderboard ranks participants primarily by <strong>total stars earned</strong>.
              Ties are broken by faster cumulative solving time.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">Honor Code</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90">
            <li>
              Write your own Python code. Discussing general algorithms with classmates is
              welcome, but sharing direct answers or complete solutions before a door closes is
              not allowed.
            </li>
            <li>
              Participation is restricted to the Universidad de Belgrano community using an
              official <span className="font-mono text-star">@ub.edu.ar</span> or{" "}
              <span className="font-mono text-star">@comunidad.ub.edu.ar</span> address.
            </li>
            <li>
              Keep the spirit friendly and educational — the goal is sharpening Python skills
              together.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">Schedule</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Doors open daily from <strong>December 1 through December 12</strong> at 00:00
            Argentina Time (UTC-3). Once unlocked, a puzzle remains open for the rest of the
            event so you can catch up at your own pace.
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <Link to="/" className="text-sm font-medium text-star hover:underline">
          Return to the Advent Calendar →
        </Link>
      </div>
    </div>
  );
}