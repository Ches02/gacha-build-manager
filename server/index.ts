import { createServer } from "node:http";
import { getWeapons, getWeapon, getUserWeapons, getUserWeapon, createWeapon, updateWeapon, deleteWeapon } from "./services/weaponService.ts";
import { getCharacters, getCharacter, createCharacter, getUserCharacters, getUserCharacter, updateCharacter, deleteCharacter } from "./services/characterService.ts";
import { getArtifactSets, getArtifactSet } from "./services/artifactSetService.ts";
import { getUserArtifacts, getUserArtifact, createArtifact, updateArtifact, deleteArtifact } from "./services/artifactService.ts";
import { getUserBuildGuides, getUserBuildGuide, createBuildGuide, updateBuildGuide, deleteBuildGuide } from "./services/buildGuideService.ts";
import { getUserArtifactLoadouts, getUserArtifactLoadout, createArtifactLoadout, updateArtifactLoadout, deleteArtifactLoadout } from "./services/artifactLoadoutService.ts";
import { getUserLoadouts, getUserLoadout, createLoadout, updateLoadout, deleteLoadout } from "./services/loadoutService.ts";
import { validateCharacter, validateCharacterUpdate } from "./validators/characterValidator.ts";
import { validateWeapon, validateWeaponUpdate } from "./validators/weaponValidator.ts";
import { validateArtifact, validateArtifactUpdate } from "./validators/artifactValidator.ts";
import { validateArtifactLoadout, validateArtifactLoadoutUpdate } from "./validators/artifactLoadoutValidator.ts";
import { validateBuildGuide, validateBuildGuideUpdate } from "./validators/buildGuideValidator.ts";
import { validateLoadout, validateLoadoutUpdate } from "./validators/loadoutValidator.ts";
import { ReferenceValidationError } from "./services/serviceError.ts";
import { calculateCharacterAscensionMaterials } from "./services/calculator/ascencionMaterialCalculationService.ts";
import { calculateCharacterTalentMaterials } from "./services/calculator/talentMaterialCalculationService.ts";
import { calculateWeaponAscensionMaterials } from "./services/calculator/weaponMaterialCalculationService.ts";
import { getCharacterCards } from "./services/home/characterCardsService.ts";
import { getHomeCalendar } from "./services/home/calendarService.ts";

