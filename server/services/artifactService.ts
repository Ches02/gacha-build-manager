import { prisma } from "../../src/lib/prisma.ts";
import { ReferenceValidationError } from "./serviceError.ts";

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
  const errors: string[] = [];

  const artifactSet = await prisma.artifactSetDefinition.findUnique({
    where: {
      key: data.setKey,
    },
  });

  if (!artifactSet) {
    errors.push(
      "setKey no corresponde a un set de artefactos existente",
    );
  }

  const artifactSlot = await prisma.artifactSlot.findUnique({
    where: {
      key: data.slotKey,
    },
  });

  if (!artifactSlot) {
    errors.push(
      "slotKey no corresponde a un slot de artefacto existente",
    );
  }

  const mainStat = await prisma.statType.findUnique({
    where: {
      key: data.mainStatTypeKey,
    },
  });

  if (!mainStat) {
    errors.push(
      "mainStatTypeKey no corresponde a un stat existente",
    );
  }

  if (data.subStats) {
    const uniqueStatKeys = [
      ...new Set(
        data.subStats.map(
          (subStat) => subStat.statTypeKey,
        ),
      ),
    ];

    const subStatDefinitions =
      await prisma.statType.findMany({
        where: {
          key: {
            in: uniqueStatKeys,
          },
        },
      });

    const existingKeys = new Set(
      subStatDefinitions.map(
        (stat) => stat.key,
      ),
    );

    data.subStats.forEach(
      (subStat, index) => {
        if (!existingKeys.has(subStat.statTypeKey)) {
          errors.push(
            `subStats[${index}].statTypeKey no corresponde a un stat existente`,
          );
        }
      },
    );
  }

  if (errors.length > 0) {
    throw new ReferenceValidationError(errors);
  }

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

  const errors: string[] = [];

  if (data.setKey !== undefined) {
    const artifactSet =
      await prisma.artifactSetDefinition.findUnique({
        where: {
          key: data.setKey,
        },
      });

    if (!artifactSet) {
      errors.push(
        "setKey no corresponde a un set de artefactos existente",
      );
    }
  }

  if (data.slotKey !== undefined) {
    const artifactSlot =
      await prisma.artifactSlot.findUnique({
        where: {
          key: data.slotKey,
        },
      });

    if (!artifactSlot) {
      errors.push(
        "slotKey no corresponde a un slot de artefacto existente",
      );
    }
  }

  if (data.mainStatTypeKey !== undefined) {
    const mainStat =
      await prisma.statType.findUnique({
        where: {
          key: data.mainStatTypeKey,
        },
      });

    if (!mainStat) {
      errors.push(
        "mainStatTypeKey no corresponde a un stat existente",
      );
    }
  }

  if (data.subStats !== undefined) {
    const uniqueStatKeys = [
      ...new Set(
        data.subStats.map(
          (subStat) => subStat.statTypeKey,
        ),
      ),
    ];

    const subStatDefinitions =
      await prisma.statType.findMany({
        where: {
          key: {
            in: uniqueStatKeys,
          },
        },
      });

    const existingKeys = new Set(
      subStatDefinitions.map(
        (stat) => stat.key,
      ),
    );

    data.subStats.forEach(
      (subStat, index) => {
        if (!existingKeys.has(subStat.statTypeKey)) {
          errors.push(
            `subStats[${index}].statTypeKey no corresponde a un stat existente`,
          );
        }
      },
    );
  }

  if (errors.length > 0) {
    throw new ReferenceValidationError(errors);
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