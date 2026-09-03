import { createServer } from "node:http";
import { getWeapons } from "./services/weaponService.ts";
import { getCharacters } from "./services/characterService.ts";
import { getArtifactSets } from "./services/artifactSetService.ts";
import { getArtifacts } from "./services/artifactService.ts";
import { getLoadouts } from "./services/loadoutService.ts";
import { getBuildGuides } from "./services/BuildGuideService.ts";

const server = createServer(async (_req, res) => {
  try {
    const weapons = await getWeapons("es");
    const characters = await getCharacters("es");
    const artifactSets = await getArtifactSets("es");
    const artifacts = await getArtifacts("es");
    const loadouts = await getLoadouts();
    const buildGuides = await getBuildGuides();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ weapons, characters, artifactSets, artifacts, loadouts, buildGuides }));
  } catch (error) {
    console.error(error);

    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Error al consultar la base de datos" }));
  }
});

server.listen(3000, () => {
  console.log("Servidor API escuchando en http://localhost:3000");
});