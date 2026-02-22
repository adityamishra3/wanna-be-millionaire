import prisma from "../config/prisma";
import { Prisma } from "../../generated/prisma/client";
import { ApiResponse } from "../types/apiResponse";
import { SafeUser, UserWithIdeas} from "../types";
import { Request, Response } from "express";
import {hashPassword} from '../utils/hash'


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { ideas: true },
    });
    const safeUsers: SafeUser[] = users.map((user:UserWithIdeas) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        ideas: user.ideas,
      };
    });
    const response: ApiResponse<SafeUser[]> = {
      success: true,
      message: "Fetches successfully",
      data: safeUsers,
      module: "User Controller",
    };
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const body: Prisma.UserCreateInput = req.body
    
    // Adding hashing to the password for better security
    const hashedPassword:string|boolean = await hashPassword(req.body.password)
    if (!hashedPassword) throw new Error("Password couldn't be hashed")
    
    body.password = hashedPassword
    const user = await prisma.user.create({data:body})
    const safeUser: SafeUser = {id: user.id, username: user.username, email: user.email, role: user.role}
    const response: ApiResponse<SafeUser> = {
      success: true,
      data: safeUser,
      module: "user.controller",
      message: "User created successfully."
    }
    res.status(201).json(response)
  } catch (error) {
    console.error(`Error in createUser user.controller : ${error}`)
     res.status(500).json({ success: false, message: "Internal server error" });
  }
}


export default { getUsers };
