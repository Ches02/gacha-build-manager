import { useEffect, useMemo, useState } from "react";
import type { Weapon, UserWeapon } from "../types/weapon";
import { WEAPON_TYPES, WEAPON_OBTAIN_TYPES, RARITIES } from "../constants/constants";

function getSavedFilters() {
  const saved = localStorage.getItem(
    "benito-mis-armas-filters",
  );

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

function MisArmasPage() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [userWeapons, setUserWeapons] = useState<UserWeapon[]>([]);

  const savedFilters = getSavedFilters();

  const [selectedOwnership, setSelectedOwnership] =
    useState<string[]>(
      Array.isArray(savedFilters?.ownership)
        ? savedFilters.ownership
        : ["owned"],
    );

  const [selectedRarities, setSelectedRarities] =
    useState<string[]>(
      Array.isArray(savedFilters?.rarities)
        ? savedFilters.rarities
        : [],
    );

  const [selectedWeaponTypes, setSelectedWeaponTypes] =
    useState<string[]>(
      Array.isArray(savedFilters?.weaponTypes)
        ? savedFilters.weaponTypes
        : [],
    );

  const [selectedObtainTypes, setSelectedObtainTypes] =
    useState<string[]>(
      Array.isArray(savedFilters?.obtainTypes)
        ? savedFilters.obtainTypes
        : [],
    );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(
      "benito-mis-armas-filters",
      JSON.stringify({
        ownership: selectedOwnership,
        rarities: selectedRarities,
        weaponTypes: selectedWeaponTypes,
        obtainTypes: selectedObtainTypes,
      }),
    );
  }, [
    selectedOwnership,
    selectedRarities,
    selectedWeaponTypes,
    selectedObtainTypes,
  ]);

  useEffect(() => {
    async function loadWeapons() {
      try {
        setLoading(true);
        setError(null);

        const [
          weaponsResponse,
          userWeaponsResponse,
        ] = await Promise.all([
          fetch("http://localhost:3000/api/weapons"),
          fetch("http://localhost:3000/api/user/weapons"),
        ]);

        if (!weaponsResponse.ok) {
          throw new Error(
            `Error al cargar el catálogo: ${weaponsResponse.status}`,
          );
        }

        if (!userWeaponsResponse.ok) {
          throw new Error(
            `Error al cargar tus armas: ${userWeaponsResponse.status}`,
          );
        }

        const weaponsData =
          await weaponsResponse.json();

        const userWeaponsData =
          await userWeaponsResponse.json();

        const catalog: Weapon[] =
          weaponsData.weapons ?? weaponsData;

        const owned: UserWeapon[] =
          userWeaponsData.weapons ??
          userWeaponsData;

        setWeapons(catalog);
        setUserWeapons(owned);

        if (owned.length === 0) {
          setSelectedOwnership([
            "owned",
            "not-owned",
          ]);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las armas.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadWeapons();
  }, []);

  const ownedKeys = useMemo(() => {
    return new Set(
      userWeapons.map(
        (weapon) => weapon.definitionKey,
      ),
    );
  }, [userWeapons]);

  const filteredWeapons = useMemo(() => {
    return weapons.filter((weapon) => {
      const owned = ownedKeys.has(weapon.key);

      // Tengo / No tengo
      const ownershipMatches =
        selectedOwnership.length === 0 ||
        (owned &&
          selectedOwnership.includes("owned")) ||
        (!owned &&
          selectedOwnership.includes("not-owned"));

      if (!ownershipMatches) {
        return false;
      }

      // Rareza
      const rarityMatches =
        selectedRarities.length === 0 ||
        selectedRarities.includes(
          String(weapon.rarity),
        );

      if (!rarityMatches) {
        return false;
      }

      // Tipo de arma
      const weaponTypeMatches =
        selectedWeaponTypes.length === 0 ||
        selectedWeaponTypes.includes(
          weapon.type.key,
        );

      if (!weaponTypeMatches) {
        return false;
      }

      // Obtención
      const obtainTypeMatches =
        selectedObtainTypes.length === 0 ||
        (weapon.obtainType !== null &&
          selectedObtainTypes.includes(
            weapon.obtainType,
          ));

      if (!obtainTypeMatches) {
        return false;
      }

      return true;
    });
  }, [
    weapons,
    ownedKeys,
    selectedOwnership,
    selectedRarities,
    selectedWeaponTypes,
    selectedObtainTypes,
  ]);

  function toggleFilter(
    value: string,
    selected: string[],
    setSelected: (values: string[]) => void,
  ) {
    if (selected.includes(value)) {
      setSelected(
        selected.filter(
          (item) => item !== value,
        ),
      );
      return;
    }

    setSelected([...selected, value]);
  }

  return (
    <div className="min-h-screen px-8 py-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
          Armas
        </p>

        <h2 className="mt-1 text-3xl font-bold tracking-tight text-emerald-950">
          Mis Armas
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-emerald-800/70">
          Administrá tus armas y consultá el
          catálogo disponible.
        </p>
      </header>

      {loading && (
        <p className="mt-8 text-sm text-emerald-800/70">
          Cargando armas...
        </p>
      )}

      {error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">
            No se pudieron cargar las armas.
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
                    {
                      key: "owned",
                      label: "Tengo",
                    },
                    {
                      key: "not-owned",
                      label: "No tengo",
                    },
                  ].map((option) => {
                    const selected =
                      selectedOwnership.includes(
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
                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                          selected
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
                  {RARITIES.map((rarity) => {
                    const selected =
                      selectedRarities.includes(
                        rarity,
                      );

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
                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                          selected
                            ? "border-emerald-700 bg-emerald-800 text-white"
                            : "border-emerald-900/10 bg-white text-emerald-900 hover:bg-emerald-50"
                        }`}
                      >
                        {"★".repeat(
                          Number(rarity),
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tipo de arma */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Tipo
                </p>

                <div className="flex flex-wrap gap-2">
                  {WEAPON_TYPES.map((weaponType) => {
                    const selected =
                      selectedWeaponTypes.includes(
                        weaponType.key,
                      );

                    return (
                      <button
                        key={weaponType.key}
                        type="button"
                        onClick={() =>
                          toggleFilter(
                            weaponType.key,
                            selectedWeaponTypes,
                            setSelectedWeaponTypes,
                          )
                        }
                        title={weaponType.name}
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                          selected
                            ? "border-emerald-700 bg-emerald-800"
                            : "border-emerald-950/30 bg-emerald-950"
                        }`}
                      >
                        <img
                          src={`/images/elements/redonditos/${
                            selected
                              ? `${weaponType.key}-d`
                              : weaponType.key
                          }.png`}
                          alt={weaponType.name}
                          className="h-9 w-9 object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Obtención */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                  Obtención
                </p>

                <div className="flex flex-wrap gap-2">
                  {WEAPON_OBTAIN_TYPES.map((obtainType) => {
                    const selected =
                      selectedObtainTypes.includes(
                        obtainType.key,
                      );

                    return (
                      <button
                        key={obtainType.key}
                        type="button"
                        onClick={() =>
                          toggleFilter(
                            obtainType.key,
                            selectedObtainTypes,
                            setSelectedObtainTypes,
                          )
                        }
                        className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                          selected
                            ? "border-emerald-700 bg-emerald-800 text-white"
                            : "border-emerald-900/10 bg-white text-emerald-900 hover:bg-emerald-50"
                        }`}
                      >
                        {obtainType.name}
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
                  Armas
                </h3>

                <p className="mt-1 text-sm text-emerald-800/70">
                  {filteredWeapons.length} arma
                  {filteredWeapons.length === 1
                    ? ""
                    : "s"}{" "}
                  mostrada
                  {filteredWeapons.length === 1
                    ? ""
                    : "s"}.
                </p>
              </div>
            </div>

            {filteredWeapons.length === 0 ? (
              <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800/70">
                No hay armas que coincidan con
                los filtros.
              </p>
            ) : (
              <div className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                {filteredWeapons.map((weapon) => {
                  const owned =
                    ownedKeys.has(weapon.key);

                  return (
                    <button
                      key={weapon.key}
                      type="button"
                      className={`group overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#fffdf5] text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                        owned
                          ? ""
                          : "opacity-45"
                      }`}
                    >
                      <div className="aspect-square overflow-hidden bg-emerald-950/5">
                        <img
                          src={`/images/weapon/${weapon.rarity}/${weapon.key}.webp`}
                          alt={weapon.name}
                          className="h-full w-full object-contain p-2 transition group-hover:scale-105"
                        />
                      </div>

                      <div className="p-3">
                        <p className="truncate text-sm font-bold text-emerald-950">
                          {weapon.name}
                        </p>

                        <p className="mt-1 text-xs text-emerald-800/60">
                          {"★".repeat(
                            weapon.rarity,
                          )}
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
    </div>
  );
}

export default MisArmasPage;