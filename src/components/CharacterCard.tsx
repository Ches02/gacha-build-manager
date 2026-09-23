interface Material {
  name: string;
  icon: string;
  required: number;
}

interface MaterialGroup {
  title: string;
  materials: Material[];
}

interface CharacterCardProps {
  name: string;
  level: number;
  talents: [number, number, number];
  weapon: string;
  build: string;
  imageUrl: string;
  materialGroups: MaterialGroup[];

  onView?: () => void;
  onRemove: () => void;
}

function CharacterCard({
  name,
  level,
  talents,
  weapon,
  build,
  imageUrl,
  materialGroups,
  onView,
  onRemove,
}: CharacterCardProps) {
  const visibleGroups = materialGroups.filter(
    (group) => group.materials.length > 0
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#fffdf5] shadow-sm">
      {/* Cabecera */}
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] items-center gap-4 p-4">
        {/* Imagen y datos del personaje */}
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={imageUrl}
            alt={name}
            className="h-20 w-20 shrink-0 rounded-xl bg-emerald-900/10 object-cover"
          />

          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold text-emerald-950">
              {name}
            </h3>

            <p className="text-sm text-emerald-900/70">
              Nivel {level}
            </p>

            <p className="mt-1 text-xs text-emerald-900/60">
              Talentos: {talents.join(" / ")}
            </p>
          </div>
        </div>

        {/* Arma y build */}
        <div className="flex min-w-0 flex-col gap-2">
          <div className="min-w-0">
            <p className="text-xs text-emerald-900/60">
              Arma
            </p>

            <p className="truncate text-sm font-semibold text-emerald-950">
              {weapon}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-emerald-900/60">
              Build
            </p>

            <p className="truncate text-sm font-semibold text-emerald-950">
              {build}
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={onView}
            className="whitespace-nowrap rounded-lg bg-emerald-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Ver
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="whitespace-nowrap rounded-lg border border-red-800/20 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-800 transition hover:bg-red-100"
          >
            Quitar del home
          </button>
        </div>
      </div>

      {/* Materiales necesarios */}
      {visibleGroups.length > 0 ? (
        <div className="border-t border-emerald-900/10 p-4">
          <h4 className="mb-2 text-sm font-bold text-emerald-950">
            Materiales necesarios
          </h4>

          <div className="space-y-3">
            {visibleGroups.map((group) => (
              <section key={group.title}>
                <h5 className="mb-1 text-xs font-semibold text-emerald-950">
                  {group.title}
                </h5>

                <div className="flex flex-wrap gap-1.5">
                  {group.materials.map((material) => (
                    <div
                      key={material.name}
                      title={`${material.name}: necesitás ${material.required}`}
                      className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border border-emerald-900/10 bg-[#eee9dc]"
                    >
                      <img
                        src={material.icon}
                        alt={material.name}
                        title={material.name}
                        className="h-full w-full object-contain p-0.5"
                      />

                      <span className="absolute inset-x-0 bottom-0 bg-black/60 px-0.5 text-center text-[9px] font-semibold leading-3 text-white">
                        {material.required}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-t border-emerald-900/10 px-4 py-3">
          <p className="text-xs text-emerald-800">
            No hay materiales para mostrar.
          </p>
        </div>
      )}
    </article>
  );
}

export default CharacterCard;