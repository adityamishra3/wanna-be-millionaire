import prisma from '../config/prisma'
import { comparePassword, hashPassword } from '../utils/hash'
import { generateToken } from '../utils/jwt'
import { LoginBody, SafeUser, RegisterBody } from '../types'
import { UnauthorizedError, NotFoundError, AppError } from '../utils/errors'

export const login = async (body: LoginBody): Promise<{ token: string, user: SafeUser }> => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [{ email: body.email }, { username: body.username }]
        }
    })

    if (!user) throw new NotFoundError("User not found")

    const hasAccess = await comparePassword(body.password, user.password)
    if (!hasAccess) throw new UnauthorizedError("Incorrect password")

    const token = await generateToken(user.id)
    if (!token) throw new Error("Token generation failed")

    const safeUser: SafeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }

    return { token, user: safeUser }
}

export const register = async (body:RegisterBody): Promise<{token:string, user:SafeUser}> => {
    const hashedPassword = await hashPassword(body.password);
    if (!hashedPassword) throw new AppError("Password hashing failed", 500)


    const user = await prisma.user.create({
        data: {...body, password: hashedPassword}
    })

    const token = await generateToken(user.id);
    if (!token) throw new AppError("Token generation failed", 500);

    const safeUser: SafeUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username
    }
    return {token: token, user: safeUser}
}