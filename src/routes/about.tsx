import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Acerca de — Code Advent" },
      {
        name: "description",
        content:
          "Reglas de puntaje, código de honor y cronograma del 1 al 12 de diciembre para el calendario de programación en Python de la Universidad de Belgrano.",
      },
      { property: "og:title", content: "Acerca de — Code Advent" },
      {
        property: "og:description",
        content: "Puntaje, código de honor y cronograma de Code Advent.",
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
      <h1 className="text-4xl font-bold tracking-tight">Acerca de Code Advent</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Inspirado en Advent of Code, Code Advent es un desafío de programación en Python de 12 días
        pensado para estudiantes de la Universidad de Belgrano.
      </p>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-2xl font-semibold text-foreground">Puntaje</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90">
            <li>
              Cada desafío tiene <strong>dos partes</strong> (Parte 1 y Parte 2). Cada respuesta
              correcta suma <strong>1 estrella dorada</strong>, hasta un máximo de 24 estrellas en los 12 días.
            </li>
            <li>
              Escribís y ejecutás tu script de Python localmente en tu computadora usando el
              archivo de entrada descargable, y luego pegás aquí solo el resultado final calculado.
            </li>
            <li>
              El Leaderboard ordena a los participantes principalmente por <strong>total de estrellas ganadas</strong>.
              En caso de empate, define el menor tiempo acumulado de resolución.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">Código de Honor</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90">
            <li>
              Escribí tu propio código en Python. Conversar sobre algoritmos generales con
              compañeros está buenísimo, pero no está permitido compartir respuestas directas ni
              soluciones completas mientras el evento está en curso.
            </li>
            <li>
              La participación es exclusiva para la comunidad de la Universidad de Belgrano con
              correo oficial <span className="font-mono text-star">@ub.edu.ar</span> o{" "}
              <span className="font-mono text-star">@comunidad.ub.edu.ar</span>.
            </li>
            <li>
              Mantené un espíritu amigable y educativo: la idea es practicar y mejorar juntos en Python.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">Cronograma</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            Las puertas se abren todos los días del <strong>1 al 12 de diciembre</strong> a las
            00:00 hora de Argentina (UTC-3). Una vez desbloqueado, cada desafío permanece abierto
            el resto del evento para que puedas ponerte al día a tu ritmo.
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <Link to="/" className="text-sm font-medium text-star hover:underline">
          Volver al Calendario de Adviento →
        </Link>
      </div>
    </div>
  );
}