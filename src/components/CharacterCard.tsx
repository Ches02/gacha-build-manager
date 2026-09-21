interface Material {
  name: string;
  icon: string;
  current: number;
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
}

function CharacterCard({
  name,
  level,
  talents,
  weapon,
  build,
  imageUrl,
  materialGroups,
}: CharacterCardProps) {
  // Ocultamos materiales completos y categorías vacías.
  const pendingGroups = materialGroups
    .map((group) => ({
      ...group,
      materials: group.materials.filter(
        (material) => material.current < material.required
      ),
    }))
    .filter((group) => group.materials.length > 0);

  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#fffdf5] shadow-sm">
      {/* Cabecera: personaje | arma y build | botón */}
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] items-center gap-4 p-4">
        {/* Imagen y datos */}
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

        {/* Arma y build a la derecha de la imagen */}
        <div className="flex min-w-0 flex-col gap-2">
          <div className="min-w-0">
            <p className="text-xs text-emerald-900/60">Arma</p>
            <p className="truncate text-sm font-semibold text-emerald-950">
              {weapon}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-emerald-900/60">Build</p>
            <p className="truncate text-sm font-semibold text-emerald-950">
              {build}
            </p>
          </div>
        </div>

        {/* Botón Ver */}
        <button
          type="button"
          className="justify-self-end whitespace-nowrap rounded-lg bg-emerald-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-800">
          Ver
        </button>
      </div>


      {/* Arma y build en móvil 
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] items-center gap-4 p-4">
        <div className="min-w-0">
          <p className="text-xs text-emerald-900/60">Arma</p>
          <p className="truncate text-sm font-semibold text-emerald-950">
            {weapon}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-emerald-900/60">Build</p>
          <p className="truncate text-sm font-semibold text-emerald-950">
            {build}
          </p>
        </div>
      </div>*/}

      {/* Materiales pendientes */}
      {pendingGroups.length > 0 && (
        <div className="border-t border-emerald-900/10 p-4">
          <h4 className="mb-2 text-sm font-bold text-emerald-950">
            Materiales pendientes
          </h4>

          <div className="space-y-3">
            {pendingGroups.map((group) => (
              <section key={group.title}>
                <h5 className="mb-1 text-xs font-semibold text-emerald-950">
                  {group.title}
                </h5>

                <div className="flex flex-wrap gap-1.5">
                  {group.materials.map((material) => {
                    const remaining =
                      material.required - material.current;

                    return (
                      <div
                        key={material.name}
                        title={`${material.name}: tenés ${material.current} de ${material.required}. Faltan ${remaining}`}
                        className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border border-emerald-900/10 bg-[#eee9dc]"
                      >
                        <span className="text-xl leading-none">
                          {material.icon}
                        </span>

                        <span className="absolute inset-x-0 bottom-0 bg-black/60 px-0.5 text-center text-[9px] font-semibold leading-3 text-white">
                          {material.current}/{material.required}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {pendingGroups.length === 0 && (
        <div className="border-t border-emerald-900/10 px-4 py-3">
          <p className="text-xs text-emerald-800">
            ¡No hay materiales pendientes!
          </p>
        </div>
      )}
    </article>
  );
}

export default CharacterCard;