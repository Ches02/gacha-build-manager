import { useEffect, useState } from "react";
import { getAscensionFromLevel, getLevelFromAscension } from "../utils/characterLevel";
import type { UserCharacter } from "../types/character";
import type { UserWeapon } from "../types/weapon";
import type { ArtifactLoadout } from "../types/loadout";
import type { BuildGuide } from "../types/buildGuide";

type Props = {
  characterId?: number;
  onClose: () => void;
  onCreated: (loadoutId: number) => void | Promise<void>;
};

export default function CreateLoadoutModal({
  characterId: initialCharacterId,
  onClose,
  onCreated,
}: Props) {
  const [characters, setCharacters] = useState<UserCharacter[]>([]);
  const [weapons, setWeapons] = useState<UserWeapon[]>([]);
  const [artifactLoadouts, setArtifactLoadouts] = useState<
    ArtifactLoadout[]
  >([]);
  const [buildGuides, setBuildGuides] = useState<BuildGuide[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [characterId, setCharacterId] = useState(initialCharacterId !== undefined ? String(initialCharacterId) : "");
  const [weaponId, setWeaponId] = useState("");
  const [artifactLoadoutId, setArtifactLoadoutId] = useState("");
  const [buildGuideIds, setBuildGuideIds] = useState<number[]>([]);

  const [showInHome, setShowInHome] = useState(false);

  const [targetLevel, setTargetLevel] = useState("");
  const [targetAscension, setTargetAscension] = useState("");

  const [targetNormalAttackLevel, setTargetNormalAttackLevel] =
    useState("");
  const [targetElementalSkillLevel, setTargetElementalSkillLevel] =
    useState("");
  const [targetElementalBurstLevel, setTargetElementalBurstLevel] =
    useState("");

  const [targetWeaponLevel, setTargetWeaponLevel] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoading(true);
        setError("");

        const [
          charactersResponse,
          weaponsResponse,
          artifactLoadoutsResponse,
          buildGuidesResponse,
        ] = await Promise.all([
          fetch("http://localhost:3000/api/user/characters"),
          fetch("http://localhost:3000/api/user/weapons"),
          fetch("http://localhost:3000/api/user/artifact-loadouts"),
          fetch("http://localhost:3000/api/user/build-guides"),
        ]);

        if (
          !charactersResponse.ok ||
          !weaponsResponse.ok ||
          !artifactLoadoutsResponse.ok ||
          !buildGuidesResponse.ok
        ) {
          throw new Error("No se pudieron cargar las opciones.");
        }

        const [
          charactersData,
          weaponsData,
          artifactLoadoutsData,
          buildGuidesData,
        ] = await Promise.all([
          charactersResponse.json(),
          weaponsResponse.json(),
          artifactLoadoutsResponse.json(),
          buildGuidesResponse.json(),
        ]);

        setCharacters(charactersData.characters);
        setWeapons(weaponsData.weapons);
        setArtifactLoadouts(
          artifactLoadoutsData.artifactLoadouts,
        );
        setBuildGuides(buildGuidesData.buildGuides);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar las opciones.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadOptions();
  }, []);

  const selectedCharacter = characters.find(
    (character) => character.id === Number(characterId),
  );

  const selectedWeapon = weapons.find(
    (weapon) => weapon.id === Number(weaponId),
  );

  function handleTargetLevelChange(value: string) {
    setTargetLevel(value);

    if (value === "") {
      setTargetAscension("");
      return;
    }

    const level = Number(value);
    const ascension = getAscensionFromLevel(level);

    setTargetAscension(String(ascension));
  }

  function handleTargetAscensionChange(value: string) {
    setTargetAscension(value);

    if (value === "") {
      setTargetLevel("");
      return;
    }

    const ascension = Number(value);
    const level = getLevelFromAscension(ascension);

    setTargetLevel(String(level));
  }

  function handleCharacterChange(value: string) {
    setCharacterId(value);

    // Limpiar objetivos del personaje anterior.
    setTargetLevel("");
    setTargetAscension("");
    setTargetNormalAttackLevel("");
    setTargetElementalSkillLevel("");
    setTargetElementalBurstLevel("");
  }

  function handleWeaponChange(value: string) {
    setWeaponId(value);

    // Limpiar el objetivo del arma anterior.
    setTargetWeaponLevel("");
  }

  function toggleBuildGuide(id: number) {
    setBuildGuideIds((current) =>
      current.includes(id)
        ? current.filter((guideId) => guideId !== id)
        : [...current, id],
    );
  }

