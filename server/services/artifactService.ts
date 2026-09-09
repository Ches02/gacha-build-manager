import { prisma } from "../../src/lib/prisma.ts";

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