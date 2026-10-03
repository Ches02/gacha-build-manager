
import { useEffect, useState } from "react";
import CharacterCard from "../components/CharacterCard";
import CreateLoadoutModal from "../components/CreateLoadoutModal";
import type { MaterialCategory } from "../types/materials";

/*--- CHARACTER CARD ---*/

interface ApiCharacterCard {
  id: number;
  name: string;
  description: string | null;

  character: {
    id: number;
    key: string;
    name: string;
    element: string;
    rarity: number;
    nation: string;
    weaponType: {
      key: string;
      name: string;
    };
    level: number;
    ascension: number;
    talents: {
      normalAttack: number;
      elementalSkill: number;
      elementalBurst: number;
    };
  };

  targets: {
    level: number | null;
    ascension: number | null;
    normalAttackLevel: number | null;
    elementalSkillLevel: number | null;
    elementalBurstLevel: number | null;
    weaponLevel: number | null;
  };

  weapon: {
    id: number;
    key: string;
    name: string;
    level: number;
    refinement: number;
  } | null;

  artifactLoadout: {
    id: number;
    name: string;
    description: string | null;
    artifacts: {
      id: number;
      set: {
        key: string;
        name: string;
      };
      slot: {
        key: string;
        name: string;
      };
      level: number;
    }[];
  } | null;

  materials: {
    ascension: MaterialCategory;
    talents: MaterialCategory;
    weapon: MaterialCategory;
  };
}

interface ApiResponse {
  cards: {
    cards: ApiCharacterCard[];
  };
}

interface ApiLoadout {
  id: number;
  name: string;
  description: string | null;
  showInHome: boolean;
  character: {
    name: string;
  } | null;
}

/*--- CALENDAR ---*/
interface ApiCalendarMaterial {
  materialKey: string;
  name: string;
  type: string;
  rarity: number;
  quantity?: number;
}

interface ApiCalendarCategory {
  required: ApiCalendarMaterial[];
  availableRare3?: ApiCalendarMaterial[];
  availableRare4?: ApiCalendarMaterial[];
}

interface ApiCalendarResponse {
  day: string;
  talents: ApiCalendarCategory;
  weapons: ApiCalendarCategory;
}

