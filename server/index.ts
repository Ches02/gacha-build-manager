import { createServer } from "node:http";
import { getWeapons, getWeapon } from "./services/weaponService.ts";
import { getCharacters, getCharacter, createCharacter, getUserCharacters, getUserCharacter, updateCharacter, deleteCharacter } from "./services/characterService.ts";
import { getArtifactSets, getArtifactSet } from "./services/artifactSetService.ts";
import { getArtifacts, getArtifact } from "./services/artifactService.ts";
import { getLoadouts, getLoadout } from "./services/loadoutService.ts";
import { getBuildGuides, getBuildGuide } from "./services/buildGuideService.ts";

const CURRENT_USER_ID = 1;

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost:3000");

    res.setHeader("Content-Type", "application/json; charset=utf-8");

    if (req.method !== "GET" && req.method !== "POST" && req.method !== "PUT" && req.method !== "DELETE") {
      res.writeHead(405);
      res.end(JSON.stringify({ error: "Método no permitido" }));
      return;
    }

    if (
  req.method === "GET" &&
  url.pathname.match(/^\/api\/user\/characters\/([^/]+)$/)
) {
  const characterId = url.pathname.match(
    /^\/api\/user\/characters\/([^/]+)$/,
  );

  if (!characterId) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "ID de character inválido" }));
    return;
  }

  const id = Number(characterId[1]);

  if (!Number.isInteger(id)) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: "ID de character inválido" }));
    return;
  }

  const character = await getUserCharacter(id, CURRENT_USER_ID);

  if (!character) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Character no encontrado" }));
    return;
  }

  res.writeHead(200);
  res.end(JSON.stringify({ character }));
  return;
}

    if (req.method === "POST" && url.pathname === "/api/user/characters") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const character = await createCharacter(CURRENT_USER_ID, data);

          if (!character) {
            res.writeHead(404);
            res.end(
              JSON.stringify({
                error: "CharacterDefinition no encontrado",
              }),
            );
            return;
          }

          res.writeHead(201);
          res.end(JSON.stringify({ character }));
        } catch {
          res.writeHead(400);
          res.end(
            JSON.stringify({
              error: "JSON inválido",
            }),
          );
        }
      });

      return;
    }

    const characterKey = url.pathname.match(/^\/api\/characters\/([^/]+)$/);

    if (characterKey) {
      const character = await getCharacter(characterKey[1], "es");

      if (!character) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Personaje no encontrado" }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({ character }));
      return;
    }

    const weaponKey = url.pathname.match(/^\/api\/weapons\/([^/]+)$/);

    if (weaponKey) {
      const weapon = await getWeapon(weaponKey[1], "es");

      if (!weapon) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Arma no encontrada" }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({ weapon }));
      return;
    }

    const artifactSetKey = url.pathname.match(/^\/api\/artifact-sets\/([^/]+)$/);

    if (artifactSetKey) {
      const artifactSet = await getArtifactSet(
        artifactSetKey[1],
        "es",
      );

      if (!artifactSet) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Set de artefactos no encontrado" }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({ artifactSet }));
      return;
    }

    const artifactId = url.pathname.match(/^\/api\/artifacts\/([^/]+)$/);

    if (artifactId) {
      const id = Number(artifactId[1]);

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "ID de artefacto inválido" }));
        return;
      }

      const artifact = await getArtifact(id, "es");

      if (!artifact) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Artefacto no encontrado" }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({ artifact }));
      return;
    }
    const loadoutId = url.pathname.match(/^\/api\/loadouts\/([^/]+)$/);

    if (loadoutId) {
      const id = Number(loadoutId[1]);

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "ID de loadout inválido" }));
        return;
      }

      const loadout = await getLoadout(id);

      if (!loadout) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Loadout no encontrado" }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({ loadout }));
      return;
    }

    const buildGuideId = url.pathname.match(/^\/api\/build-guides\/([^/]+)$/);

    if (buildGuideId) {
      const id = Number(buildGuideId[1]);

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "ID de build guide inválido" }));
        return;
      }

      const buildGuide = await getBuildGuide(id);

      if (!buildGuide) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Build guide no encontrado" }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({ buildGuide }));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/user/characters") {
      const characters = await getUserCharacters(CURRENT_USER_ID);

      res.writeHead(200);
      res.end(JSON.stringify({ characters }));
      return;
    }

    if (
      req.method === "PUT" && url.pathname.match(/^\/api\/user\/characters\/([^/]+)$/)
    ) {
      const characterId = url.pathname.match(
        /^\/api\/user\/characters\/([^/]+)$/,
      );

      if (!characterId) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "ID de character inválido" }));
        return;
      }

      const id = Number(characterId[1]);

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "ID de character inválido" }));
        return;
      }

      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          const character = await updateCharacter(id, CURRENT_USER_ID, data);

          if (!character) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Character no encontrado" }));
            return;
          }

          res.writeHead(200);
          res.end(JSON.stringify({ character }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "JSON inválido" }));
        }
      });

      return;
    }

    if (
      req.method === "DELETE" &&
      url.pathname.match(/^\/api\/user\/characters\/([^/]+)$/)
    ) {
      const characterId = url.pathname.match(
        /^\/api\/user\/characters\/([^/]+)$/,
      );

      if (!characterId) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "ID de character inválido" }));
        return;
      }

      const id = Number(characterId[1]);

      if (!Number.isInteger(id)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "ID de character inválido" }));
        return;
      }

      const character = await deleteCharacter(id, CURRENT_USER_ID);

      if (!character) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Character no encontrado" }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({ character }));
      return;
    }

    switch (url.pathname) {
      case "/api/weapons": {
        const weapons = await getWeapons("es");

        res.writeHead(200);
        res.end(JSON.stringify({ weapons }));
        return;
      }

      case "/api/characters": {
        const characters = await getCharacters("es");

        res.writeHead(200);
        res.end(JSON.stringify({ characters }));
        return;
      }

      case "/api/artifact-sets": {
        const artifactSets = await getArtifactSets("es");

        res.writeHead(200);
        res.end(JSON.stringify({ artifactSets }));
        return;
      }

      case "/api/artifacts": {
        const artifacts = await getArtifacts("es");

        res.writeHead(200);
        res.end(JSON.stringify({ artifacts }));
        return;
      }

      case "/api/loadouts": {
        const loadouts = await getLoadouts();

        res.writeHead(200);
        res.end(JSON.stringify({ loadouts }));
        return;
      }

      case "/api/build-guides": {
        const buildGuides = await getBuildGuides();

        res.writeHead(200);
        res.end(JSON.stringify({ buildGuides }));
        return;
      }

      default: {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Ruta no encontrada" }));
        return;
      }
    }
  } catch (error) {
    console.error(error);

    res.writeHead(500);
    res.end(
      JSON.stringify({
        error: "Error al consultar la base de datos",
      }),
    );
  }
});

server.listen(3000, () => {
  console.log("Servidor API escuchando en http://localhost:3000");
});