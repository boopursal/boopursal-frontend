import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-slate-50">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900">
          Boopursal
          <span className="block text-blue-600 text-2xl sm:text-3xl mt-2 font-light">Nouvelle Génération</span>
        </h1>

        <p className="text-lg text-slate-600">
          Bienvenue sur la version 2.0 de votre plateforme.
          Une expérience plus rapide, plus fluide et plus professionnelle.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/login"
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-12 px-8 shadow-lg shadow-blue-200"
          >
            Accéder à la plateforme
            <ArrowRight size={18} />
          </Link>
          <a
            href="https://it.3findustrie.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-200 transition-colors flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 text-slate-600 text-sm sm:text-base h-12 px-8"
          >
            Voir l'ancienne version
          </a>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-slate-400 text-sm">
        <span>© 2026 Boopursal</span>
        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
        <span>Version Next.js Premium</span>
      </footer>
    </div>
  );
}
