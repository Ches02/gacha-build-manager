import { prisma } from "../../src/lib/prisma.ts";

export async function getArtifacts(language: string) {
  const artifacts = await prisma.artifact.findMany({
    include: {
      subStats: true,
    },
  });

  const artifactSetTranslations = await prisma.translation.findMany({
    where: {
      entityType: "artefacto",
      language,
    },
  });

  const slotTranslations = await prisma.translation.findMany({
    where: {
      entityType: "artifactSlot",
      language,
    },
  });

  const statTranslations = await prisma.translation.findMany({
    where: {
      entityType: "stat",
      language,
    },
  });

  return artifacts.map((artifact) => {
  const setTranslation = artifactSetTranslations.find(
    (translation) =>
      translation.key === artifact.setKey &&
      translation.field === "name",
  );

  const slotTranslation = slotTranslations.find(
    (translation) =>
      translation.key === artifact.slotKey &&
      translation.field === "name",
  );

  const mainStatTranslation = statTranslations.find(
    (translation) =>
      translation.key === artifact.mainStatTypeKey &&
      translation.field === "name",
  );

  return {
    id: artifact.id,

    set: {
      key: artifact.setKey,
      name: setTranslation?.text ?? artifact.setKey,
    },

    slot: {
      key: artifact.slotKey,
      name: slotTranslation?.text ?? artifact.slotKey,
    },

    mainStat: {
      key: artifact.mainStatTypeKey,
      name: mainStatTranslation?.text ?? artifact.mainStatTypeKey,
      value: artifact.mainStatValue,
    },

    subStats: artifact.subStats.map((subStat) => {
      const subStatTranslation = statTranslations.find(
        (translation) =>
          translation.key === subStat.statTypeKey &&
          translation.field === "name",
      );

      return {
        key: subStat.statTypeKey,
        name: subStatTranslation?.text ?? subStat.statTypeKey,
        value: subStat.value,
      };
    }),

    level: artifact.level,
  };
});
}