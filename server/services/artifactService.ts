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

export async function getArtifact(id: number, language: string) {
  const artifact = await prisma.artifact.findUnique({
    where: {
      id,
    },
    include: {
      subStats: true,
    },
  });

  if (!artifact) {
    return null;
  }

  const artifactSetTranslation = await prisma.translation.findFirst({
    where: {
      entityType: "artefacto",
      language,
      key: artifact.setKey,
      field: "name",
    },
  });

  const slotTranslation = await prisma.translation.findFirst({
    where: {
      entityType: "artifactSlot",
      language,
      key: artifact.slotKey,
      field: "name",
    },
  });

  const statTranslations = await prisma.translation.findMany({
    where: {
      entityType: "stat",
      language,
    },
  });

  const mainStatTranslation = statTranslations.find(
    (translation) =>
      translation.key === artifact.mainStatTypeKey &&
      translation.field === "name",
  );

  return {
    id: artifact.id,

    set: {
      key: artifact.setKey,
      name: artifactSetTranslation?.text ?? artifact.setKey,
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
}

/* =========================
   USER ARTIFACTS
   ========================= */

export async function getUserArtifacts(userId: number) {
  return prisma.artifact.findMany({
    where: {
      userId,
    },
    include: {
      subStats: true,
    },
  });
}

export async function getUserArtifact(
  id: number,
  userId: number,
) {
  return prisma.artifact.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      subStats: true,
    },
  });
}

export async function createArtifact(
  userId: number,
  data: {
    setKey: string;
    slotKey: string;
    level: number;
    mainStatTypeKey: string;
    mainStatValue: number;
    subStats?: {
      statTypeKey: string;
      value: number;
    }[];
  },
) {
  return prisma.artifact.create({
    data: {
      userId,
      setKey: data.setKey,
      slotKey: data.slotKey,
      level: data.level,
      mainStatTypeKey: data.mainStatTypeKey,
      mainStatValue: data.mainStatValue,

      subStats: data.subStats
        ? {
            create: data.subStats.map((subStat) => ({
              statTypeKey: subStat.statTypeKey,
              value: subStat.value,
            })),
          }
        : undefined,
    },
    include: {
      subStats: true,
    },
  });
}

export async function updateArtifact(
  id: number,
  userId: number,
  data: {
    setKey?: string;
    slotKey?: string;
    level?: number;
    mainStatTypeKey?: string;
    mainStatValue?: number;
    subStats?: {
      statTypeKey: string;
      value: number;
    }[];
  },
) {
  const artifact = await prisma.artifact.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!artifact) {
    return null;
  }

  return prisma.$transaction(async (transaction) => {
    if (data.subStats !== undefined) {
      await transaction.artifactSubStat.deleteMany({
        where: {
          artifactId: id,
        },
      });

      if (data.subStats.length > 0) {
        await transaction.artifactSubStat.createMany({
          data: data.subStats.map((subStat) => ({
            artifactId: id,
            statTypeKey: subStat.statTypeKey,
            value: subStat.value,
          })),
        });
      }
    }

    return transaction.artifact.update({
      where: {
        id,
      },
      data: {
        setKey: data.setKey,
        slotKey: data.slotKey,
        level: data.level,
        mainStatTypeKey: data.mainStatTypeKey,
        mainStatValue: data.mainStatValue,
      },
      include: {
        subStats: true,
      },
    });
  });
}

export async function deleteArtifact(
  id: number,
  userId: number,
) {
  const artifact = await prisma.artifact.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!artifact) {
    return null;
  }

  return prisma.artifact.delete({
    where: {
      id,
    },
    include: {
      subStats: true,
    },
  });
}