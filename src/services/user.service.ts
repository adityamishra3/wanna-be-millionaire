import { Prisma } from "../../generated/prisma/client"
import prisma from "../config/prisma"
import { SafeUser } from "../types"
import { AppError } from "../utils/errors"
import { hashPassword } from "../utils/hash"


export const createUser = async (body: Prisma.UserCreateInput): Promise<SafeUser> => {
    const hashedPassword = await hashPassword(body.password)
    if (!hashedPassword) throw new AppError("Password hashing failed", 500)

    const user = await prisma.user.create({
        data: {...body, password: hashedPassword}
    })

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }
}

export const getUsers = async (): Promise<SafeUser[]> => {
    const users = await prisma.user.findMany({
        include: { ideas: true }
    })

    return users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        ideas: user.ideas.map(idea => ({
            id: idea.id,
            title: idea.title,
            content: idea.content,
            isPublic: idea.isPublic
        }))
    }))
}