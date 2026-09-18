function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-emerald-900/10 bg-emerald-950 px-5 py-6 text-emerald-50">
      <div className="mb-10">
        <h1 className="text-xl font-bold tracking-tight">
          Gacha Build Manager
        </h1>
        <p className="mt-1 text-sm text-emerald-200">
          Tu cuaderno de builds
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          Menú
        </p>

        <button className="rounded-lg bg-emerald-800 px-3 py-2 text-left text-sm font-medium text-white">
          Inicio
        </button>

        <button className="rounded-lg px-3 py-2 text-left text-sm text-emerald-100 transition hover:bg-emerald-900">
          Mis PJs
        </button>

        <button className="rounded-lg px-3 py-2 text-left text-sm text-emerald-100 transition hover:bg-emerald-900">
          Mis Armas
        </button>

        <button className="rounded-lg px-3 py-2 text-left text-sm text-emerald-100 transition hover:bg-emerald-900">
          Mis Artefactos
        </button>

        <button className="rounded-lg px-3 py-2 text-left text-sm text-emerald-100 transition hover:bg-emerald-900">
          Mis Builds
        </button>

        <button className="rounded-lg px-3 py-2 text-left text-sm text-emerald-100 transition hover:bg-emerald-900">
          Mis Loadouts
        </button>
      </nav>

      <nav className="mt-8 flex flex-col gap-2">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          Catálogo
        </p>

        <button className="rounded-lg px-3 py-2 text-left text-sm text-emerald-100 transition hover:bg-emerald-900">
          Personajes
        </button>

        <button className="rounded-lg px-3 py-2 text-left text-sm text-emerald-100 transition hover:bg-emerald-900">
          Armas
        </button>

        <button className="rounded-lg px-3 py-2 text-left text-sm text-emerald-100 transition hover:bg-emerald-900">
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