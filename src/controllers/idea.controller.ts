import { Request, Response } from "express";
import prisma from "../config/prisma";
import { SafeIdea } from "../types";
import { ApiResponse } from "../types/apiResponse";
import { Prisma } from "../../generated/prisma/client";

export const getIdeasByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const ideas = await prisma.idea.findMany({
      where: {
        ownerId: userId,
      },
    });
    const safeIdea: SafeIdea[] = ideas.map((idea) => {
      return {
        id: idea.id,
        title: idea.title,
        content: idea.content,
        isPublic: idea.isPublic,
      };
    });
    const response: ApiResponse<SafeIdea[]> = {
      success: true,
      message: "Ideas fetched successfully",
      data: safeIdea,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createIdea = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const body: Prisma.IdeaCreateInput = req.body;

    const idea = await prisma.idea.create({
        data:{
            ...body,
            owner:{
                connect: {id: userId}
            }
        }
    })
    console.log("Idea created:", idea)
    const safeIdea: SafeIdea = {
        id: idea.id,
        title: idea.title,
        content: idea.content,
        isPublic: idea.isPublic
    }
    console.log("SafeIdea:", safeIdea)
    const response: ApiResponse<SafeIdea> = {
        success: true,
        message: "Idea created successfully",
        data: safeIdea,
        module: "idea.controller"
    }
    res.status(201).json(response)
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllIdeas = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;

    const ideas = await prisma.idea.findMany({
      orderBy: {
        createdAt: 'desc', // Optional: Show newest first
      },
    });

    const safeIdeas: SafeIdea[] = ideas.map((idea) => ({
      id: idea.id,
      title: idea.title,
      content: idea.content,
      isPublic: idea.isPublic,
    }));

    const response: ApiResponse<SafeIdea[]> = {
      success: true,
      message: "Ideas retrieved successfully",
      data: safeIdeas,
      module: "idea.controller",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};