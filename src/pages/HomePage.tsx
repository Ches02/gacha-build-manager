import CharacterCard from "../components/CharacterCard";

const characters = [
  {
    name: "Diluc",
    level: 90,
    talents: [9, 9, 10] as [number, number, number],
    weapon: "Lápida del Lobo",
    build: "Bruja Carmesí",
    imageUrl:
      "https://static.wikia.nocookie.net/gensin-impact/images/0/0d/Diluc_Icon.png",

    materialGroups: [
  {
    title: "Ascensión",
    materials: [
      {
        name: "Fragmento de ágata agnidus",
        icon: "🔴",
        current: 6,
        required: 12,
      },
      {
        name: "Insignia del recluta",
        icon: "🟡",
        current: 40,
        required: 100,
      },
      {
        name: "Semilla de fuego",
        icon: "🔵",
        current: 6,
        required: 12,
      },
      {
        name: "Luccetta",
        icon: "🌼",
        current: 40,
        required: 100,
      },
    ],
  },
  {
    title: "Talentos",
    materials: [
      {
        name: "Enseñanzas de la resistencia",
        icon: "🔵",
        current: 6,
        required: 12,
      },
      {
        name: "Insignia del recluta",
        icon: "🟡",
        current: 40,
        required: 100,
      },
      {
        name: "Guía de la resistencia",
        icon: "🔵",
        current: 6,
        required: 12,
      },
      {
        name: "Insignia del sargento",
        icon: "🟣",
        current: 40,
        required: 100,
      },
    ],
  },
  {
    title: "Armas",
    materials: [
      {
        name: "Material de mejora de arma",
        icon: "🔵",
        current: 6,
        required: 12,
      },
      {
        name: "Pergamino",
        icon: "🟣",
        current: 40,
        required: 100,
      },
      {
        name: "Material de mejora",
        icon: "🔵",
        current: 6,
        required: 12,
      },
      {
        name: "Material de enemigo",
        icon: "🟣",
        current: 40,
        required: 100,
      },
    ],
  },
],
  },
  {
    name: "Personaje B",
    level: 80,
    talents: [8, 8, 8] as [number, number, number],
    weapon: "Arma equipada",
    build: "Build principal",
    imageUrl:
      "https://static.wikia.nocookie.net/gensin-impact/images/0/0d/Diluc_Icon.png",
      materialGroups: [
  {
    title: "Talentos",
    materials: [
      {
        name: "Enseñanzas de la resistencia",
        icon: "🔵",
        current: 6,
        required: 12,
      },
      {
        name: "Insignia del recluta",
        icon: "🟡",
        current: 40,
        required: 100,
      },
      {
        name: "Guía de la resistencia",
        icon: "🔵",
        current: 6,
        required: 12,
      },
      {
        name: "Insignia del sargento",
        icon: "🟣",
        current: 40,
        required: 100,
      },
    ],
  },
  {
    title: "Armas",
    materials: [
      {
        name: "Material de mejora de arma",
        icon: "🔵",
        current: 6,
        required: 12,
      },
      {
        name: "Pergamino",
        icon: "🟣",
        current: 40,
        required: 100,
      },
      {
        name: "Material de mejora",
        icon: "🔵",
        current: 6,
        required: 12,
      },
      {
        name: "Material de enemigo",
        icon: "🟣",
        current: 40,
        required: 100,
      },
    ],
  },
],
  },
  {
    name: "Personaje C",
    level: 70,
    talents: [6, 7, 6] as [number, number, number],
    weapon: "Arma equipada",
    build: "Build pendiente",
    imageUrl:
      "https://static.wikia.nocookie.net/gensin-impact/images/0/0d/Diluc_Icon.png",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen px-8 py-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
          Inicio
        </p>

        <h2 className="mt-1 text-3xl font-bold tracking-tight text-emerald-950">
          Mis personajes
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-emerald-800/70">
          Un resumen de los personajes que estás construyendo y del estado
          actual de sus builds.
        </p>
      </header>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-emerald-950">
              Personajes en progreso
            </h3>

            <p className="mt-1 text-sm text-emerald-800/70">
              Podrás cambiar el orden y agregar todos los personajes que
              quieras.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            + Agregar PJ
          </button>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {characters.map((character) => (
            <CharacterCard
              key={character.name}
              name={character.name}
              level={character.level}
              talents={character.talents}
              weapon={character.weapon}
              build={character.build}
              imageUrl={character.imageUrl}
              materialGroups={character.materialGroups || []}
            />
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-emerald-900/10 bg-[#fffdf5] p-6 shadow-sm">
        <h3 className="text-lg font-bold text-emerald-950">
          Mis recursos
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-800/70">
          Acá podremos mostrar materiales pendientes, días de dominio,
          recursos necesarios para talentos, armas y otros objetivos.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Materiales
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-950">—</p>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Talentos
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-950">—</p>
          </div>

          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Armas
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-950">—</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;