import { Prisma } from "../../generated/prisma/client";
import prisma from "../config/prisma";
import { PublicIdeasWithOwner, SafeIdea } from "../types";
import logger from "../utils/logger";
import {
  getCachedPublicIdeas,
  invalidatePublicIdeasCache,
  setCachedPublicIdeas,
} from "../utils/redis";
import { getIO } from "../config/socket";
import { publisher } from "../config/pubsub";

export const getIdeasByUserId = async (userId: string): Promise<SafeIdea[]> => {
  const ideas = await prisma.idea.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      likes: {
        select: {
          id: true,
          userId: true,
        },
      },
    },
  });
  const safeIdeas: SafeIdea[] = ideas.map((idea) => {
    return {
      id: idea.id,
      title: idea.title,
      content: idea.content,
      isPublic: idea.isPublic,
      likeCount: idea.likes.length,
      isLikedByMe: idea.likes.some((like) => like.userId == userId),
    };
  });
  return safeIdeas;
};

export const createIdea = async (
  userId: string,
  body: Prisma.IdeaCreateInput,
): Promise<SafeIdea> => {
  const idea = await prisma.idea.create({
    data: {
      ...body,
      owner: {
        connect: { id: userId },
      },
    },
    include: { owner: true },
  });

  // deleting the cache of public ideas if the new idea is public.
  if (idea.isPublic) {
    const cacheInvalidated = await invalidatePublicIdeasCache();
    if (!cacheInvalidated)
      logger.warn("Cache invalidation failed for public ideas");

    const safeIdeaWithOwner: PublicIdeasWithOwner = {
      id: idea.id,
      title: idea.title,
      content: idea.content,
      isPublic: idea.isPublic,
      owner: {
        username: idea.owner.username,
      },
    };

    // emitting websockets event so that the idea can be added in the public vault as soon as its created.
    // const io = getIO()
    // io.emit('new_public_idea', safeIdea)

    // now since we have moved to pub sub, this will tell redis about the new event, and then redis will publish this to all of its subscriber.
    await publisher.publish("public-ideas", JSON.stringify(safeIdeaWithOwner));
  }
  const safeIdea: SafeIdea = {
    id: idea.id,
    title: idea.title,
    content: idea.content,
    isPublic: idea.isPublic,
  };
  return safeIdea;
};

export const getAllIdeas = async (): Promise<SafeIdea[]> => {
  const ideas = await prisma.idea.findMany({
    orderBy: {
      createdAt: "desc", // Optional: Show newest first
    },
  });

  const safeIdeas: SafeIdea[] = ideas.map((idea) => ({
    id: idea.id,
    title: idea.title,
    content: idea.content,
    isPublic: idea.isPublic,
  }));

  return safeIdeas;
};

export const updateIdea = async (
  ideaId: string,
  newIdea: Prisma.IdeaUpdateInput,
): Promise<SafeIdea> => {
  const idea = await prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: newIdea,
  });
  const safeIdea: SafeIdea = {
    id: idea.id,
    title: idea.title,
    content: idea.content,
    isPublic: idea.isPublic,
  };
  return safeIdea;
};

export const deleteIdea = async (ideaId: string): Promise<boolean> => {
  const deletedIdea = await prisma.idea.delete({
    where: {
      id: ideaId,
    },
  });
  const safeIdea: SafeIdea = {
    id: deletedIdea.id,
    title: deletedIdea.title,
    content: deletedIdea.content,
    isPublic: deletedIdea.isPublic,
  };
  if (deletedIdea.isPublic) {
    const cacheInvalidated = await invalidatePublicIdeasCache();
    if (!cacheInvalidated)
      logger.warn("Cache invalidation failed for public ideas");

    // emitting another event so that if deleted idea is public, it can be removed from the vault
    const io = getIO();
    io.emit("delete_public_idea", safeIdea.id);
  }
  return true;
};

export const getPublicIdeas = async (
  userId?: string,
): Promise<PublicIdeasWithOwner[]> => {
  // first we will hit the cache.
  // const cachedIdeas:PublicIdeasWithOwner[] | null = await getCachedPublicIdeas();
  // if (cachedIdeas) {
  //   if (!userId) return cachedIdeas;
  //   const likedIdeaIds = await prisma.like.findMany({
  //     where: { userId },
  //     select: {
  //       ideaId: true,
  //       userId: true
  //     },
  //   });
  //   return cachedIdeas.map((idea) => {
  //     return { 
  //       ...idea,
  //       isLikedByMe: likedIdeaIds.some(like => like.ideaId == idea.id),
  //       likeCount: idea
  //     };
  //   });
  // }

  const ideas = await prisma.idea.findMany({
    where: {
      isPublic: true,
    },
    include: {
      owner: true,
      likes: {
        select: {
          id: true, //only select the id to minimize data transfer
          userId: true,
        },
      },
    },
  });
  const publicIdeas: PublicIdeasWithOwner[] = ideas.map((idea) => ({
    id: idea.id,
    title: idea.title,
    content: idea.content,
    isPublic: idea.isPublic,
    owner: {
      username: idea.owner.username,
    },
    likeCount: idea.likes.length,
    isLikedByMe: userId
      ? idea.likes.some((like) => like.userId == userId)
      : false, // .some() is a function that specifically check if any element meets a specific condition.
  }));
  // storing ideas in cache.
  // await setCachedPublicIdeas(publicIdeas);

  return publicIdeas;
};

export const likeIdea = async (ideaId: string, userId: string) => {
  const like = await prisma.like.create({
    data: {
      ideaId: ideaId,
      userId: userId,
    },
  });
  return like;
};

export const deleteLike = async (ideaId: string, userId: string) => {
  const deletedLike = await prisma.like.delete({
    where: {
      userId_ideaId: {
        userId: userId,
        ideaId: ideaId,
      },
    },
  });
  return deletedLike;
};
