import { useEffect, useMemo, useState } from "react";
import CharacterDetailModal from "../components/CharacterDetailModal";
import CreateCharacterModal from "../components/CreateCharacterModal";
import CreateLoadoutModal from "../components/CreateLoadoutModal";

interface ApiCharacter {
  key: string;
  name: string;
  element: string;
  weaponType: {
    key: string;
    name: string;
  };
  rarity: number;
  nation: string;
}

interface ApiUserCharacter {
  id: number;
  definitionKey: string;
}

interface ApiUserCharacter {
  id: number;
  definitionKey: string;
  level: number;
  constellation: number;
  friendship: number;
  ascension: number;
  normalAttackLevel: number;
  elementalSkillLevel: number;
  elementalBurstLevel: number;
  isPreferred: boolean;
}

interface ApiUserLoadout {
  id: number;
  name: string;
  description: string | null;
  isPreferred: boolean;

  character: {
    id: number;
    key: string;
    name: string;
    element: string;
    weaponType: {
      key: string;
      name: string;
    };
    rarity: number;
    nation: string;
    level: number;
    constellation: number;
    friendship: number;
    ascension: number;
    talents: {
      normalAttack: number;
      elementalSkill: number;
      elementalBurst: number;
    };
  } | null;

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
      mainStat: {
        key: string;
        name: string;
        value: number;
      };
      subStats: {
        key: string;
        name: string;
        value: number;
      }[];
      level: number;
    }[];
  } | null;

  buildGuides: {
    id: number;
    name: string;
    description: string | null;
  }[];
}

const ELEMENTS = [
  { key: "pyro", name: "Pyro" },
  { key: "hydro", name: "Hydro" },
  { key: "anemo", name: "Anemo" },
  { key: "electro", name: "Electro" },
  { key: "dendro", name: "Dendro" },
  { key: "cryo", name: "Cryo" },
  { key: "geo", name: "Geo" },
];

const WEAPONS = [
  { key: "espada-ligera", name: "Espada", icon: "sword" },
  { key: "mandoble", name: "Mandoble", icon: "claymore" },
  { key: "lanza", name: "Lanza", icon: "polearm" },
  { key: "arco", name: "Arco", icon: "bow" },
  { key: "catalizador", name: "Catalizador", icon: "catalyst" },
];

function getSavedFilters() {
  const saved = localStorage.getItem("benito-mis-pjs-filters");

  if (!saved) {
    return null;
  }

  try {
    const filters = JSON.parse(saved);

    if (
      typeof filters !== "object" ||
      filters === null
    ) {
      return null;
    }

    return filters;
  } catch {
    return null;
  }
}

