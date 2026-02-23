import prisma from '../config/prisma'
import { comparePassword } from '../utils/hash'
import { generateToken } from '../utils/jwt'
import { SafeUser } from '../types'
import { UnauthorizedError, NotFoundError } from '../utils/errors'

export const login = async (body: { email?: string, username?: string, password: string }): Promise<{ token: string, user: SafeUser }> => {
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