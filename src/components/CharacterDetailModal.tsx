import { useState } from "react";
import type { Character, UserCharacter } from "../types/character";
import type { UserLoadout } from "../types/loadout";
import { getAscensionFromLevel, getLevelFromAscension } from "../utils/characterLevel";

interface CharacterDetailModalProps {
  character: Character;
  userCharacters: UserCharacter[];
  loadouts: UserLoadout[];
  selectedCharacterId: number | null;
  selectedLoadoutId: number | null;
  onCharacterChange: (characterId: number) => void;
  onLoadoutChange: (loadoutId: number) => void;
  onSetPreferredCharacter: (characterId: number) => void;
  onSetPreferredLoadout: (loadoutId: number) => void;
  onCreateCharacter: () => void;
  onDeleteCharacter: (
    characterId: number,
    transferLoadoutsToCharacterId?: number,
  ) => void | Promise<void>;
  onCreateLoadout: () => void;
  onDeleteLoadout: (loadoutId: number) => void | Promise<void>;
  onUpdateCharacter: (
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
  ) => void | Promise<void>;
  onUpdateLoadout: (
    loadoutId: number,
    data: {
      name: string;
      description: string | null;
    },
  ) => void | Promise<void>;
  onClose: () => void;
}

function CharacterDetailModal({
  character,
  userCharacters,
  loadouts,
  selectedCharacterId,
  selectedLoadoutId,
  onCharacterChange,
  onLoadoutChange,
  onSetPreferredCharacter,
  onSetPreferredLoadout,
  onCreateCharacter,
  onDeleteCharacter,
  onCreateLoadout,
  onDeleteLoadout,
  onUpdateCharacter,
  onUpdateLoadout,
  onClose,
}: CharacterDetailModalProps) {
  const characterInstances = userCharacters.filter(
    (userCharacter) =>
      userCharacter.definitionKey === character.key,
  );

  const selectedCharacter =
    characterInstances.find(
      (userCharacter) =>
        userCharacter.id === selectedCharacterId,
    ) ?? null;

  const characterLoadouts = loadouts.filter(
    (loadout) =>
      loadout.character?.id === selectedCharacterId,
  );

  const selectedLoadout =
    characterLoadouts.find(
      (loadout) =>
        loadout.id === selectedLoadoutId,
    ) ?? null;

  const [
    showDeleteCharacterConfirm,
    setShowDeleteCharacterConfirm,
  ] = useState(false);

  const [
    showTransferLoadoutsConfirm,
    setShowTransferLoadoutsConfirm,
  ] = useState(false);

  const [
    transferTargetCharacterId,
    setTransferTargetCharacterId,
  ] = useState<number | null>(null);

  const [
    showDeleteLoadoutConfirm,
    setShowDeleteLoadoutConfirm,
  ] = useState(false);

  const [isEditingCharacter, setIsEditingCharacter] =
    useState(false);

  const [isSavingCharacter, setIsSavingCharacter] =
    useState(false);

  const [characterEditValues, setCharacterEditValues] =
    useState({
      level: 0,
      constellation: 0,
      friendship: 0,
      ascension: 0,
      normalAttackLevel: 0,
      elementalSkillLevel: 0,
      elementalBurstLevel: 0,
    });

  const [isEditingLoadout, setIsEditingLoadout] =
    useState(false);

  const [isSavingLoadout, setIsSavingLoadout] =
    useState(false);

  const [loadoutEditValues, setLoadoutEditValues] =
    useState({
      name: "",
      description: "",
    });

  function handleStartEditingCharacter() {
    if (!selectedCharacter) {
      return;
    }

    setCharacterEditValues({
      level: selectedCharacter.level,
      constellation: selectedCharacter.constellation,
      friendship: selectedCharacter.friendship,
      ascension: selectedCharacter.ascension,
      normalAttackLevel:
        selectedCharacter.normalAttackLevel,
      elementalSkillLevel:
        selectedCharacter.elementalSkillLevel,
      elementalBurstLevel:
        selectedCharacter.elementalBurstLevel,
    });

    setIsEditingCharacter(true);
  }

  function handleCancelEditingCharacter() {
    setIsEditingCharacter(false);
  }

  async function handleSaveCharacter() {
    if (!selectedCharacter || isSavingCharacter) {
      return;
    }

    setIsSavingCharacter(true);

    try {
      await onUpdateCharacter(
        selectedCharacter.id,
        characterEditValues,
      );

      setIsEditingCharacter(false);
    } finally {
      setIsSavingCharacter(false);
    }
  }

  function handleStartEditingLoadout() {
    if (!selectedLoadout) {
      return;
    }

    setLoadoutEditValues({
      name: selectedLoadout.name,
      description:
        selectedLoadout.description ?? "",
    });

    setIsEditingLoadout(true);
  }

  function handleCancelEditingLoadout() {
    setIsEditingLoadout(false);
  }

  async function handleSaveLoadout() {
    if (!selectedLoadout || isSavingLoadout) {
      return;
    }

    const name =
      loadoutEditValues.name.trim();

    if (!name) {
      return;
    }

    setIsSavingLoadout(true);

    try {
      await onUpdateLoadout(
        selectedLoadout.id,
        {
          name,
          description:
            loadoutEditValues.description.trim() || null,
        },
      );

      setIsEditingLoadout(false);
    } finally {
      setIsSavingLoadout(false);
    }
  }

  function handleDeleteCharacterClick() {
    if (!selectedCharacter) {
      return;
    }

    const hasLoadouts =
      characterLoadouts.length > 0;

    if (!hasLoadouts) {
      setShowDeleteCharacterConfirm(true);
      return;
    }

    /*
     * Buscamos otras instancias del mismo personaje.
     * La instancia seleccionada no cuenta como posible destino.
     */
    const otherInstances =
      characterInstances.filter(
        (instance) =>
          instance.id !== selectedCharacter.id,
      );

    if (otherInstances.length > 0) {
      setTransferTargetCharacterId(
        otherInstances.find(
          (instance) =>
            instance.isPreferred,
        )?.id ??
        otherInstances[0].id,
      );

      setShowTransferLoadoutsConfirm(true);
      return;
    }

    /*
     * Tiene loadouts pero no existe otra instancia
     * a la que podamos transferirlos.
     */
    setShowDeleteCharacterConfirm(true);
  }

  function handleConfirmDeleteCharacter() {
    if (!selectedCharacter) {
      return;
    }

    onDeleteCharacter(
      selectedCharacter.id,
    );

    setShowDeleteCharacterConfirm(false);
    setShowTransferLoadoutsConfirm(false);
  }

  function handleConfirmTransferLoadouts() {
    if (
      !selectedCharacter ||
      transferTargetCharacterId === null
    ) {
      return;
    }

    onDeleteCharacter(
      selectedCharacter.id,
      transferTargetCharacterId,
    );

    setShowTransferLoadoutsConfirm(false);
    setTransferTargetCharacterId(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#f5f0df] p-6 text-emerald-950 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={`/images/characters/${character.key}.webp`}
              alt={character.name}
              className="h-24 w-24 rounded-xl object-cover"
            />

            <div>
              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-2xl font-bold">
                  {character.name}
                </h2>

                <span className="text-sm text-yellow-600">
                  {"★".repeat(character.rarity)}
                </span>
              </div>

              <p className="text-sm text-emerald-800">
                {character.element} ·{" "}
                {character.weaponType.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl font-bold text-emerald-900 hover:bg-emerald-900/10"
          >
            ×
          </button>
        </div>

        {selectedCharacter && (
          <>
            {/* Personaje */}
            <section className="mb-6 rounded-xl border border-emerald-900/10 bg-white/40 p-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold">
                    Personaje
                  </h3>

                  {characterInstances.length > 1 && (
                    <select
                      value={selectedCharacter.id}
                      onChange={(event) =>
                        onCharacterChange(
                          Number(event.target.value),
                        )
                      }
                      className="rounded-lg border border-emerald-900/20 bg-white px-3 py-2 text-sm outline-none"
                    >
                      {characterInstances.map(
                        (instance, index) => (
                          <option
                            key={instance.id}
                            value={instance.id}
                          >
                            {character.name} #
                            {index + 1}
                          </option>
                        ),
                      )}
                    </select>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={
                      isEditingCharacter
                        ? handleCancelEditingCharacter
                        : handleStartEditingCharacter
                    }
                    className="rounded-lg px-2 py-1 text-lg text-emerald-900 hover:bg-emerald-900/10"
                    title={
                      isEditingCharacter
                        ? "Cancelar edición"
                        : "Editar personaje"
                    }
                  >
                    {isEditingCharacter
                      ? "✕"
                      : "✎"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onSetPreferredCharacter(
                        selectedCharacter.id,
                      )
                    }
                    className={`text-xl ${selectedCharacter.isPreferred
                      ? "text-yellow-500"
                      : "text-emerald-950/30 hover:text-yellow-500"
                      }`}
                    title={
                      selectedCharacter.isPreferred
                        ? "Personaje preferido"
                        : "Marcar como preferido"
                    }
                  >
                    ★
                  </button>
                </div>
              </div>

              {characterInstances.length > 1 && (
                <p className="mb-4 text-xs text-emerald-900/50">
                  Tenés{" "}
                  {characterInstances.length}{" "}
                  instancias de este personaje.
                </p>
              )}

              {isEditingCharacter ? (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <label>
                      <span className="mb-1 block text-xs text-emerald-900/60">
                        Nivel
                      </span>

                      <input
                        type="number"
                        min={1}
                        max={90}
                        value={characterEditValues.level}
                        onChange={(event) => {
                          const level = Number(event.target.value);

                          setCharacterEditValues({
                            ...characterEditValues,
                            level,
                            ascension: getAscensionFromLevel(level),
                          });
                        }
                        }
                        className="w-full rounded-lg border border-emerald-900/20 bg-white px-3 py-2 outline-none"
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-xs text-emerald-900/60">
                        Constelación
                      </span>

                      <input
                        type="number"
                        min={0}
                        max={6}
                        value={
                          characterEditValues.constellation
                        }
                        onChange={(event) =>
                          setCharacterEditValues(
                            (current) => ({
                              ...current,
                              constellation: Number(
                                event.target.value,
                              ),
                            }),
                          )
                        }
                        className="w-full rounded-lg border border-emerald-900/20 bg-white px-3 py-2 outline-none"
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-xs text-emerald-900/60">
                        Amistad
                      </span>

                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={
                          characterEditValues.friendship
                        }
                        onChange={(event) =>
                          setCharacterEditValues(
                            (current) => ({
                              ...current,
                              friendship: Number(
                                event.target.value,
                              ),
                            }),
                          )
                        }
                        className="w-full rounded-lg border border-emerald-900/20 bg-white px-3 py-2 outline-none"
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-xs text-emerald-900/60">
                        Ascensión
                      </span>

                      <input
                        type="number"
                        min={0}
                        max={6}
                        value={
                          characterEditValues.ascension
                        }
                        onChange={(event) => {
                          const ascension = Number(event.target.value);
                          const maxLevel = getLevelFromAscension(ascension);

                          let level = characterEditValues.level;

                          if (level > maxLevel) {
                            level = maxLevel;
                          }

                          setCharacterEditValues({
                            ...characterEditValues,
                            ascension,
                            level,
                          });
                        }}
                        className="w-full rounded-lg border border-emerald-900/20 bg-white px-3 py-2 outline-none"
                      />
                    </label>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <label>
                      <span className="mb-1 block text-xs text-emerald-900/60">
                        Ataque normal
                      </span>

                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={
                          characterEditValues.normalAttackLevel
                        }
                        onChange={(event) =>
                          setCharacterEditValues(
                            (current) => ({
                              ...current,
                              normalAttackLevel:
                                Number(
                                  event.target.value,
                                ),
                            }),
                          )
                        }
                        className="w-full rounded-lg border border-emerald-900/20 bg-white px-3 py-2 outline-none"
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-xs text-emerald-900/60">
                        Habilidad elemental
                      </span>

                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={
                          characterEditValues.elementalSkillLevel
                        }
                        onChange={(event) =>
                          setCharacterEditValues(
                            (current) => ({
                              ...current,
                              elementalSkillLevel:
                                Number(
                                  event.target.value,
                                ),
                            }),
                          )
                        }
                        className="w-full rounded-lg border border-emerald-900/20 bg-white px-3 py-2 outline-none"
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-xs text-emerald-900/60">
                        Ulti
                      </span>

                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={
                          characterEditValues.elementalBurstLevel
                        }
                        onChange={(event) =>
                          setCharacterEditValues(
                            (current) => ({
                              ...current,
                              elementalBurstLevel:
                                Number(
                                  event.target.value,
                                ),
                            }),
                          )
                        }
                        className="w-full rounded-lg border border-emerald-900/20 bg-white px-3 py-2 outline-none"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={
                        handleCancelEditingCharacter
                      }
                      disabled={isSavingCharacter}
                      className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveCharacter}
                      disabled={isSavingCharacter}
                      className="rounded-lg bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSavingCharacter
                        ? "Guardando..."
                        : "Guardar"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div>
                      <span className="block text-xs text-emerald-900/60">
                        Nivel
                      </span>

                      <strong>
                        {selectedCharacter.level}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-xs text-emerald-900/60">
                        Constelación
                      </span>

                      <strong>
                        C{selectedCharacter.constellation}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-xs text-emerald-900/60">
                        Amistad
                      </span>

                      <strong>
                        {selectedCharacter.friendship}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-xs text-emerald-900/60">
                        Ascensión
                      </span>

                      <strong>
                        {selectedCharacter.ascension}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="block text-xs text-emerald-900/60">
                        Ataque normal
                      </span>

                      <strong>
                        {selectedCharacter.normalAttackLevel}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-xs text-emerald-900/60">
                        Habilidad elemental
                      </span>

                      <strong>
                        {selectedCharacter.elementalSkillLevel}
                      </strong>
                    </div>

                    <div>
                      <span className="block text-xs text-emerald-900/60">
                        Ulti
                      </span>

                      <strong>
                        {selectedCharacter.elementalBurstLevel}
                      </strong>
                    </div>
                  </div>
                </>
              )}
            </section>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onCreateCharacter}
                className="rounded-lg bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                + Crear nuevo personaje
              </button>

              <button
                type="button"
                onClick={handleDeleteCharacterClick}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                Eliminar personaje
              </button>
            </div>

            {/* Loadout */}
            <section className="rounded-xl border border-emerald-900/10 bg-white/40 p-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold">
                    Loadout
                  </h3>

                  {characterLoadouts.length > 0 && (
                    <select
                      value={selectedLoadoutId ?? ""}
                      onChange={(event) =>
                        onLoadoutChange(
                          Number(event.target.value),
                        )
                      }
                      className="max-w-xs rounded-lg border border-emerald-900/20 bg-white px-3 py-2 text-sm outline-none"
                    >
                      {characterLoadouts.map(
                        (loadout) => (
                          <option
                            key={loadout.id}
                            value={loadout.id}
                          >
                            {loadout.name}
                          </option>
                        ),
                      )}
                    </select>
                  )}
                </div>
              </div>

              {characterLoadouts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-emerald-900/20 p-6 text-center">
                  <p className="mb-3 text-sm text-emerald-900/60">
                    Este personaje no tiene ningún
                    loadout.
                  </p>

                  <button
                    type="button"
                    onClick={onCreateLoadout}
                    className="rounded-lg bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Crear loadout
                  </button>
                </div>
              ) : selectedLoadout ? (
                <div className="space-y-5">
                  {/* Acciones del loadout */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={onCreateLoadout}
                      className="rounded-lg bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                    >
                      + Crear nuevo loadout
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setShowDeleteLoadoutConfirm(
                          true,
                        )
                      }
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Eliminar loadout
                    </button>
                  </div>

                  {/* Nombre del loadout */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      {isEditingLoadout ? (
                        <div className="space-y-3">
                          <label className="block">
                            <span className="mb-1 block text-xs text-emerald-900/60">
                              Nombre
                            </span>

                            <input
                              type="text"
                              value={
                                loadoutEditValues.name
                              }
                              onChange={(event) =>
                                setLoadoutEditValues(
                                  (current) => ({
                                    ...current,
                                    name: event.target.value,
                                  }),
                                )
                              }
                              className="w-full rounded-lg border border-emerald-900/20 bg-white px-3 py-2 text-lg font-bold outline-none"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-1 block text-xs text-emerald-900/60">
                              Descripción
                            </span>

                            <textarea
                              value={
                                loadoutEditValues.description
                              }
                              onChange={(event) =>
                                setLoadoutEditValues(
                                  (current) => ({
                                    ...current,
                                    description:
                                      event.target.value,
                                  }),
                                )
                              }
                              rows={3}
                              className="w-full resize-none rounded-lg border border-emerald-900/20 bg-white px-3 py-2 text-sm outline-none"
                            />
                          </label>

                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={
                                handleCancelEditingLoadout
                              }
                              disabled={
                                isSavingLoadout
                              }
                              className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Cancelar
                            </button>

                            <button
                              type="button"
                              onClick={
                                handleSaveLoadout
                              }
                              disabled={
                                isSavingLoadout ||
                                !loadoutEditValues.name.trim()
                              }
                              className="rounded-lg bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isSavingLoadout
                                ? "Guardando..."
                                : "Guardar"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start gap-2">
                            <h4 className="text-xl font-bold">
                              {selectedLoadout.name}
                            </h4>

                            <button
                              type="button"
                              onClick={
                                handleStartEditingLoadout
                              }
                              className="rounded-lg px-2 py-1 text-lg text-emerald-900 hover:bg-emerald-900/10"
                              title="Editar loadout"
                            >
                              ✎
                            </button>
                          </div>

                          {selectedLoadout.description && (
                            <p className="mt-1 text-sm text-emerald-900/70">
                              {
                                selectedLoadout.description
                              }
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onSetPreferredLoadout(
                          selectedLoadout.id,
                        )
                      }
                      className={`text-xl ${selectedLoadout.isPreferred
                        ? "text-yellow-500"
                        : "text-emerald-950/30 hover:text-yellow-500"
                        }`}
                      title={
                        selectedLoadout.isPreferred
                          ? "Loadout preferido"
                          : "Marcar como preferido"
                      }
                    >
                      ★
                    </button>
                  </div>

                  {/* Arma */}
                  <div className="rounded-lg border border-emerald-900/10 bg-white/50 p-4">
                    <h5 className="mb-3 font-semibold">
                      Arma
                    </h5>

                    {selectedLoadout.weapon ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {
                              selectedLoadout.weapon
                                .definitionKey
                            }
                          </p>

                          <p className="text-sm text-emerald-900/60">
                            Nivel{" "}
                            {
                              selectedLoadout.weapon
                                .level
                            }{" "}
                            · R
                            {
                              selectedLoadout.weapon
                                .refinement
                            }
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-emerald-900/50">
                        Sin arma asignada.
                      </p>
                    )}
                  </div>

                  {/* Artefactos */}
                  <div className="rounded-lg border border-emerald-900/10 bg-white/50 p-4">
                    <div className="mb-3">
                      <h5 className="font-semibold">
                        Artefactos
                      </h5>

                      {selectedLoadout.artifactLoadout && (
                        <p className="text-sm text-emerald-900/60">
                          {
                            selectedLoadout
                              .artifactLoadout.name
                          }

                          {selectedLoadout
                            .artifactLoadout
                            .description
                            ? ` · ${selectedLoadout.artifactLoadout.description}`
                            : ""}
                        </p>
                      )}
                    </div>

                    {!selectedLoadout.artifactLoadout ? (
                      <p className="text-sm text-emerald-900/50">
                        Sin artefactos asignados.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedLoadout.artifactLoadout.artifacts.map(
                          (artifact) => (
                            <div
                              key={artifact.id}
                              className="rounded-lg border border-emerald-900/10 bg-[#f5f0df]/70 p-3"
                            >
                              <div className="mb-2 flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-medium">
                                    {
                                      artifact.slot
                                        .name
                                    }
                                  </p>

                                  <p className="text-xs text-emerald-900/60">
                                    {
                                      artifact.set
                                        .name
                                    }
                                  </p>
                                </div>

                                <span className="text-sm font-semibold">
                                  +{artifact.level}
                                </span>
                              </div>

                              <div className="mb-2">
                                <span className="text-xs text-emerald-900/60">
                                  Principal
                                </span>

                                <p className="text-sm font-medium">
                                  {
                                    artifact.mainStat
                                      .name
                                  }
                                  :{" "}
                                  {
                                    artifact.mainStat
                                      .value
                                  }
                                </p>
                              </div>

                              {artifact.subStats.length >
                                0 && (
                                  <div>
                                    <span className="text-xs text-emerald-900/60">
                                      Substats
                                    </span>

                                    <div className="mt-1 flex flex-wrap gap-2">
                                      {artifact.subStats.map(
                                        (subStat) => (
                                          <span
                                            key={`${artifact.id}-${subStat.key}`}
                                            className="rounded-md bg-emerald-900/10 px-2 py-1 text-xs"
                                          >
                                            {
                                              subStat.name
                                            }
                                            :{" "}
                                            {
                                              subStat.value
                                            }
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  {/* Build Guides */}
                  <div className="rounded-lg border border-emerald-900/10 bg-white/50 p-4">
                    <h5 className="mb-3 font-semibold">
                      Guías de build
                    </h5>

                    {selectedLoadout.buildGuides.length ===
                      0 ? (
                      <p className="text-sm text-emerald-900/50">
                        Sin guía de build asignada.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedLoadout.buildGuides.map(
                          (guide) => (
                            <div
                              key={guide.id}
                              className="rounded-lg bg-emerald-900/5 p-3"
                            >
                              <p className="font-medium">
                                {guide.name}
                              </p>

                              {guide.description && (
                                <p className="mt-1 text-sm text-emerald-900/60">
                                  {
                                    guide.description
                                  }
                                </p>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </section>
          </>
        )}
      </div>

      {showTransferLoadoutsConfirm &&
        selectedCharacter && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/40 p-6"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="w-full max-w-md rounded-xl bg-[#f5f0df] p-6 shadow-xl">
              <h3 className="text-lg font-bold text-emerald-950">
                Eliminar personaje
              </h3>

              <p className="mt-3 text-sm text-emerald-900">
                Este personaje tiene{" "}
                <strong>
                  {characterLoadouts.length}{" "}
                  {characterLoadouts.length === 1
                    ? "loadout asociado"
                    : "loadouts asociados"}
                </strong>
                .
              </p>

              <p className="mt-2 text-sm text-emerald-900">
                Podés transferirlos a otra instancia de{" "}
                <strong>{character.name}</strong>{" "}
                antes de eliminar este personaje.
              </p>

              <label className="mt-5 block text-sm font-semibold text-emerald-950">
                Transferir loadouts a
              </label>

              <select
                value={
                  transferTargetCharacterId ?? ""
                }
                onChange={(event) =>
                  setTransferTargetCharacterId(
                    event.target.value === ""
                      ? null
                      : Number(
                        event.target.value,
                      ),
                  )
                }
                className="mt-2 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm"
              >
                {characterInstances
                  .filter(
                    (instance) =>
                      instance.id !==
                      selectedCharacter.id,
                  )
                  .map((instance, index) => (
                    <option
                      key={instance.id}
                      value={instance.id}
                    >
                      {character.name} #
                      {index + 1}
                      {instance.isPreferred
                        ? " — Preferido"
                        : ""}
                    </option>
                  ))}
              </select>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowTransferLoadoutsConfirm(
                      false,
                    );
                    setTransferTargetCharacterId(
                      null,
                    );
                  }}
                  className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      transferTargetCharacterId !==
                      null
                    ) {
                      handleConfirmTransferLoadouts();
                    }
                  }}
                  disabled={
                    transferTargetCharacterId ===
                    null
                  }
                  className="rounded-lg bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Transferir y eliminar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowTransferLoadoutsConfirm(
                      false,
                    );
                    setShowDeleteCharacterConfirm(
                      true,
                    );
                  }}
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  Eliminar también los loadouts
                </button>
              </div>
            </div>
          </div>
        )}

      {showDeleteCharacterConfirm &&
        selectedCharacter && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/40 p-6"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="w-full max-w-md rounded-xl bg-[#f5f0df] p-6 shadow-xl">
              <h3 className="text-lg font-bold text-red-800">
                Confirmar eliminación
              </h3>

              {characterLoadouts.length > 0 ? (
                <>
                  <p className="mt-3 text-sm text-emerald-900">
                    <strong>
                      {character.name}
                    </strong>{" "}
                    tiene{" "}
                    <strong>
                      {characterLoadouts.length}{" "}
                      {characterLoadouts.length === 1
                        ? "loadout asociado"
                        : "loadouts asociados"}
                    </strong>
                    .
                  </p>

                  <p className="mt-2 text-sm font-semibold text-red-700">
                    Al eliminar el personaje también
                    se eliminarán esos loadouts.
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm text-emerald-900">
                  ¿Seguro que querés eliminar esta
                  instancia de{" "}
                  <strong>{character.name}</strong>?
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteCharacterConfirm(
                      false,
                    )
                  }
                  className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={
                    handleConfirmDeleteCharacter
                  }
                  className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

      {showDeleteLoadoutConfirm &&
        selectedLoadout && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/40 p-6"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="w-full max-w-md rounded-xl bg-[#f5f0df] p-6 shadow-xl">
              <h3 className="text-lg font-bold text-red-800">
                Eliminar loadout
              </h3>

              <p className="mt-3 text-sm text-emerald-900">
                ¿Seguro que querés eliminar el loadout{" "}
                <strong>
                  {selectedLoadout.name}
                </strong>
                ?
              </p>

              <p className="mt-2 text-sm font-semibold text-red-700">
                Esta acción no se puede deshacer.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteLoadoutConfirm(
                      false,
                    )
                  }
                  className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onDeleteLoadout(
                      selectedLoadout.id,
                    );
                    setShowDeleteLoadoutConfirm(
                      false,
                    );
                  }}
                  className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default CharacterDetailModal;