function HomePage() {
  const [characters, setCharacters] = useState<ApiCharacterCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [loadouts, setLoadouts] = useState<ApiLoadout[]>([]);
  const [selectedLoadoutId, setSelectedLoadoutId] = useState("");
  const [loadingLoadouts, setLoadingLoadouts] = useState(false);
  const [savingLoadout, setSavingLoadout] = useState(false);
  const [popupError, setPopupError] = useState<string | null>(null);
  const [loadoutToRemove, setLoadoutToRemove] = useState<number | null>(null);
  const [removingLoadout, setRemovingLoadout] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [calendar, setCalendar] = useState<ApiCalendarResponse | null>(null);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  // Cargar las tarjetas de Inicio.
  async function fetchCharacterCards() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:3000/api/home/character-cards",
      );

      if (!response.ok) {
        throw new Error(
          `Error al cargar las cards: ${response.status}`,
        );
      }

      const data: ApiResponse = await response.json();
      setCharacters(data.cards.cards);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar los personajes.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:3000/api/home/character-cards",
        );

        if (!response.ok) {
          throw new Error(
            `Error al cargar las cards: ${response.status}`,
          );
        }

        const data: ApiResponse = await response.json();

        if (!cancelled) {
          setCharacters(data.cards.cards);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los personajes.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initialLoad();
    fetchCalendar();

    return () => {
      cancelled = true;
    };
  }, []);

  // Abrir el popup y cargar los loadouts existentes.
  async function openAddPopup() {
    setShowAddPopup(true);
    setPopupError(null);
    setSelectedLoadoutId("");
    setLoadingLoadouts(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/user/loadouts",
      );

      if (!response.ok) {
        throw new Error("No se pudieron cargar los loadouts.");
      }

      const data = await response.json();
      setLoadouts(data.loadouts);
    } catch (err) {
      setPopupError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al cargar los loadouts.",
      );
    } finally {
      setLoadingLoadouts(false);
    }
  }

  // Activar showInHome en el loadout seleccionado.
  async function handleAddLoadout() {
    if (!selectedLoadoutId) {
      setPopupError("Seleccioná un loadout.");
      return;
    }

    setSavingLoadout(true);
    setPopupError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/user/loadouts/${selectedLoadoutId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            showInHome: true,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo agregar el personaje a Inicio.",
        );
      }

      // Cerramos el popup y actualizamos las tarjetas.
      setShowAddPopup(false);
      await fetchCharacterCards();
    } catch (err) {
      setPopupError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al agregar el personaje.",
      );
    } finally {
      setSavingLoadout(false);
    }
  }

  // Quitamos un Loadout de Inicio
  async function handleRemoveLoadout() {
    if (loadoutToRemove === null) return;

    try {
      setRemovingLoadout(true);
      setPopupError(null);

      const response = await fetch(
        `http://localhost:3000/api/user/loadouts/${loadoutToRemove}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            showInHome: false,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("No se pudo quitar el loadout del home.");
      }

      setLoadoutToRemove(null);
      await fetchCharacterCards();
    } catch (err) {
      setPopupError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al quitar el loadout.",
      );
    } finally {
      setRemovingLoadout(false);
    }
  }

  // Popup de confirmación para quitar un loadout de Inicio
  function openRemovePopup(loadoutId: number) {
    setLoadoutToRemove(loadoutId);
    setPopupError(null);
  }

  // Abrir el modal para crear un nuevo loadout
  function openCreateLoadout() {
    setShowAddPopup(false);
    setPopupError(null);
    setShowCreateModal(true);
  }

  // Cargar el calendario de materiales
  async function fetchCalendar() {
    try {
      setLoadingCalendar(true);
      setCalendarError(null);

      const response = await fetch(
        "http://localhost:3000/api/home/calendar",
      );

      if (!response.ok) {
        throw new Error(
          `Error al cargar el calendario: ${response.status}`,
        );
      }

      const data: ApiCalendarResponse =
        await response.json();

      setCalendar(data);
    } catch (err) {
      setCalendarError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar el calendario.",
      );
    } finally {
      setLoadingCalendar(false);
    }
  }

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
            onClick={openAddPopup}
            className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            + Agregar PJ
          </button>
        </div>

        {loading && (
          <p className="mt-5 text-sm text-emerald-800/70">
            Cargando personajes...
          </p>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">
              No se pudieron cargar los personajes.
            </p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && characters.length === 0 && (
          <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800/70">
            Todavía no hay personajes para mostrar en Inicio.
          </p>
        )}

        {!loading && !error && characters.length > 0 && (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {characters.map((card) => {
              const materialGroups = [
                {
                  title: "Ascensión",
                  materials: card.materials.ascension.materials.map(
                    (materialRequirement) => ({
                      name: materialRequirement.name,
                      icon: `/images/materials/${materialRequirement.type}/${materialRequirement.materialKey}.webp`,
                      required: materialRequirement.quantity,
                    }),
                  ),
                },
                {
                  title: "Talentos",
                  materials: card.materials.talents.materials.map(
                    (materialRequirement) => ({
                      name: materialRequirement.name,
                      icon: `/images/materials/${materialRequirement.type}/${materialRequirement.materialKey}.webp`,
                      required: materialRequirement.quantity,
                    }),
                  ),
                },
                {
                  title: "Armas",
                  materials: card.materials.weapon.materials.map(
                    (materialRequirement) => ({
                      name: materialRequirement.name,
                      icon: `/images/materials/${materialRequirement.type}/${materialRequirement.materialKey}.webp`,
                      required: materialRequirement.quantity,
                    }),
                  ),
                },
              ];

              return (
                <CharacterCard
                  key={card.id}
                  name={card.character.name}
                  level={card.character.level}
                  talents={[
                    card.character.talents.normalAttack,
                    card.character.talents.elementalSkill,
                    card.character.talents.elementalBurst,
                  ]}
                  weapon={card.weapon?.name ?? "Sin arma"}
                  build={
                    card.artifactLoadout?.name ??
                    card.name ??
                    "Sin build"
                  }
                  imageUrl={`/images/characters/${card.character.key}.webp`}

                  materialGroups={materialGroups}
                  onRemove={() => openRemovePopup(card.id)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Popup para agregar un loadout existente */}
      {showAddPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#fffdf5] p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-emerald-950">
                  Agregar personaje
                </h3>

                <p className="mt-1 text-sm text-emerald-800/70">
                  Seleccioná un loadout existente para mostrarlo en Inicio.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddPopup(false)}
                className="rounded-lg px-2 py-1 text-lg text-emerald-900 hover:bg-emerald-100"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            {loadingLoadouts ? (
              <p className="mt-5 text-sm text-emerald-800/70">
                Cargando loadouts...
              </p>
            ) : (
              <>
                <label
                  htmlFor="loadout-select"
                  className="mt-5 block text-sm font-semibold text-emerald-950"
                >
                  Loadout
                </label>

                <select
                  id="loadout-select"
                  value={selectedLoadoutId}
                  onChange={(event) =>
                    setSelectedLoadoutId(event.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-emerald-900/20 bg-white px-3 py-2 text-sm text-emerald-950 outline-none focus:border-emerald-700"
                >
                  <option value="">Elegí un loadout...</option>

                  {loadouts.map((loadout) => (
                    <option
                      key={loadout.id}
                      value={loadout.id}
                      disabled={loadout.showInHome}
                    >
                      {loadout.character?.name ?? "Personaje"} —{" "}
                      {loadout.name}
                      {loadout.showInHome
                        ? " (ya está en Inicio)"
                        : ""}
                    </option>
                  ))}
                </select>

                {loadouts.length === 0 && (
                  <p className="mt-3 text-sm text-emerald-800/70">
                    No tenés loadouts creados todavía.
                  </p>
                )}
              </>
            )}

            {popupError && (
              <p className="mt-3 text-sm text-red-700">
                {popupError}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={openCreateLoadout}
                disabled={loadingLoadouts || savingLoadout}
                className="rounded-lg border border-emerald-800 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                + Crear loadout
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPopup(false)}
                  className="rounded-lg border border-emerald-900/20 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleAddLoadout}
                  disabled={
                    loadingLoadouts ||
                    savingLoadout ||
                    !selectedLoadoutId
                  }
                  className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingLoadout ? "Agregando..." : "Agregar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup para quitar un loadout de Inicio */}
      {loadoutToRemove !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#fffdf5] p-6 shadow-xl">
            <h3 className="text-xl font-bold text-emerald-950">
              Quitar del home
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-emerald-800/80">
              ¿Seguro que querés quitar este loadout del home?
            </p>

            {popupError && (
              <p className="mt-3 text-sm text-red-700">
                {popupError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setLoadoutToRemove(null);
                  setPopupError(null);
                }}
                disabled={removingLoadout}
                className="rounded-lg border border-emerald-900/20 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-50"
              >
                No
              </button>

              <button
                type="button"
                onClick={handleRemoveLoadout}
                disabled={removingLoadout}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {removingLoadout ? "Quitando..." : "Sí, quitar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateLoadoutModal
          onClose={() => setShowCreateModal(false)}
          onCreated={async () => {
            setShowCreateModal(false);
            await fetchCharacterCards();
          }}
        />
      )}

      <section className="mt-8 rounded-2xl border border-emerald-900/10 bg-[#fffdf5] p-6 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-emerald-950">
            Materiales disponibles hoy
          </h3>

          {calendar && (
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-emerald-600">
              {calendar.day}
            </p>
          )}
        </div>

        {loadingCalendar && (
          <p className="mt-5 text-sm text-emerald-800/70">
            Cargando calendario...
          </p>
        )}

        {calendarError && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">
              No se pudo cargar el calendario.
            </p>

            <p className="mt-1">
              {calendarError}
            </p>
          </div>
        )}

        {!loadingCalendar &&
          !calendarError &&
          calendar && (
            <div className="mt-6 space-y-8">

              {/* TALENTOS */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-950">
                  Talentos
                </h4>

                <div className="mt-3 flex flex-wrap gap-3">
                  {calendar.talents.required.length === 0 ? (
                    <p className="text-sm text-emerald-800/60">
                      No necesitás materiales de talentos disponibles hoy.
                    </p>
                  ) : (
                    calendar.talents.required.map((material) => (
                      <div
                        key={material.name}
                        title={`${material.name}: necesitás ${material.quantity}`}
                        className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border border-emerald-900/10 bg-[#eee9dc]"
                      >
                        <img
                          src={`/images/materials/${material.type}/${material.materialKey}.webp`}
                          alt={material.name}
                          title={material.name}
                          className="h-full w-full object-contain p-0.5"
                        />

                        <span className="absolute inset-x-0 bottom-0 bg-black/60 px-0.5 text-center text-[9px] font-semibold leading-3 text-white">
                          {material.quantity}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                  {calendar.talents.availableRare3?.map(
                    (material) => (
                      <div
                        key={material.name}
                        title={`${material.name}`}
                        className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border border-emerald-900/10 bg-[#eee9dc]"
                      >
                        <img
                          src={`/images/materials/${material.type}/${material.materialKey}.webp`}
                          alt={material.name}
                          title={material.name}
                          className="h-full w-full object-contain p-0.5"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* ARMAS */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-950">
                  Armas
                </h4>

                <div className="mt-3 flex flex-wrap gap-3">
                  {calendar.weapons.required.length === 0 ? (
                    <p className="text-sm text-emerald-800/60">
                      No necesitás materiales de armas disponibles hoy.
                    </p>
                  ) : (
                    calendar.weapons.required.map((material) => (
                      <div
                        key={material.name}
                        title={`${material.name}: necesitás ${material.quantity}`}
                        className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border border-emerald-900/10 bg-[#eee9dc]"
                      >
                        <img
                          src={`/images/materials/${material.type}/${material.materialKey}.webp`}
                          alt={material.name}
                          title={material.name}
                          className="h-full w-full object-contain p-0.5"
                        />

                        <span className="absolute inset-x-0 bottom-0 bg-black/60 px-0.5 text-center text-[9px] font-semibold leading-3 text-white">
                          {material.quantity}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                  {calendar.weapons.availableRare4?.map(
                    (material) => (
                      <div
                        key={material.name}
                        title={`${material.name}`}
                        className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border border-emerald-900/10 bg-[#eee9dc]"
                      >
                        <img
                          src={`/images/materials/${material.type}/${material.materialKey}.webp`}
                          alt={material.name}
                          title={material.name}
                          className="h-full w-full object-contain p-0.5"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

            </div>
          )}
      </section>
    </div>
  );
}

export default HomePage;