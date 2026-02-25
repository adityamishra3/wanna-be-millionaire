import { Request, Response } from 'express'
import * as AuthService from '../services/auth.service'
import { ApiResponse } from '../types/apiResponse'
import { SafeUser } from '../types'
import { loginSchema, registerSchema } from '../validations/auth.validations'
import { AppError, UnauthorizedError } from '../utils/errors'
import { blacklistToken } from '../utils/redis'

export const login = async (req: Request, res: Response) => {
    // validate the request with zod
    const result = loginSchema.safeParse(req.body)
    if (!result.success) throw new AppError(result.error.message, 400);

    const { token, user } = await AuthService.login(result.data)

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000
    })

    const response: ApiResponse<SafeUser> = {
        success: true,
        message: "User logged in successfully!",
        data: user,
        module: "auth.controller"
    }

    res.json(response)
}

export const register = async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body); // will strip any extra field
    if (!result.success) throw new AppError(result.error.message, 400);

    const {token, user} = await AuthService.register(result.data);

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, 
        maxAge: 60*60*1000
    })

    const response: ApiResponse<SafeUser> = {
        success: true,
        message: "User registerd in successfully!",
        data: user,
        module: "auth.controller"
    }

    res.status(201).json(response)
}

export const logout = async (req:Request, res:Response) => {
    if (!req.exp) throw new UnauthorizedError("Invalid token")
    await blacklistToken(req.cookies.token, req.exp)
    res.clearCookie('token')
    res.json({ success: true, message: "Logged out" })
}

export const getMe = async (req: Request, res: Response) => {
    const user = await AuthService.getMe(req.userId!)
    res.json({ success: true, data: user, message: "User fetched" })
}