function MisPJsPage() {
  const [characters, setCharacters] = useState<ApiCharacter[]>([]);
  const [userCharacters, setUserCharacters] = useState<ApiUserCharacter[]>([]);

  const savedFilters = getSavedFilters();

  const [selectedOwnership, setSelectedOwnership] = useState<string[]>(Array.isArray(savedFilters?.ownership) ? savedFilters.ownership : ["owned"]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>(Array.isArray(savedFilters?.rarities) ? savedFilters.rarities : []);
  const [selectedElements, setSelectedElements] = useState<string[]>(Array.isArray(savedFilters?.elements) ? savedFilters.elements : []);
  const [selectedWeapons, setSelectedWeapons] = useState<string[]>(Array.isArray(savedFilters?.weapons) ? savedFilters.weapons : []);

  const [loadouts, setLoadouts] = useState<ApiUserLoadout[]>([]);
  const [selectedCharacterKey, setSelectedCharacterKey] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [selectedLoadoutId, setSelectedLoadoutId] = useState<number | null>(null);

  const [showCreateCharacterModal, setShowCreateCharacterModal] = useState(false);
  const [characterToCreate, setCharacterToCreate] = useState<ApiCharacter | null>(null);
  const [showCreateLoadoutModal, setShowCreateLoadoutModal] = useState(false);
  const [createdCharacterId, setCreatedCharacterId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(
      "benito-mis-pjs-filters",
      JSON.stringify({
        ownership: selectedOwnership,
        rarities: selectedRarities,
        elements: selectedElements,
        weapons: selectedWeapons,
      }),
    );
  }, [
    selectedOwnership,
    selectedRarities,
    selectedElements,
    selectedWeapons,
  ]);

  useEffect(() => {
    async function loadCharacters() {
      try {
        setLoading(true);
        setError(null);

        const [charactersResponse, userCharactersResponse, loadoutsResponse] = await Promise.all([
          fetch("http://localhost:3000/api/characters"),
          fetch("http://localhost:3000/api/user/characters"),
          fetch("http://localhost:3000/api/user/loadouts"),
        ]);

        if (!charactersResponse.ok) {
          throw new Error(
            `Error al cargar el catálogo: ${charactersResponse.status}`,
          );
        }

        if (!userCharactersResponse.ok) {
          throw new Error(
            `Error al cargar tus personajes: ${userCharactersResponse.status}`,
          );
        }

        if (!loadoutsResponse.ok) {
          throw new Error(
            `Error al cargar los loadouts: ${loadoutsResponse.status}`,
          );
        }

        const charactersData = await charactersResponse.json();
        const userCharactersData = await userCharactersResponse.json();
        const catalog: ApiCharacter[] = charactersData.characters ?? charactersData;
        const owned: ApiUserCharacter[] = userCharactersData.characters ?? userCharactersData;
        const loadoutsData = await loadoutsResponse.json();
        const userLoadouts: ApiUserLoadout[] = loadoutsData.loadouts ?? loadoutsData;

        setLoadouts(userLoadouts);

        setCharacters(catalog);
        setUserCharacters(owned);

        if (owned.length === 0) {
          setSelectedOwnership(["owned", "not-owned"]);
        }
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

    loadCharacters();
  }, []);

  const ownedKeys = useMemo(() => {
    return new Set(
      userCharacters.map((character) => character.definitionKey),
    );
  }, [userCharacters]);

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => {
      const owned = ownedKeys.has(character.key);

      // Tengo / No tengo
      const ownershipMatches =
        selectedOwnership.length === 0 ||
        (owned && selectedOwnership.includes("owned")) ||
        (!owned && selectedOwnership.includes("not-owned"));

      if (!ownershipMatches) {
        return false;
      }

      // Rareza
      const rarityMatches =
        selectedRarities.length === 0 ||
        selectedRarities.includes(String(character.rarity));

      if (!rarityMatches) {
        return false;
      }

      // Elemento
      const elementMatches =
        selectedElements.length === 0 ||
        selectedElements.includes(character.element.toLowerCase());

      if (!elementMatches) {
        return false;
      }

      // Arma
      const weaponMatches =
        selectedWeapons.length === 0 ||
        selectedWeapons.includes(character.weaponType.key);

      if (!weaponMatches) {
        return false;
      }

      return true;
    });
  }, [
    characters,
    ownedKeys,
    selectedOwnership,
    selectedRarities,
    selectedElements,
    selectedWeapons,
  ]);

  function toggleFilter(
    value: string,
    selected: string[],
    setSelected: (values: string[]) => void,
  ) {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
      return;
    }

    setSelected([...selected, value]);
  }

  function openCharacter(character: ApiCharacter) {
    const instances = userCharacters.filter(
      (userCharacter) =>
        userCharacter.definitionKey === character.key,
    );

    if (instances.length === 0) {
      setCharacterToCreate(character);
      setShowCreateCharacterModal(true);
      return;
    }

    setSelectedCharacterKey(character.key);

    const preferred =
      instances.find(
        (instance) => instance.isPreferred,
      ) ?? instances[0];

    setSelectedCharacterId(preferred.id);

    const characterLoadouts = loadouts.filter(
      (loadout) =>
        loadout.character?.id === preferred.id,
    );

    const preferredLoadout =
      characterLoadouts.find(
        (loadout) => loadout.isPreferred,
      ) ?? characterLoadouts[0];

    setSelectedLoadoutId(
      preferredLoadout?.id ?? null,
    );
  }

  async function handleCharacterCreated(characterId: number) {
    try {
      const [userCharactersResponse, loadoutsResponse] = await Promise.all([
        fetch("http://localhost:3000/api/user/characters"),
        fetch("http://localhost:3000/api/user/loadouts"),
      ]);

      if (!userCharactersResponse.ok || !loadoutsResponse.ok) {
        throw new Error(
          "El personaje se creó, pero no se pudieron actualizar los datos.",
        );
      }

      const userCharactersData = await userCharactersResponse.json();
      const loadoutsData = await loadoutsResponse.json();
      const updatedCharacters = userCharactersData.characters ?? userCharactersData;
      const updatedLoadouts = loadoutsData.loadouts ?? loadoutsData;

      setUserCharacters(updatedCharacters);
      setLoadouts(updatedLoadouts);

      // Seleccionamos la instancia recién creada.
      setSelectedCharacterId(characterId);
      setSelectedLoadoutId(null);

      setShowCreateCharacterModal(false);
    } catch (error) {
      console.error(
        "Error al actualizar después de crear personaje:",
        error,
      );
    }
  }

  function handleCharacterChange(characterId: number) {
    setSelectedCharacterId(characterId);

    const characterLoadouts = loadouts.filter(
      (loadout) =>
        loadout.character?.id === characterId,
    );

    const preferredLoadout =
      characterLoadouts.find(
        (loadout) => loadout.isPreferred,
      ) ?? characterLoadouts[0];

    setSelectedLoadoutId(
      preferredLoadout?.id ?? null,
    );
  }

  async function handleSetPreferredCharacter(characterId: number) {
    try {
      const currentCharacter = userCharacters.find(
        (character) => character.id === characterId,
      );

      if (!currentCharacter) {
        return;
      }

      const newPreferredState = !currentCharacter.isPreferred;

      const response = await fetch(
        `http://localhost:3000/api/user/characters/${characterId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPreferred: newPreferredState,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "No se pudo actualizar el personaje preferido.",
        );
      }

      setUserCharacters((currentCharacters) =>
        currentCharacters.map((userCharacter) => {
          if (
            userCharacter.definitionKey !==
            currentCharacter.definitionKey
          ) {
            return userCharacter;
          }

          return {
            ...userCharacter,
            isPreferred:
              newPreferredState &&
              userCharacter.id === characterId,
          };
        }),
      );
    } catch (error) {
      console.error(
        "Error al actualizar personaje preferido:",
        error,
      );
    }
  }

  async function handleSetPreferredLoadout(loadoutId: number) {
  try {
    const currentLoadout = loadouts.find(
      (loadout) => loadout.id === loadoutId,
    );

    if (!currentLoadout) {
      return;
    }

    const newPreferredState = !currentLoadout.isPreferred;

    const response = await fetch(
      `http://localhost:3000/api/user/loadouts/${loadoutId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPreferred: newPreferredState,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ?? "No se pudo actualizar el loadout preferido.",
      );
    }

    setLoadouts((currentLoadouts) =>
      currentLoadouts.map((loadout) => {
        if (
          loadout.character?.id !== currentLoadout.character?.id
        ) {
          return loadout;
        }

        return {
          ...loadout,
          isPreferred:
            newPreferredState &&
            loadout.id === loadoutId,
        };
      }),
    );
  } catch (error) {
    console.error(
      "Error al actualizar loadout preferido:",
      error,
    );
  }
}

  async function handleDeleteCharacter(
    characterId: number,
    transferLoadoutsToCharacterId?: number,
  ) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/characters/${characterId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            transferLoadoutsToCharacterId !== undefined
              ? { transferLoadoutsToCharacterId }
              : {},
          ),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
          "No se pudo eliminar el personaje.",
        );
      }

      const [
        userCharactersResponse,
        loadoutsResponse,
      ] = await Promise.all([
        fetch("http://localhost:3000/api/user/characters"),
        fetch("http://localhost:3000/api/user/loadouts"),
      ]);

      if (
        !userCharactersResponse.ok ||
        !loadoutsResponse.ok
      ) {
        throw new Error(
          "El personaje se eliminó, pero no se pudieron actualizar los datos.",
        );
      }

      const userCharactersData =
        await userCharactersResponse.json();

      const loadoutsData =
        await loadoutsResponse.json();

      const updatedCharacters =
        userCharactersData.characters ??
        userCharactersData;

      const updatedLoadouts =
        loadoutsData.loadouts ??
        loadoutsData;

      // Personaje que acabamos de eliminar.
      const deletedCharacter =
        userCharacters.find(
          (character) => character.id === characterId,
        );

      if (!deletedCharacter) {
        return;
      }

      // Instancias que quedan del mismo personaje.
      const remainingInstances =
        updatedCharacters.filter(
          (character: ApiUserCharacter) =>
            character.definitionKey ===
            deletedCharacter.definitionKey,
        );

      // Actualizamos los datos primero.
      setUserCharacters(updatedCharacters);
      setLoadouts(updatedLoadouts);

      if (remainingInstances.length === 0) {
        // No queda ninguna instancia.
        // El modal sigue abierto, pero ya no hay PJ seleccionado.
        setSelectedCharacterId(null);
        setSelectedLoadoutId(null);

        return;
      }

      // Preferido primero; si no hay preferido, primero.
      const nextCharacter =
        remainingInstances.find(
          (character: ApiUserCharacter) =>
            character.isPreferred,
        ) ??
        remainingInstances[0];

      setSelectedCharacterId(nextCharacter.id);

      // Buscar el loadout preferido del nuevo personaje.
      const nextCharacterLoadouts =
        updatedLoadouts.filter(
          (loadout: ApiUserLoadout) =>
            loadout.character?.id ===
            nextCharacter.id,
        );

      const nextLoadout =
        nextCharacterLoadouts.find(
          (loadout: ApiUserLoadout) =>
            loadout.isPreferred,
        ) ??
        nextCharacterLoadouts[0];

      setSelectedLoadoutId(
        nextLoadout?.id ?? null,
      );

      // IMPORTANTE:
      // No hacemos:
      // setSelectedCharacterKey(null)
      //
      // porque queremos mantener el modal abierto.
    } catch (error) {
      console.error(
        "Error al eliminar personaje:",
        error,
      );
    }
  }

  async function handleDeleteLoadout(loadoutId: number) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/loadouts/${loadoutId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "No se pudo eliminar el loadout.",
        );
      }

      const updatedLoadouts = loadouts.filter(
        (loadout) => loadout.id !== loadoutId,
      );

      setLoadouts(updatedLoadouts);

      // Si el loadout eliminado era el seleccionado,
      // mantenemos el personaje en contexto.
      if (selectedLoadoutId === loadoutId) {
        const remainingLoadouts = updatedLoadouts.filter(
          (loadout) =>
            loadout.character?.id === selectedCharacterId,
        );

        const nextLoadout =
          remainingLoadouts.find(
            (loadout) => loadout.isPreferred,
          ) ?? remainingLoadouts[0];

        setSelectedLoadoutId(
          nextLoadout?.id ?? null,
        );
      }
    } catch (error) {
      console.error(
        "Error al eliminar loadout:",
        error,
      );
    }
  }

    async function handleUpdateCharacter(
    characterId: number,
    data: {
      level: number;
      constellation: number;
      friendship: number;
      ascension: number;
      normalAttackLevel: number;
      elementalSkillLevel: number;
      elementalBurstLevel: number;
    },
  ) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/characters/${characterId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
          "No se pudo actualizar el personaje.",
        );
      }

      const userCharactersResponse = await fetch(
        "http://localhost:3000/api/user/characters",
      );

      if (!userCharactersResponse.ok) {
        throw new Error(
          "El personaje se actualizó, pero no se pudieron refrescar los datos.",
        );
      }

      const userCharactersData =
        await userCharactersResponse.json();

      const updatedCharacters =
        userCharactersData.characters ??
        userCharactersData;

      setUserCharacters(updatedCharacters);
    } catch (error) {
      console.error(
        "Error al actualizar personaje:",
        error,
      );

      throw error;
    }
  }

  async function handleUpdateLoadout(
    loadoutId: number,
    data: {
      name: string;
      description: string | null;
    },
  ) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/loadouts/${loadoutId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
          "No se pudo actualizar el loadout.",
        );
      }

      const loadoutsResponse = await fetch(
        "http://localhost:3000/api/user/loadouts",
      );

      if (!loadoutsResponse.ok) {
        throw new Error(
          "El loadout se actualizó, pero no se pudieron refrescar los datos.",
        );
      }

      const loadoutsData =
        await loadoutsResponse.json();

      const updatedLoadouts =
        loadoutsData.loadouts ??
        loadoutsData;

      setLoadouts(updatedLoadouts);
    } catch (error) {
      console.error(
        "Error al actualizar loadout:",
        error,
      );

      throw error;
    }
  }

  return (
    <div className="min-h-screen px-8 py-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
          Personajes
        </p>

        <h2 className="mt-1 text-3xl font-bold tracking-tight text-emerald-950">
          Mis PJs
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-emerald-800/70">
          Administrá tus personajes y consultá el catálogo disponible.
        </p>
      </header>

      {loading && (
        <p className="mt-8 text-sm text-emerald-800/70">
          Cargando personajes...
        </p>
      )}

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">
            No se pudieron cargar los personajes.
          </p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* FILTROS */}
          <section className="mt-8 rounded-2xl border border-emerald-900/10 bg-[#fffdf5] p-5 shadow-sm">
            <div className="space-y-5">
              {/* Tengo / No tengo */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Tengo
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "owned", label: "Tengo" },
                    { key: "not-owned", label: "No tengo" },
                  ].map((option) => {
                    const selected = selectedOwnership.includes(
                      option.key,
                    );

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() =>
                          toggleFilter(
                            option.key,
                            selectedOwnership,
                            setSelectedOwnership,
                          )
                        }
                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${selected
                          ? "border-emerald-700 bg-emerald-800 text-white"
                          : "border-emerald-900/10 bg-white text-emerald-900 hover:bg-emerald-50"
                          }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rareza */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Rareza
                </p>

                <div className="flex flex-wrap gap-2">
                  {["5", "4"].map((rarity) => {
                    const selected =
                      selectedRarities.includes(rarity);

                    return (
                      <button
                        key={rarity}
                        type="button"
                        onClick={() =>
                          toggleFilter(
                            rarity,
                            selectedRarities,
                            setSelectedRarities,
                          )
                        }
                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${selected
                          ? "border-emerald-700 bg-emerald-800 text-white"
                          : "border-emerald-900/10 bg-white text-emerald-900 hover:bg-emerald-50"
                          }`}
                      >
                        {"★".repeat(Number(rarity))}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Elementos */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Elemento
                </p>

                <div className="flex flex-wrap gap-2">
                  {ELEMENTS.map((element) => {
                    const selected = selectedElements.includes(element.key);

                    return (
                      <button
                        key={element.key}
                        type="button"
                        onClick={() =>
                          toggleFilter(
                            element.key,
                            selectedElements,
                            setSelectedElements,
                          )
                        }
                        title={element.name}
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${selected
                          ? "border-emerald-700 bg-emerald-800"
                          : "border-emerald-950/30 bg-emerald-950"
                          }`}
                      >
                        <img
                          src={`/images/elements/redonditos/${selected ? element.key : `${element.key}-b`
                            }.png`}
                          alt={element.name}
                          className="h-9 w-9 object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Armas */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Arma
                </p>

                <div className="flex flex-wrap gap-2">
                  {WEAPONS.map((weapon) => {
                    const selected = selectedWeapons.includes(weapon.key);

                    return (
                      <button
                        key={weapon.key}
                        type="button"
                        onClick={() =>
                          toggleFilter(
                            weapon.key,
                            selectedWeapons,
                            setSelectedWeapons,
                          )
                        }
                        title={weapon.name}
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${selected
                          ? "border-emerald-700 bg-emerald-800"
                          : "border-emerald-950/30 bg-emerald-950"
                          }`}
                      >
                        <img
                          src={`/images/elements/redonditos/${selected ? `${weapon.key}-d` : weapon.key
                            }.png`}
                          alt={weapon.name}
                          className="h-9 w-9 object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* RESULTADOS */}
          <section className="mt-8">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-lg font-bold text-emerald-950">
                  Personajes
                </h3>

                <p className="mt-1 text-sm text-emerald-800/70">
                  {filteredCharacters.length} personaje
                  {filteredCharacters.length === 1 ? "" : "s"}
                  {" "}mostrado
                  {filteredCharacters.length === 1 ? "" : "s"}.
                </p>
              </div>
            </div>

            {filteredCharacters.length === 0 ? (
              <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800/70">
                No hay personajes que coincidan con los filtros.
              </p>
            ) : (
              <div className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                {filteredCharacters.map((character) => {
                  const owned = ownedKeys.has(character.key);

                  return (
                    <button
                      key={character.key}
                      type="button"
                      onClick={() => openCharacter(character)}
                      className={`group overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#fffdf5] text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${owned ? "" : "opacity-45"
                        }`}
                    >
                      <div className="aspect-square overflow-hidden bg-emerald-950/5">
                        <img
                          src={`/images/characters/${character.key}.webp`}
                          alt={character.name}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      </div>

                      <div className="p-3">
                        <p className="truncate text-sm font-bold text-emerald-950">
                          {character.name}
                        </p>

                        <p className="mt-1 text-xs text-emerald-800/60">
                          {"★".repeat(character.rarity)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {selectedCharacterKey !== null && (
        (() => {
          const selectedCharacter = characters.find(
            (character) =>
              character.key === selectedCharacterKey,
          );

          if (!selectedCharacter) {
            return null;
          }

          const instances = userCharacters.filter(
            (userCharacter) =>
              userCharacter.definitionKey ===
              selectedCharacter.key,
          );

          return (
            <CharacterDetailModal
              character={selectedCharacter}
              userCharacters={instances}
              loadouts={loadouts}
              selectedCharacterId={selectedCharacterId}
              selectedLoadoutId={selectedLoadoutId}

              onCharacterChange={handleCharacterChange}
              onLoadoutChange={setSelectedLoadoutId}

              onClose={() => {
                setSelectedCharacterKey(null);
                setSelectedCharacterId(null);
                setSelectedLoadoutId(null);
              }}

              onSetPreferredCharacter={handleSetPreferredCharacter}
              onSetPreferredLoadout={handleSetPreferredLoadout}
              onUpdateCharacter={handleUpdateCharacter}
              onUpdateLoadout={handleUpdateLoadout}
              onCreateCharacter={() => {
                setCharacterToCreate(selectedCharacter);
                setShowCreateCharacterModal(true);
              }}

              onDeleteCharacter={handleDeleteCharacter}

              onCreateLoadout={() => {
                setCreatedCharacterId(selectedCharacterId);
                setShowCreateLoadoutModal(true);
              }}

              onDeleteLoadout={handleDeleteLoadout}
            />
          );
        })()
      )}

      {showCreateCharacterModal && characterToCreate && (
        <CreateCharacterModal
          character={characterToCreate}
          onClose={() => {
            setShowCreateCharacterModal(false);
            setCharacterToCreate(null);
          }}
          onCreated={handleCharacterCreated}
        />
      )}

      {showCreateLoadoutModal && createdCharacterId !== null && (
        <CreateLoadoutModal
          characterId={createdCharacterId ?? undefined}
          onClose={() => {
            setShowCreateLoadoutModal(false);
            setCreatedCharacterId(null);
          }}
          onCreated={async (loadoutId) => {
            const response = await fetch(
              "http://localhost:3000/api/user/loadouts",
            );

            if (!response.ok) {
              throw new Error(
                "El loadout se creó, pero no se pudieron actualizar los datos.",
              );
            }

            const data = await response.json();

            const updatedLoadouts =
              data.loadouts ?? data;

            setLoadouts(updatedLoadouts);

            // Mantener el personaje que acabamos de seleccionar
            // y mostrar el loadout recién creado.
            setSelectedLoadoutId(loadoutId);

            setShowCreateLoadoutModal(false);
            setCreatedCharacterId(null);
          }}
        />
      )}

    </div>
  );
}

export default MisPJsPage;