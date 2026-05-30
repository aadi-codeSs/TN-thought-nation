"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../lib/auth";
import { prisma } from "../lib/db";

import { success, z } from "zod";

import { scrapeUrl } from "../lib/scraper";

import {
  CreateThoughtSchema,
  type DashboardFilters,
} from "../lib/validation/thought";
import { error } from "console";

async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function createThought(formData: unknown) {
  const userId = await requireAuth();

  const parsed = CreateThoughtSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      error: "Validation failed",
      details: z.treeifyError(parsed.error),
    };
  }

  let { title, description, url, type, tags } = parsed.data;

  let thumbnail: string | undefined;
  let siteName: string | undefined;

  if (url) {
    const metadata = await scrapeUrl(url);

    type = metadata.type;

    if (!title) {
      title = metadata.title;
    }

    if (!description) {
      description = metadata.description;
    }

    thumbnail = metadata.thumbnail;
    siteName = metadata.siteName;
  }

  const thought = await prisma.thought.create({
  data: {
    userId,
    title,
    description,
    url,
    type,
    thumbnail,
    siteName,
  },
});

//   await prisma.$transaction(async (tx) => {
//     const thought = await tx.thought.create({
//       data: {
//         userId,
//         title,
//         description,
//         url,
//         type,
//         thumbnail,
//         siteName,
//       },
//     });

//     for (const tagName of tags) {
//       const normalizedTag = tagName.toLowerCase().trim();

//       const tag = await tx.tag.upsert({
//         where: {
//           userId_name: {
//             userId,
//             name: normalizedTag,
//           },
//         },
//         create: {
//           userId,
//           name: normalizedTag,
//         },
//         update: {},
//       });

//       await tx.tagsOnThoughts.create({
//         data: {
//           thoughtId: thought.id,
//           tagId: tag.id,
//         },
//       });
//     }
//   });

//   revalidatePath("/dashboard");

//   return {
//     success: true,
//   };
}

  export async function toggleFavorite(thoughtId: string) {
    const userId = await requireAuth();

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_thoughtId: {
          userId,
          thoughtId: thoughtId,
        },
      },
    });

    if (favorite) {
      await prisma.favorite.delete({
        where: {
          id: favorite.id,
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          thoughtId: thoughtId,
        },
      });
    }
    revalidatePath("/dashboard");
  }

  export async function deleteThought(thoughtId: string) {
    const userId = await requireAuth();

    const deleteThought = await prisma.thought.findFirst({
      where: {
        id: thoughtId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!deleteThought) {
      throw new Error("Thought not found");
    }

    await prisma.thought.delete({
      where: {
        id: thoughtId,
      },
    });
    revalidatePath("/dashboard");
  }

  export async function getThoughts(filters: DashboardFilters) {
    const userId = await requireAuth();

    const { search, type, tag, favoritesOnly, sort = "newest" } = filters;

    return prisma.thought.findMany({
      where: {
        userId,

        ...(type && {
          type,
        }),

        ...(favoritesOnly && {
          favorites: {
            some: {
              userId,
            },
          },
        }),

        ...(tag && {
          tags: {
            some: {
              tag: {
                name: tag,
              },
            },
          },
        }),
        ...(search && {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              url: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),
      },

      include: {
        tags: {
          include: {
            tag: true,
          },
        },

        favorites: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: sort === "oldest" ? "asc" : "desc",
      },
    });
  }

