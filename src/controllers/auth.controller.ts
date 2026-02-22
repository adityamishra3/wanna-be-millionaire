import { Request, Response } from "express";
import { comparePassword } from "../utils/hash";
import prisma from "../config/prisma";
import { SafeUser } from "../types";
import { ApiResponse } from "../types/apiResponse";
import { generateToken } from "../utils/jwt";

export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: body.email }, { username: body.username }],
      },
    }); //check for OR condition where we need to find user by email or username.
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // compare password and check if password is correct
    const hasAccess: boolean = await comparePassword(
      body.password,
      user.password,
    );
    if (!hasAccess) {
      res.status(401).json({ success: false, message: "Incorrect password" });
      return;
    }
    const jwtToken = await generateToken(user.id)

    res.cookie('token', jwtToken, {
        httpOnly: true,
        secure: false, //set true in prod
        maxAge: 60*60*1000 // 1 hour in milliseconds
    })

    const safeUser: SafeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const response: ApiResponse<SafeUser> = {
      success: true,
      message: "User logged in succefully!",
      data: { ...safeUser},
      module: "auth.controller",
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};
