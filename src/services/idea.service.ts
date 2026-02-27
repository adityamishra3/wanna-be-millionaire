import { Prisma } from "../../generated/prisma/client";
import prisma from "../config/prisma";
import { PublicIdeasWithOwner, SafeIdea } from "../types";
import logger from "../utils/logger";
import { getCachedPublicIdeas, invalidatePublicIdeasCache, setCachedPublicIdeas } from "../utils/redis";
import { getIO } from "../config/socket";
export const getIdeasByUserId = async (userId: string): Promise<SafeIdea[]> => {
  const ideas = await prisma.idea.findMany({
    where: {
      ownerId: userId,
    },
  });
  const safeIdeas: SafeIdea[] = ideas.map((idea) => {
    return {
      id: idea.id,
      title: idea.title,
      content: idea.content,
      isPublic: idea.isPublic,
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
  });

  const safeIdea: SafeIdea = {
    id: idea.id,
    title: idea.title,
    content: idea.content,
    isPublic: idea.isPublic,
  };

  // deleting the cache of public ideas if the new idea is public.
  if (safeIdea.isPublic){
    const cacheInvalidated = await invalidatePublicIdeasCache();
    if (!cacheInvalidated) logger.warn("Cache invalidation failed for public ideas");
    
    // emitting websockets event so that the idea can be added in the public vault as soon as its created.
    const io = getIO()
    io.emit('new_public_idea', safeIdea)
  }

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
  if (deletedIdea.isPublic){
    const cacheInvalidated = await invalidatePublicIdeasCache();
    if (!cacheInvalidated) logger.warn("Cache invalidation failed for public ideas");
    
    // emitting another event so that if deleted idea is public, it can be removed from the vault
    const io = getIO()
    io.emit('delete_public_idea', safeIdea.id)
    
  }
  return true;
};

export const getPublicIdeas = async (): Promise<PublicIdeasWithOwner[]> => {
  // first we will hit the cache.
  const cachedIdeas = await getCachedPublicIdeas();
  if (cachedIdeas) return cachedIdeas;

  const ideas = await prisma.idea.findMany({
    where: {
      isPublic: true,
    },
    include: {
      owner: true,
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
  }));
  // storing ideas in cache.
  await setCachedPublicIdeas(publicIdeas);

  return publicIdeas;
};
