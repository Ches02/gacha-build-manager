import type { Page } from "../types/page";

interface SidebarProps {
  page: Page;
  onNavigate: (page: Page) => void;
}

function Sidebar({
  page,
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-emerald-900/10 bg-emerald-950 px-5 py-6 text-emerald-50">
      <div className="mb-10">
        <h1 className="text-xl font-bold tracking-tight">
          Benito
        </h1>

        <p className="mt-1 text-sm text-emerald-200">
          El asistente para gatchas
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          Menú
        </p>

        <button
          type="button"
          onClick={() => onNavigate("home")}
          className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
            page === "home"
              ? "bg-emerald-800 text-white"
              : "text-emerald-100 hover:bg-emerald-900"
          }`}
        >
          Inicio
        </button>

        <button
          type="button"
          onClick={() => onNavigate("mis-pjs")}
          className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
            page === "mis-pjs"
              ? "bg-emerald-800 text-white"
              : "text-emerald-100 hover:bg-emerald-900"
          }`}
        >
          Mis PJs
        </button>

        <button
          type="button"
          onClick={() => onNavigate("mis-armas")}
          className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
            page === "mis-armas"
              ? "bg-emerald-800 text-white"
              : "text-emerald-100 hover:bg-emerald-900"
          }`}
        >
          Mis Armas
        </button>

        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-emerald-100/40"
        >
          Mis Artefactos
        </button>

        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-emerald-100/40"
        >
          Mis Builds
        </button>

        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-emerald-100/40"
        >
          Mis Loadouts
        </button>
      </nav>

      <nav className="mt-8 flex flex-col gap-2">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          Catálogo
        </p>

        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-emerald-100/40"
        >
          Personajes
        </button>

        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-emerald-100/40"
        >
          Armas
        </button>

        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-emerald-100/40"
        >
          Artefactos
        </button>
      </nav>

      <div className="mt-auto rounded-xl bg-emerald-900/60 p-4">
        <p className="text-sm font-semibold text-emerald-100">
          Mis recursos
        </p>

        <p className="mt-1 text-xs leading-relaxed text-emerald-300">
          Próximamente podremos mostrar materiales y recursos pendientes.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;