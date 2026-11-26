# Code Advent

Build a web app: a Python-based coding advent calendar inspired by Advent of Code, for students of Universidad de Belgrano.

The home page shows an advent calendar grid with 12 doors for Dec 1-12 that unlock by date and show lock/unlock/completed states. Clicking a door opens the puzzle page, which displays a Christmas-themed story (in English and Spanish), a downloadable Python input file, and a field to submit the answer. A leaderboard ranks participants by stars earned and solving time, filterable by year of study, and an About page explains the scoring, honor code, and schedule.

Sign-up and login require a university email: only addresses ending in @ub.edu.ar or @comunidad.ub.edu.ar are accepted, and any other domain must be rejected with a clear error message ("Only Universidad de Belgrano emails can participate"). Mock authentication is acceptable for this version, but the domain validation must be strict. Two administrator accounts are seeded: guillermo.maquieira@comunidad.ub.edu.ar and natalia.cerda@comunidad.ub.edu.ar. They access an admin panel to edit puzzle content (titles, stories, expected answers, unlock dates), view the leaderboard, and manage participants; regular users have no admin access.

Each puzzle has two answers (part 1 and part 2). A submitted answer that matches the stored solution earns a star and a checkmark on the door. Answers are validated client-side against known solutions - no execution of user code, like Advent of Code. Include two fully written medium-difficulty sample puzzles (day 1 "sifting presents on Santa's conveyor belt with list manipulation", day 5 "route optimization for gift delivery with dictionaries and sets") plus placeholders for days 2-12 that admins can fill in later. Each user has a profile showing their earned stars.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ub-code-advent.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8172d69f-f7f4-492a-ba39-296181968120).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
