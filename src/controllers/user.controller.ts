import { ApiResponse } from "../types/apiResponse";
import { Request, Response } from "express";
import { SafeUser } from "../types";
import * as UserService from '../services/user.service'

export const createUser = async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);
  const response: ApiResponse<SafeUser> = {
    success: true,
    message: "user created successfully",
    data:user,
    module: "user.controller"
  }
  res.status(201).json(response)
}

export const getUsers = async(req: Request, res: Response) => {
  const users = await UserService.getUsers()
  const response: ApiResponse<SafeUser[]> = {
    success: true,
    message: "Users fetched successfully",
    data:users,
    module: "user.controller"
  }
  res.status(200).json(response)
}

export default {createUser, getUsers };
