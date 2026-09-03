import { prisma } from "../../src/lib/prisma.ts";

export async function getArtifactSets(language: string) {
  const artifactSets = await prisma.artifactSetDefinition.findMany();

  const translations = await prisma.translation.findMany({
    where: {
      entityType: "artefacto",
      language,
    },
  });

  return artifactSets.map((artifactSet) => {
    const nameTranslation = translations.find(
      (translation) =>
        translation.key === artifactSet.key &&
        translation.field === "name",
    );

    const twoPiecesTranslation = translations.find(
      (translation) =>
        translation.key === artifactSet.key &&
        translation.field === "two_pieces",
    );

    const fourPiecesTranslation = translations.find(
      (translation) =>
        translation.key === artifactSet.key &&
        translation.field === "four_pieces",
    );

    return {
      key: artifactSet.key,

      name: nameTranslation?.text ?? artifactSet.key,

      twoPiecesEffect: twoPiecesTranslation?.text ?? "",

      fourPiecesEffect: fourPiecesTranslation?.text ?? "",
    };
  });
}