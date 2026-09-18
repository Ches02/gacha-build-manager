interface CharacterCardProps {
  name: string;
  level: number;
  talents: [number, number, number];
  weapon: string;
  build: string;
  imageUrl: string;
}

function CharacterCard({
  name,
  level,
  talents,
  weapon,
  build,
  imageUrl,
}: CharacterCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#fffdf5] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex gap-4 p-4">
        <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-emerald-100">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="truncate text-lg font-bold text-emerald-950">
                {name}
              </h3>

              <p className="mt-0.5 text-sm text-emerald-700">
                Nivel {level}
              </p>
            </div>

            <button
              type="button"
              className="rounded-lg px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
            >
              Ver
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Talentos
            </p>

            <div className="mt-1 flex gap-2">
              {talents.map((talent, index) => (
                <span
                  key={index}
                  className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-900"
                >
                  {talent}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-900/10 bg-emerald-50/60 px-4 py-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-emerald-600">Arma</p>
            <p className="truncate font-medium text-emerald-950">
              {weapon}
            </p>
          </div>

          <div>
            <p className="text-xs text-emerald-600">Build</p>
            <p className="truncate font-medium text-emerald-950">
              {build}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CharacterCard;