import { prisma } from "../../src/lib/prisma.ts";

/* =========================
   USER ARTIFACT LOADOUTS
   ========================= */

export async function getUserArtifactLoadouts(userId: number) {
  return prisma.artifactLoadout.findMany({
    where: { userId },
    include: {
      artifacts: {
        include: {
          artifact: {
            include: {
              subStats: true,
            },
          },
        },
      },
    },
  });
}

export async function getUserArtifactLoadout(
  id: number,
  userId: number,
) {
  return prisma.artifactLoadout.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      artifacts: {
        include: {
          artifact: {
            include: {
              subStats: true,
            },
          },
        },
      },
    },
  });
}

export async function createArtifactLoadout(
  userId: number,
  data: {
    name: string;
    description?: string;
    artifactIds?: number[];
  },
) {
  return prisma.artifactLoadout.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      artifacts: data.artifactIds
        ? {
            create: data.artifactIds.map((artifactId) => ({
              artifactId,
            })),
          }
        : undefined,
    },
    include: {
      artifacts: {
        include: {
          artifact: {
            include: {
              subStats: true,
            },
          },
        },
      },
    },
  });
}

export async function updateArtifactLoadout(
  id: number,
  userId: number,
  data: {
    name?: string;
    description?: string;
    artifactIds?: number[];
  },
) {
  const artifactLoadout = await prisma.artifactLoadout.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!artifactLoadout) return null;

  return prisma.$transaction(async (transaction) => {
    if (data.artifactIds !== undefined) {
      await transaction.artifactLoadoutItem.deleteMany({
        where: {
          artifactLoadoutId: id,
        },
      });

      if (data.artifactIds.length > 0) {
        await transaction.artifactLoadoutItem.createMany({
          data: data.artifactIds.map((artifactId) => ({
            artifactLoadoutId: id,
            artifactId,
          })),
        });
      }
    }

    return transaction.artifactLoadout.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        artifacts: {
          include: {
            artifact: {
              include: {
                subStats: true,
              },
            },
          },
        },
      },
    });
  });
}

export async function deleteArtifactLoadout(
  id: number,
  userId: number,
) {
  const artifactLoadout = await prisma.artifactLoadout.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!artifactLoadout) return null;

  return prisma.artifactLoadout.delete({
    where: { id },
    include: {
      artifacts: true,
    },
  });
}