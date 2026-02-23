import { Prisma } from "../../generated/prisma/client";
import prisma from "../config/prisma";
import { SafeIdea } from "../types";


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
    return safeIdeas
}

export const createIdea = async (userId: string, body: Prisma.IdeaCreateInput): Promise<SafeIdea> => {
    const idea = await prisma.idea.create({
        data: {
            ...body,
            owner: {
                connect: {id: userId}
            }
        }
    });
    
    const safeIdea: SafeIdea = {
      id: idea.id,
      title: idea.title,
      content: idea.content,
      isPublic: idea.isPublic,
    };
    return safeIdea;
}

export const getAllIdeas = async ():Promise<SafeIdea[]> => {
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
}