async function handleSubmit(
  event: React.SubmitEvent<HTMLFormElement>,
) {
  event.preventDefault();

  if (!characterId) {
    setError("Tenés que seleccionar un personaje.");
    return;
  }

  setSaving(true);
  setError("");

  const data = {
    name: name.trim(),
    description: description.trim() || undefined,

    characterId: Number(characterId),

    weaponId: weaponId ? Number(weaponId) : null,

    artifactLoadoutId: artifactLoadoutId
      ? Number(artifactLoadoutId)
      : null,

    buildGuideIds,

    showInHome,

    targetLevel:
      targetLevel !== "" ? Number(targetLevel) : null,

    targetAscension:
      targetAscension !== ""
        ? Number(targetAscension)
        : null,

    targetNormalAttackLevel:
      targetNormalAttackLevel !== ""
        ? Number(targetNormalAttackLevel)
        : null,

    targetElementalSkillLevel:
      targetElementalSkillLevel !== ""
        ? Number(targetElementalSkillLevel)
        : null,

    targetElementalBurstLevel:
      targetElementalBurstLevel !== ""
        ? Number(targetElementalBurstLevel)
        : null,

    targetWeaponLevel:
      targetWeaponLevel !== ""
        ? Number(targetWeaponLevel)
        : null,
  };

  try {
    const response = await fetch(
      "http://localhost:3000/api/user/loadouts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      const details = Array.isArray(result.details)
        ? result.details.join("\n")
        : result.error;

      throw new Error(
        details || "No se pudo crear el loadout.",
      );
    }

    await onCreated(
      result.loadout?.id ?? result.id,
    );

    onClose();
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Error al crear el loadout.",
    );
  } finally {
    setSaving(false);
  }
}

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <p>Cargando opciones...</p>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Crear loadout</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Nombre *
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={60}
              required
            />
          </label>

          <label>
            Descripción
            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              maxLength={500}
            />
          </label>

          <label>
            Personaje *
            <select
              value={characterId}
              onChange={(event) =>
                handleCharacterChange(event.target.value)
              }
              required
            >
              <option value="">Seleccionar personaje</option>

              {characters.map((character) => (
                <option
                  key={character.id}
                  value={character.id}
                >
                  {character.definition.key} — Nivel{" "}
                  {character.level}
                </option>
              ))}
            </select>
          </label>

          {selectedCharacter && (
            <>
              {selectedCharacter.level < 90 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label>
                    Nivel objetivo del personaje
                    <input
                      type="number"
                      min={selectedCharacter.level}
                      max={90}
                      value={targetLevel}
                      onChange={(event) =>
                        handleTargetLevelChange(event.target.value)
                      }
                      placeholder={`Actual: ${selectedCharacter.level}`}
                    />
                  </label>

                  <label>
                    Ascensión objetivo
                    <select
                      value={targetAscension}
                      onChange={(event) =>
                        handleTargetAscensionChange(event.target.value)
                      }
                    >
                      <option value="">Sin objetivo</option>

                      {[0, 1, 2, 3, 4, 5, 6]
                        .filter(
                          (ascension) =>
                            ascension >= selectedCharacter.ascension,
                        )
                        .map((ascension) => (
                          <option key={ascension} value={ascension}>
                            Ascensión {ascension}
                            {" — "}
                            Nivel {getLevelFromAscension(ascension)}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
              )}

              {selectedCharacter.normalAttackLevel < 10 && (
                <label>
                  Ataque Normal objetivo
                  <input
                    type="number"
                    min={selectedCharacter.normalAttackLevel}
                    max={10}
                    value={targetNormalAttackLevel}
                    onChange={(event) =>
                      setTargetNormalAttackLevel(
                        event.target.value,
                      )
                    }
                  />
                </label>
              )}

              {selectedCharacter.elementalSkillLevel < 10 && (
                <label>
                  Habilidad Elemental objetivo
                  <input
                    type="number"
                    min={selectedCharacter.elementalSkillLevel}
                    max={10}
                    value={targetElementalSkillLevel}
                    onChange={(event) =>
                      setTargetElementalSkillLevel(
                        event.target.value,
                      )
                    }
                  />
                </label>
              )}

              {selectedCharacter.elementalBurstLevel < 10 && (
                <label>
                  Habilidad Definitiva objetivo
                  <input
                    type="number"
                    min={selectedCharacter.elementalBurstLevel}
                    max={10}
                    value={targetElementalBurstLevel}
                    onChange={(event) =>
                      setTargetElementalBurstLevel(
                        event.target.value,
                      )
                    }
                  />
                </label>
              )}
            </>
          )}

          <label>
            Arma
            <select
              value={weaponId}
              onChange={(event) =>
                handleWeaponChange(event.target.value)
              }
            >
              <option value="">Sin arma</option>

              {weapons.map((weapon) => (
                <option
                  key={weapon.id}
                  value={weapon.id}
                >
                  {weapon.definition.key} — Nivel{" "}
                  {weapon.level}
                </option>
              ))}
            </select>
          </label>

          {selectedWeapon && selectedWeapon.level < 90 && (
            <label>
              Nivel objetivo del arma
              <input
                type="number"
                min={selectedWeapon.level}
                max={90}
                value={targetWeaponLevel}
                onChange={(event) =>
                  setTargetWeaponLevel(event.target.value)
                }
              />
            </label>
          )}

          <label>
            Set de artefactos
            <select
              value={artifactLoadoutId}
              onChange={(event) =>
                setArtifactLoadoutId(event.target.value)
              }
            >
              <option value="">Sin set</option>

              {artifactLoadouts.map((artifactLoadout) => (
                <option
                  key={artifactLoadout.id}
                  value={artifactLoadout.id}
                >
                  {artifactLoadout.name}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend>Guías de build</legend>

            {buildGuides.length === 0 && (
              <p>No tenés guías creadas.</p>
            )}

            {buildGuides.map((guide) => (
              <label key={guide.id}>
                <input
                  type="checkbox"
                  checked={buildGuideIds.includes(guide.id)}
                  onChange={() =>
                    toggleBuildGuide(guide.id)
                  }
                />
                {guide.name}
              </label>
            ))}
          </fieldset>

          <label>
            <input
              type="checkbox"
              checked={showInHome}
              onChange={(event) =>
                setShowInHome(event.target.checked)
              }
            />
            Mostrar en Home
          </label>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>

            <button type="submit" disabled={saving}>
              {saving ? "Creando..." : "Crear loadout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}