const CURRENT_USER_ID = 1;

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  try {
    const url = new URL(
      req.url ?? "/",
      "http://localhost:3000",
    );

    res.setHeader(
      "Content-Type",
      "application/json; charset=utf-8",
    );

    /* =========================
       CHECK ALLOWED METHODS
       ========================= */

    if (
      req.method !== "GET" &&
      req.method !== "POST" &&
      req.method !== "PUT" &&
      req.method !== "DELETE"
    ) {
      res.writeHead(405);
      res.end(
        JSON.stringify({
          error: "Método no permitido",
        }),
      );
      return;
    }

    /* =========================
       GET /api/characters/:key
       ========================= */

    const characterKey = url.pathname.match(
      /^\/api\/characters\/([^/]+)$/,
    );

    if (characterKey) {
      const character = await getCharacter(
        characterKey[1],
        "es",
      );

      if (!character) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error: "Personaje no encontrado",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { character },
          null,
          2,
        ),
      );
      return;
    }

    /* =========================
       GET /api/weapons/:key
       ========================= */

    const weaponKey = url.pathname.match(
      /^\/api\/weapons\/([^/]+)$/,
    );

    if (weaponKey) {
      const weapon = await getWeapon(
        weaponKey[1],
        "es",
      );

      if (!weapon) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error: "Arma no encontrada",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { weapon },
          null,
          2,
        ),
      );
      return;
    }

    /* =========================
       GET /api/artifact-sets/:key
       ========================= */

    const artifactSetKey = url.pathname.match(
      /^\/api\/artifact-sets\/([^/]+)$/,
    );

    if (artifactSetKey) {
      const artifactSet = await getArtifactSet(
        artifactSetKey[1],
        "es",
      );

      if (!artifactSet) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error:
              "Set de artefactos no encontrado",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { artifactSet },
          null,
          2,
        ),
      );
      return;
    }

    /* =========================
       USER ARTIFACT LOADOUTS
       ========================= */

    /* === GET /api/user/artifact-loadouts === */

    if (
      req.method === "GET" &&
      url.pathname ===
      "/api/user/artifact-loadouts"
    ) {
      const artifactLoadouts =
        await getUserArtifactLoadouts(
          CURRENT_USER_ID,
        );

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { artifactLoadouts },
          null,
          2,
        ),
      );
      return;
    }

    /* === GET /api/user/artifact-loadouts/:id === */

    if (
      req.method === "GET" &&
      url.pathname.match(
        /^\/api\/user\/artifact-loadouts\/([^/]+)$/,
      )
    ) {
      const artifactLoadoutId =
        url.pathname.match(
          /^\/api\/user\/artifact-loadouts\/([^/]+)$/,
        );

      if (!artifactLoadoutId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de artifact loadout inválido",
          }),
        );
        return;
      }

      const id = Number(
        artifactLoadoutId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de artifact loadout inválido",
          }),
        );
        return;
      }

      const artifactLoadout =
        await getUserArtifactLoadout(
          id,
          CURRENT_USER_ID,
        );

      if (!artifactLoadout) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error:
              "ArtifactLoadout no encontrado",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { artifactLoadout },
          null,
          2,
        ),
      );
      return;
    }

    /* === POST /api/user/artifact-loadouts === */

    if (
      req.method === "POST" &&
      url.pathname ===
      "/api/user/artifact-loadouts"
    ) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const errors =
            validateArtifactLoadout(data);

          if (errors.length > 0) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error: "Datos inválidos",
                  details: errors,
                },
                null,
                2,
              ),
            );
            return;
          }

          const artifactLoadout =
            await createArtifactLoadout(
              CURRENT_USER_ID,
              data,
            );

          res.writeHead(201);
          res.end(
            JSON.stringify(
              { artifactLoadout },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error: "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }

    /* === PUT /api/user/artifact-loadouts/:id === */

    if (
      req.method === "PUT" &&
      url.pathname.match(
        /^\/api\/user\/artifact-loadouts\/([^/]+)$/,
      )
    ) {
      const artifactLoadoutId =
        url.pathname.match(
          /^\/api\/user\/artifact-loadouts\/([^/]+)$/,
        );

      if (!artifactLoadoutId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de artifact loadout inválido",
          }),
        );
        return;
      }

      const id = Number(
        artifactLoadoutId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de artifact loadout inválido",
          }),
        );
        return;
      }

      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const errors =
            validateArtifactLoadoutUpdate(
              data,
            );

          if (errors.length > 0) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error: "Datos inválidos",
                  details: errors,
                },
                null,
                2,
              ),
            );
            return;
          }

          const artifactLoadout =
            await updateArtifactLoadout(
              id,
              CURRENT_USER_ID,
              data,
            );

          if (!artifactLoadout) {
            res.writeHead(404);
            res.end(
              JSON.stringify({
                error:
                  "ArtifactLoadout no encontrado",
              }),
            );
            return;
          }

          res.writeHead(200);
          res.end(
            JSON.stringify(
              { artifactLoadout },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error: "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }

    /* === DELETE /api/user/artifact-loadouts/:id === */

    if (
      req.method === "DELETE" &&
      url.pathname.match(
        /^\/api\/user\/artifact-loadouts\/([^/]+)$/,
      )
    ) {
      const artifactLoadoutId =
        url.pathname.match(
          /^\/api\/user\/artifact-loadouts\/([^/]+)$/,
        );

      if (!artifactLoadoutId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de artifact loadout inválido",
          }),
        );
        return;
      }

      const id = Number(
        artifactLoadoutId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de artifact loadout inválido",
          }),
        );
        return;
      }

      const artifactLoadout =
        await deleteArtifactLoadout(
          id,
          CURRENT_USER_ID,
        );

      if (!artifactLoadout) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error:
              "ArtifactLoadout no encontrado",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { artifactLoadout },
          null,
          2,
        ),
      );
      return;
    }

    /* =========================
       USER LOADOUTS
       ========================= */

    /* === GET /api/user/loadouts === */

    if (
      req.method === "GET" &&
      url.pathname === "/api/user/loadouts"
    ) {
      const loadouts =
        await getUserLoadouts(
          CURRENT_USER_ID,
        );

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { loadouts },
          null,
          2,
        ),
      );
      return;
    }

    /* === GET /api/user/loadouts/:id === */

    if (
      req.method === "GET" &&
      url.pathname.match(
        /^\/api\/user\/loadouts\/([^/]+)$/,
      )
    ) {
      const loadoutId =
        url.pathname.match(
          /^\/api\/user\/loadouts\/([^/]+)$/,
        );

      if (!loadoutId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error: "ID de loadout inválido",
          }),
        );
        return;
      }

      const id = Number(
        loadoutId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error: "ID de loadout inválido",
          }),
        );
        return;
      }

      const loadout =
        await getUserLoadout(
          id,
          CURRENT_USER_ID,
        );

      if (!loadout) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error: "Loadout no encontrado",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { loadout },
          null,
          2,
        ),
      );
      return;
    }

    /* === POST /api/user/loadouts === */

    if (
      req.method === "POST" &&
      url.pathname === "/api/user/loadouts"
    ) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const errors =
            validateLoadout(data);

          if (errors.length > 0) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error: "Datos inválidos",
                  details: errors,
                },
                null,
                2,
              ),
            );
            return;
          }

          const loadout =
            await createLoadout(
              CURRENT_USER_ID,
              data,
            );

          res.writeHead(201);
          res.end(
            JSON.stringify(
              { loadout },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error: "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }

    /* === PUT /api/user/loadouts/:id === */

    if (
      req.method === "PUT" &&
      url.pathname.match(
        /^\/api\/user\/loadouts\/[^/]+$/,
      )
    ) {
      const idMatch =
        url.pathname.match(
          /^\/api\/user\/loadouts\/([^/]+)$/,
        );

      if (!idMatch) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error: "ID de loadout inválido",
          }),
        );
        return;
      }

      const id = Number(
        idMatch[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error: "ID de loadout inválido",
          }),
        );
        return;
      }

      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const errors =
            validateLoadoutUpdate(data);

          if (errors.length > 0) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error: "Datos inválidos",
                  details: errors,
                },
                null,
                2,
              ),
            );
            return;
          }

          const loadout =
            await updateLoadout(
              id,
              CURRENT_USER_ID,
              data,
            );

          if (!loadout) {
            res.writeHead(404);
            res.end(
              JSON.stringify({
                error:
                  "Loadout no encontrado",
              }),
            );
            return;
          }

          res.writeHead(200);
          res.end(
            JSON.stringify(
              { loadout },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error: "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }

    /* === DELETE /api/user/loadouts/:id === */

    if (
      req.method === "DELETE" &&
      url.pathname.match(
        /^\/api\/user\/loadouts\/[^/]+$/,
      )
    ) {
      const idMatch =
        url.pathname.match(
          /^\/api\/user\/loadouts\/([^/]+)$/,
        );

      if (!idMatch) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error: "ID de loadout inválido",
          }),
        );
        return;
      }

      const id = Number(
        idMatch[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error: "ID de loadout inválido",
          }),
        );
        return;
      }

      const loadout =
        await deleteLoadout(
          id,
          CURRENT_USER_ID,
        );

      if (!loadout) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error: "Loadout no encontrado",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { loadout },
          null,
          2,
        ),
      );
      return;
    }

    /* =========================
       USER BUILD GUIDES
       ========================= */

    /* === GET /api/user/build-guides === */

    if (
      req.method === "GET" &&
      url.pathname ===
      "/api/user/build-guides"
    ) {
      const buildGuides =
        await getUserBuildGuides(
          CURRENT_USER_ID,
        );

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { buildGuides },
          null,
          2,
        ),
      );
      return;
    }

    /* === GET /api/user/build-guides/:id === */

    if (
      req.method === "GET" &&
      url.pathname.match(
        /^\/api\/user\/build-guides\/([^/]+)$/,
      )
    ) {
      const buildGuideId =
        url.pathname.match(
          /^\/api\/user\/build-guides\/([^/]+)$/,
        );

      if (!buildGuideId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de build guide inválido",
          }),
        );
        return;
      }

      const id = Number(
        buildGuideId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de build guide inválido",
          }),
        );
        return;
      }

      const buildGuide =
        await getUserBuildGuide(
          id,
          CURRENT_USER_ID,
        );

      if (!buildGuide) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error:
              "BuildGuide no encontrado",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { buildGuide },
          null,
          2,
        ),
      );
      return;
    }

    /* === POST /api/user/build-guides === */

    if (
      req.method === "POST" &&
      url.pathname ===
      "/api/user/build-guides"
    ) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const validationErrors =
            validateBuildGuide(data);

          if (
            validationErrors.length > 0
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Datos inválidos",
                  details:
                    validationErrors,
                },
                null,
                2,
              ),
            );
            return;
          }

          const buildGuide =
            await createBuildGuide(
              CURRENT_USER_ID,
              data,
            );

          res.writeHead(201);
          res.end(
            JSON.stringify(
              { buildGuide },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error: "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }

    /* === PUT /api/user/build-guides/:id === */

    if (
      req.method === "PUT" &&
      url.pathname.match(
        /^\/api\/user\/build-guides\/([^/]+)$/,
      )
    ) {
      const buildGuideId =
        url.pathname.match(
          /^\/api\/user\/build-guides\/([^/]+)$/,
        );

      if (!buildGuideId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de build guide inválido",
          }),
        );
        return;
      }

      const id = Number(
        buildGuideId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de build guide inválido",
          }),
        );
        return;
      }

      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const validationErrors =
            validateBuildGuideUpdate(
              data,
            );

          if (
            validationErrors.length > 0
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Datos inválidos",
                  details:
                    validationErrors,
                },
                null,
                2,
              ),
            );
            return;
          }

          const buildGuide =
            await updateBuildGuide(
              id,
              CURRENT_USER_ID,
              data,
            );

          if (!buildGuide) {
            res.writeHead(404);
            res.end(
              JSON.stringify({
                error:
                  "BuildGuide no encontrado",
              }),
            );
            return;
          }

          res.writeHead(200);
          res.end(
            JSON.stringify(
              { buildGuide },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error: "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }

    /* === DELETE /api/user/build-guides/:id === */

    if (
      req.method === "DELETE" &&
      url.pathname.match(
        /^\/api\/user\/build-guides\/([^/]+)$/,
      )
    ) {
      const buildGuideId =
        url.pathname.match(
          /^\/api\/user\/build-guides\/([^/]+)$/,
        );

      if (!buildGuideId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de build guide inválido",
          }),
        );
        return;
      }

      const id = Number(
        buildGuideId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de build guide inválido",
          }),
        );
        return;
      }

      const buildGuide =
        await deleteBuildGuide(
          id,
          CURRENT_USER_ID,
        );

      if (!buildGuide) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error:
              "BuildGuide no encontrado",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { buildGuide },
          null,
          2,
        ),
      );
      return;
    }

    /* =========================
       USER CHARACTERS
       ========================= */

    /* === GET /api/user/characters === */

    if (
      req.method === "GET" &&
      url.pathname ===
      "/api/user/characters"
    ) {
      const characters =
        await getUserCharacters(
          CURRENT_USER_ID,
        );

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { characters },
          null,
          2,
        ),
      );
      return;
    }

    /* === GET /api/user/characters/:id === */

    if (
      req.method === "GET" &&
      url.pathname.match(
        /^\/api\/user\/characters\/([^/]+)$/,
      )
    ) {
      const characterId =
        url.pathname.match(
          /^\/api\/user\/characters\/([^/]+)$/,
        );

      if (!characterId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de character inválido",
          }),
        );
        return;
      }

      const id = Number(
        characterId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de character inválido",
          }),
        );
        return;
      }

      const character =
        await getUserCharacter(
          id,
          CURRENT_USER_ID,
        );

      if (!character) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error:
              "Character no encontrado",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { character },
          null,
          2,
        ),
      );
      return;
    }

    /* === POST /api/user/characters === */

    if (
      req.method === "POST" &&
      url.pathname ===
      "/api/user/characters"
    ) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const errors =
            validateCharacter(data);

          if (errors.length > 0) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error: "Datos inválidos",
                  details: errors,
                },
                null,
                2,
              ),
            );
            return;
          }

          const character =
            await createCharacter(
              CURRENT_USER_ID,
              data,
            );

          if (!character) {
            res.writeHead(404);
            res.end(
              JSON.stringify({
                error:
                  "CharacterDefinition no encontrado",
              }),
            );
            return;
          }

          res.writeHead(201);
          res.end(
            JSON.stringify(
              { character },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error: "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }

    /* === PUT /api/user/characters/:id === */

    if (
      req.method === "PUT" &&
      url.pathname.match(
        /^\/api\/user\/characters\/([^/]+)$/,
      )
    ) {
      const characterId =
        url.pathname.match(
          /^\/api\/user\/characters\/([^/]+)$/,
        );

      if (!characterId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de character inválido",
          }),
        );
        return;
      }

      const id = Number(
        characterId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de character inválido",
          }),
        );
        return;
      }

      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const errors =
            validateCharacterUpdate(
              data,
            );

          if (errors.length > 0) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error: "Datos inválidos",
                  details: errors,
                },
                null,
                2,
              ),
            );
            return;
          }

          const character =
            await updateCharacter(
              id,
              CURRENT_USER_ID,
              data,
            );

          if (!character) {
            res.writeHead(404);
            res.end(
              JSON.stringify({
                error:
                  "Character no encontrado",
              }),
            );
            return;
          }

          res.writeHead(200);
          res.end(
            JSON.stringify(
              { character },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error: "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }

    /* === DELETE /api/user/characters/:id === */

    if (
      req.method === "DELETE" &&
      url.pathname.match(
        /^\/api\/user\/characters\/([^/]+)$/,
      )
    ) {
      const characterId =
        url.pathname.match(
          /^\/api\/user\/characters\/([^/]+)$/,
        );

      if (!characterId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de character inválido",
          }),
        );
        return;
      }

      const id = Number(
        characterId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de character inválido",
          }),
        );
        return;
      }

      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data =
            body.trim() !== ""
              ? JSON.parse(body)
              : {};

          let transferLoadoutsToCharacterId:
            number | undefined;

          if (
            data.transferLoadoutsToCharacterId !==
            undefined
          ) {
            if (
              typeof data.transferLoadoutsToCharacterId !==
              "number" ||
              !Number.isInteger(
                data.transferLoadoutsToCharacterId,
              )
            ) {
              res.writeHead(400);
              res.end(
                JSON.stringify({
                  error:
                    "ID de character destino inválido",
                }),
              );
              return;
            }

            transferLoadoutsToCharacterId =
              data.transferLoadoutsToCharacterId;
          }

          const character =
            await deleteCharacter(
              id,
              CURRENT_USER_ID,
              transferLoadoutsToCharacterId,
            );

          if (!character) {
            res.writeHead(404);
            res.end(
              JSON.stringify({
                error:
                  "Character no encontrado",
              }),
            );
            return;
          }

          res.writeHead(200);
          res.end(
            JSON.stringify(
              { character },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error:
                  "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }
    /* =========================
       USER WEAPONS
       ========================= */

    /* === GET /api/user/weapons === */

    if (
      req.method === "GET" &&
      url.pathname ===
      "/api/user/weapons"
    ) {
      const weapons =
        await getUserWeapons(
          CURRENT_USER_ID,
        );

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { weapons },
          null,
          2,
        ),
      );
      return;
    }

    /* === GET /api/user/weapons/:id === */

    if (
      req.method === "GET" &&
      url.pathname.match(
        /^\/api\/user\/weapons\/([^/]+)$/,
      )
    ) {
      const weaponId =
        url.pathname.match(
          /^\/api\/user\/weapons\/([^/]+)$/,
        );

      if (!weaponId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de arma inválido",
          }),
        );
        return;
      }

      const id = Number(
        weaponId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de arma inválido",
          }),
        );
        return;
      }

      const weapon =
        await getUserWeapon(
          id,
          CURRENT_USER_ID,
        );

      if (!weapon) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error:
              "Arma no encontrada",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { weapon },
          null,
          2,
        ),
      );
      return;
    }

    /* === POST /api/user/weapons === */

    if (
      req.method === "POST" &&
      url.pathname ===
      "/api/user/weapons"
    ) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const errors =
            validateWeapon(data);

          if (errors.length > 0) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error: "Datos inválidos",
                  details: errors,
                },
                null,
                2,
              ),
            );
            return;
          }

          const weapon =
            await createWeapon(
              CURRENT_USER_ID,
              data,
            );

          res.writeHead(201);
          res.end(
            JSON.stringify(
              { weapon },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error: "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }

    /* === PUT /api/user/weapons/:id === */

    if (
      req.method === "PUT" &&
      url.pathname.match(
        /^\/api\/user\/weapons\/([^/]+)$/,
      )
    ) {
      const weaponId =
        url.pathname.match(
          /^\/api\/user\/weapons\/([^/]+)$/,
        );

      if (!weaponId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de arma inválido",
          }),
        );
        return;
      }

      const id = Number(
        weaponId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de arma inválido",
          }),
        );
        return;
      }

      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const errors =
            validateWeaponUpdate(
              data,
            );

          if (errors.length > 0) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error: "Datos inválidos",
                  details: errors,
                },
                null,
                2,
              ),
            );
            return;
          }

          const weapon =
            await updateWeapon(
              id,
              CURRENT_USER_ID,
              data,
            );

          if (!weapon) {
            res.writeHead(404);
            res.end(
              JSON.stringify({
                error:
                  "Arma no encontrada",
              }),
            );
            return;
          }

          res.writeHead(200);
          res.end(
            JSON.stringify(
              { weapon },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error: "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }

    /* === DELETE /api/user/weapons/:id === */

    if (
      req.method === "DELETE" &&
      url.pathname.match(
        /^\/api\/user\/weapons\/([^/]+)$/,
      )
    ) {
      const weaponId =
        url.pathname.match(
          /^\/api\/user\/weapons\/([^/]+)$/,
        );

      if (!weaponId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de arma inválido",
          }),
        );
        return;
      }

      const id = Number(
        weaponId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de arma inválido",
          }),
        );
        return;
      }

      const weapon =
        await deleteWeapon(
          id,
          CURRENT_USER_ID,
        );

      if (!weapon) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error:
              "Arma no encontrada",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { weapon },
          null,
          2,
        ),
      );
      return;
    }

    /* =========================
       USER ARTIFACTS
       ========================= */

    /* === GET /api/user/artifacts === */

    if (
      req.method === "GET" &&
      url.pathname ===
      "/api/user/artifacts"
    ) {
      const artifacts =
        await getUserArtifacts(
          CURRENT_USER_ID,
        );

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { artifacts },
          null,
          2,
        ),
      );
      return;
    }

    /* === GET /api/user/artifacts/:id === */

    if (
      req.method === "GET" &&
      url.pathname.match(
        /^\/api\/user\/artifacts\/([^/]+)$/,
      )
    ) {
      const artifactId =
        url.pathname.match(
          /^\/api\/user\/artifacts\/([^/]+)$/,
        );

      if (!artifactId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de artefacto inválido",
          }),
        );
        return;
      }

      const id = Number(
        artifactId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de artefacto inválido",
          }),
        );
        return;
      }

      const artifact =
        await getUserArtifact(
          id,
          CURRENT_USER_ID,
        );

      if (!artifact) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error:
              "Artefacto no encontrado",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { artifact },
          null,
          2,
        ),
      );
      return;
    }

    /* === POST /api/user/artifacts === */

    if (
      req.method === "POST" &&
      url.pathname ===
      "/api/user/artifacts"
    ) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const errors =
            validateArtifact(data);

          if (errors.length > 0) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error: "Datos inválidos",
                  details: errors,
                },
                null,
                2,
              ),
            );
            return;
          }

          const artifact =
            await createArtifact(
              CURRENT_USER_ID,
              data,
            );

          res.writeHead(201);
          res.end(
            JSON.stringify(
              { artifact },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error: "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }

    /* === PUT /api/user/artifacts/:id === */

    if (
      req.method === "PUT" &&
      url.pathname.match(
        /^\/api\/user\/artifacts\/([^/]+)$/,
      )
    ) {
      const artifactId =
        url.pathname.match(
          /^\/api\/user\/artifacts\/([^/]+)$/,
        );

      if (!artifactId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de artefacto inválido",
          }),
        );
        return;
      }

      const id = Number(
        artifactId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de artefacto inválido",
          }),
        );
        return;
      }

      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const errors =
            validateArtifactUpdate(
              data,
            );

          if (errors.length > 0) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error: "Datos inválidos",
                  details: errors,
                },
                null,
                2,
              ),
            );
            return;
          }

          const artifact =
            await updateArtifact(
              id,
              CURRENT_USER_ID,
              data,
            );

          if (!artifact) {
            res.writeHead(404);
            res.end(
              JSON.stringify({
                error:
                  "Artefacto no encontrado",
              }),
            );
            return;
          }

          res.writeHead(200);
          res.end(
            JSON.stringify(
              { artifact },
              null,
              2,
            ),
          );
        } catch (error) {
          if (
            error instanceof
            ReferenceValidationError
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify(
                {
                  error:
                    "Referencia inválida",
                  details:
                    error.details,
                },
                null,
                2,
              ),
            );
            return;
          }

          res.writeHead(400);
          res.end(
            JSON.stringify(
              {
                error: "JSON inválido",
              },
              null,
              2,
            ),
          );
        }
      });

      return;
    }

    /* === DELETE /api/user/artifacts/:id === */

    if (
      req.method === "DELETE" &&
      url.pathname.match(
        /^\/api\/user\/artifacts\/([^/]+)$/,
      )
    ) {
      const artifactId =
        url.pathname.match(
          /^\/api\/user\/artifacts\/([^/]+)$/,
        );

      if (!artifactId) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de artefacto inválido",
          }),
        );
        return;
      }

      const id = Number(
        artifactId[1],
      );

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(
          JSON.stringify({
            error:
              "ID de artefacto inválido",
          }),
        );
        return;
      }

      const artifact =
        await deleteArtifact(
          id,
          CURRENT_USER_ID,
        );

      if (!artifact) {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error:
              "Artefacto no encontrado",
          }),
        );
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { artifact },
          null,
          2,
        ),
      );
      return;
    }

    /* =========================
   CALCULATOR
   ========================= */

    /* === POST /api/calculator/character/ascension === */

    if (
      req.method === "POST" &&
      url.pathname === "/api/calculator/character/ascension"
    ) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const { characterKey, currentAscension, targetAscension } = data;

          if (typeof characterKey !== "string" || characterKey.trim() === "") {
            res.statusCode = 400;
            res.end(
              JSON.stringify({
                error: "characterKey es obligatorio",
              }),
            );
            return;
          }

          const result = await calculateCharacterAscensionMaterials(
            characterKey,
            currentAscension,
            targetAscension,
          );

          res.statusCode = 200;
          res.end(JSON.stringify(result, null, 2));
        } catch (error) {
          res.statusCode = 400;

          res.end(
            JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : "Error al calcular materiales",
            }),
          );
        }
      });

      return;
    }
    /* === POST /api/calculator/character/talents === */
    if (
      req.method === "POST" &&
      url.pathname === "/api/calculator/character/talents"
    ) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const { characterKey, selections } = data;

          if (
            typeof characterKey !== "string" ||
            characterKey.trim() === ""
          ) {
            res.statusCode = 400;
            res.end(
              JSON.stringify({
                error: "characterKey es obligatorio",
              }),
            );
            return;
          }

          if (
            selections === null ||
            typeof selections !== "object" ||
            Array.isArray(selections)
          ) {
            res.statusCode = 400;
            res.end(
              JSON.stringify({
                error: "selections debe ser un objeto",
              }),
            );
            return;
          }

          const result = await calculateCharacterTalentMaterials(
            characterKey,
            selections,
          );

          res.statusCode = 200;
          res.end(JSON.stringify(result, null, 2));
        } catch (error) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : "Error al calcular materiales de talentos",
            }),
          );
        }
      });

      return;
    }
    /* === POST /api/calculator/weapon/ascension === */

    if (
      req.method === "POST" &&
      url.pathname === "/api/calculator/weapon/ascension"
    ) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const {
            weaponKey,
            currentAscension,
            targetAscension,
          } = data;

          if (
            typeof weaponKey !== "string" ||
            weaponKey.trim() === ""
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify({
                error: "weaponKey es obligatorio",
              }),
            );
            return;
          }

          const result =
            await calculateWeaponAscensionMaterials(
              weaponKey,
              currentAscension,
              targetAscension,
            );

          res.writeHead(200);
          res.end(
            JSON.stringify(result, null, 2),
          );
        } catch (error) {
          res.writeHead(400);
          res.end(
            JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : "Error al calcular materiales del arma",
            }),
          );
        }
      });

      return;
    }

    /* =========================
       HOME
       ========================= */

    /* === GET /api/home/character-cards === */

    if (
      req.method === "GET" &&
      url.pathname === "/api/home/character-cards"
    ) {
      const cards = await getCharacterCards(
        CURRENT_USER_ID,
        "es",
      );

      res.writeHead(200);
      res.end(
        JSON.stringify(
          { cards },
          null,
          2,
        ),
      );
      return;
    }

    /* === GET /api/home/calendar === */
    if (req.method === "GET" && url.pathname === "/api/home/calendar") {
      const calendar = await getHomeCalendar(
        CURRENT_USER_ID,
        "es",
      );

      res.writeHead(200);
      res.end(
        JSON.stringify(
          calendar,
          null,
          2,
        ),
      );
      return;
    }

    /* =========================
       GLOBAL CATALOG
       ========================= */

    switch (url.pathname) {
      /* === GET /api/weapons === */

      case "/api/weapons": {
        const rarityParam =
          url.searchParams.get("rarity");

        let rarity: number | undefined;

        if (rarityParam !== null) {
          rarity = Number(rarityParam);

          if (
            rarityParam.trim() === "" ||
            !Number.isInteger(rarity)
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify({
                error:
                  "rarity debe ser un número entero válido",
              }),
            );
            return;
          }
        }

        const weapons =
          await getWeapons("es", {
            rarity,
            weaponType:
              url.searchParams.get(
                "weaponType",
              ) ?? undefined,
          });

        res.writeHead(200);
        res.end(
          JSON.stringify(
            { weapons },
            null,
            2,
          ),
        );
        return;
      }

      /* === GET /api/characters === */

      case "/api/characters": {
        const rarityParam =
          url.searchParams.get("rarity");

        let rarity: number | undefined;

        if (rarityParam !== null) {
          rarity = Number(rarityParam);

          if (
            rarityParam.trim() === "" ||
            !Number.isInteger(rarity)
          ) {
            res.writeHead(400);
            res.end(
              JSON.stringify({
                error:
                  "rarity debe ser un número entero válido",
              }),
            );
            return;
          }
        }

        const characters =
          await getCharacters("es", {
            element:
              url.searchParams.get("element") ??
              undefined,
            rarity,
            weaponType:
              url.searchParams.get(
                "weaponType",
              ) ?? undefined,
            nation:
              url.searchParams.get("nation") ??
              undefined,
          });

        res.writeHead(200);
        res.end(
          JSON.stringify(
            { characters },
            null,
            2,
          ),
        );
        return;
      }

      /* === GET /api/artifact-sets === */

      case "/api/artifact-sets": {
        const artifactSets =
          await getArtifactSets("es");

        res.writeHead(200);
        res.end(
          JSON.stringify(
            { artifactSets },
            null,
            2,
          ),
        );
        return;
      }

      default: {
        res.writeHead(404);
        res.end(
          JSON.stringify({
            error: "Ruta no encontrada",
          }),
        );
        return;
      }
    }
  } catch (error) {
    /* =========================
       REFERENCE VALIDATION ERROR
       ========================= */

    if (
      error instanceof
      ReferenceValidationError
    ) {
      res.writeHead(400);
      res.end(
        JSON.stringify(
          {
            error: "Referencia inválida",
            details: error.details,
          },
          null,
          2,
        ),
      );
      return;
    }

    /* =========================
       GENERIC ERROR
       ========================= */

    res.writeHead(400);
    res.end(
      JSON.stringify(
        {
          error: "JSON inválido",
        },
        null,
        2,
      ),
    );

    /* =========================
   GENERIC ERROR
   ========================= */

    console.error("Error en la API:", error);

    res.writeHead(500);
    res.end(
      JSON.stringify(
        {
          error: "Error interno del servidor",
          details:
            error instanceof Error
              ? error.message
              : String(error),
        },
        null,
        2,
      ),
    );
  }
});

server.listen(3000, () => {
  console.log(
    "Servidor API escuchando en http://localhost:3000",
  );
});
