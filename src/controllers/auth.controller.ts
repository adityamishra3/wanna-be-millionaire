import { Request, Response } from 'express'
import * as AuthService from '../services/auth.service'
import { ApiResponse } from '../types/apiResponse'
import { SafeUser } from '../types'

export const login = async (req: Request, res: Response) => {
    const { token, user } = await AuthService.login(req.body)

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