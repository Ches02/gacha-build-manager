import { useState } from "react";
import type { ApiCharacter } from "../types/character";
import { getAscensionFromLevel, getLevelFromAscension } from "../utils/characterLevel";

interface CreateCharacterModalProps {
  character: ApiCharacter;
  onClose: () => void;
  onCreated: (characterId: number) => void;
}

function CreateCharacterModal({
  character,
  onClose,
  onCreated,
}: CreateCharacterModalProps) {
  const [level, setLevel] = useState(1);
  const [constellation, setConstellation] = useState(0);
  const [friendship, setFriendship] = useState(1);
  const [ascension, setAscension] = useState(0);
  const [normalAttackLevel, setNormalAttackLevel] = useState(1);
  const [elementalSkillLevel, setElementalSkillLevel] = useState(1);
  const [elementalBurstLevel, setElementalBurstLevel] = useState(1);
  const [isPreferred, setIsPreferred] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/user/characters",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            definitionKey: character.key,
            level,
            constellation,
            friendship,
            ascension,
            normalAttackLevel,
            elementalSkillLevel,
            elementalBurstLevel,
            isPreferred,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "No se pudo crear el personaje.",
        );
      }

      onCreated(data.character?.id ?? data.id);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear el personaje.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[#fffaf0] p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Nuevo personaje
            </p>

            <h2 className="text-2xl font-bold text-emerald-950">
              {character.name}
            </h2>

            <p className="mt-1 text-sm text-emerald-800/70">
              {character.element} · {character.weaponType.name} · ⭐{" "}
              {character.rarity}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-xl text-emerald-900/60 hover:bg-emerald-900/10"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Nivel</span>
              <input
                type="number"
                min={1}
                max={90}
                value={level}
                onChange={(event) => {
                  const newLevel = Number(event.target.value);

                  setLevel(newLevel);
                  setAscension(getAscensionFromLevel(newLevel));
                }}
                className="rounded-lg border border-emerald-900/20 bg-white px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">
                Constelación
              </span>
              <input
                type="number"
                min={0}
                max={6}
                value={constellation}
                onChange={(event) =>
                  setConstellation(Number(event.target.value))
                }
                className="rounded-lg border border-emerald-900/20 bg-white px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">
                Amistad
              </span>
              <input
                type="number"
                min={1}
                max={10}
                value={friendship}
                onChange={(event) =>
                  setFriendship(Number(event.target.value))
                }
                className="rounded-lg border border-emerald-900/20 bg-white px-3 py-2"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">
                Ascensión
              </span>
              <input
                type="number"
                min={0}
                max={6}
                value={ascension}
                onChange={(event) => {
                  const newAscension = Number(event.target.value);
                  const maxLevel = getLevelFromAscension(newAscension);

                  let newLevel = level;

                  if (newLevel > maxLevel) {
                    newLevel = maxLevel;
                  }

                  setAscension(newAscension);
                  setLevel(newLevel);
                }}
                className="rounded-lg border border-emerald-900/20 bg-white px-3 py-2"
              />
            </label>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">
              Niveles de talentos
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-emerald-900/70">
                  Ataque normal
                </span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={normalAttackLevel}
                  onChange={(event) =>
                    setNormalAttackLevel(
                      Number(event.target.value),
                    )
                  }
                  className="rounded-lg border border-emerald-900/20 bg-white px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-emerald-900/70">
                  Habilidad elemental
                </span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={elementalSkillLevel}
                  onChange={(event) =>
                    setElementalSkillLevel(
                      Number(event.target.value),
                    )
                  }
                  className="rounded-lg border border-emerald-900/20 bg-white px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-emerald-900/70">
                  Ulti
                </span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={elementalBurstLevel}
                  onChange={(event) =>
                    setElementalBurstLevel(
                      Number(event.target.value),
                    )
                  }
                  className="rounded-lg border border-emerald-900/20 bg-white px-3 py-2"
                />
              </label>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-emerald-900/5 p-3">
            <input
              type="checkbox"
              checked={isPreferred}
              onChange={(event) =>
                setIsPreferred(event.target.checked)
              }
              className="h-4 w-4"
            />

            <div>
              <p className="text-sm font-semibold">
                Marcar como personaje preferido
              </p>
              <p className="text-xs text-emerald-900/60">
                Se utilizará como instancia principal de este personaje.
              </p>
            </div>
          </label>

          {error && (
            <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-emerald-900/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg px-4 py-2 font-semibold text-emerald-900 hover:bg-emerald-900/10 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-800 px-5 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Creando..." : "Crear personaje"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCharacterModal;