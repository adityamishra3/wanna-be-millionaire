import { Request, Response } from "express";
import { PublicIdeasWithOwner, SafeIdea } from "../types";
import { ApiResponse } from "../types/apiResponse";
import * as IdeaServices from "../services/idea.service";

export const getIdeasByUserId = async (req: Request, res: Response) => {
  const userId = req.userId as string;
  const safeIdeas: SafeIdea[] = await IdeaServices.getIdeasByUserId(userId);
  const response: ApiResponse<SafeIdea[]> = {
    success: true,
    message: "Ideas fetched successfully",
    data: safeIdeas,
  };
  res.status(200).json(response);
};

export const createIdea = async (req: Request, res: Response) => {
  const safeIdea: SafeIdea = await IdeaServices.createIdea(
    req.userId as string,
    req.body,
  );
  const response: ApiResponse<SafeIdea> = {
    success: true,
    message: "Idea created successfully",
    data: safeIdea,
    module: "idea.controller",
  };
  res.status(201).json(response);
};

export const getAllIdeas = async (req: Request, res: Response) => {
  const safeIdeas: SafeIdea[] = await IdeaServices.getAllIdeas();

  const response: ApiResponse<SafeIdea[]> = {
    success: true,
    message: "Ideas retrieved successfully",
    data: safeIdeas,
    module: "idea.controller",
  };

  res.status(200).json(response);
};

export const updateIdea = async (req:Request, res: Response) => {
  const safeIdea: SafeIdea = await IdeaServices.updateIdea(req.params.id as string, req.body)
  const response: ApiResponse<SafeIdea> = {
    success: true,
    message: "Idea created successfully",
    data: safeIdea,
    module: "idea.controller",
  };
  res.status(200).json(response);
}

export const deleteIdea = async (req:Request, res: Response) => {
  await IdeaServices.deleteIdea(req.params.id as string);
  const response: ApiResponse<string> = {
    success: true,
    message: "Idea deleted successfully",
    data: "Idea deleted Successfully",
    module: "idea.controller",
  };
  res.status(200).json(response);
}

export const getPublicIdeas = async (req: Request, res: Response) => {
  const safePublicIdeas : PublicIdeasWithOwner[] = await IdeaServices.getPublicIdeas();
  const response: ApiResponse<PublicIdeasWithOwner[]> = {
    success: true,
    message: "Ideas fetched successfully",
    data: safePublicIdeas,
    module: "idea.controller",
  };
  res.status(200).json(response);
}