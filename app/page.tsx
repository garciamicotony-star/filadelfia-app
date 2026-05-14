export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-900 shadow-lg">
        <span className="text-4xl">📖</span>
      </div>
      <h1 className="mb-3 text-4xl font-bold tracking-tight text-blue-900">
        Filadelfia App
      </h1>
      <p className="mb-2 max-w-md text-lg text-slate-600">
        Motor de estudio bíblico asistido por IA
      </p>
      <p className="max-w-sm text-sm text-slate-400">
        Hermenéutica literal-gramatical-histórica · Teología paulina · Misión Filadelfia
      </p>
      <div className="mt-12 rounded-lg border border-blue-100 bg-blue-50 px-6 py-4">
        <p className="text-sm text-blue-800 italic">
          &ldquo;Toda la Escritura es inspirada por Dios&rdquo; — 2 Timoteo 3:16 (RV1909)
        </p>
      </div>
      <p className="mt-10 text-xs text-slate-300">Fase 0 — Cimientos</p>
    </main>
  );
}
