import { createServer } from "node:http";
import { prisma } from "../src/lib/prisma.ts";

const server = createServer(async (_req, res) => {
  try {
    const weapons = await prisma.weaponDefinition.findMany();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(weapons));
  } catch (error) {
    console.error(error);

    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Error al consultar la base de datos" }));
  }
});

server.listen(3000, () => {
  console.log("Servidor API escuchando en http://localhost:3000");
});