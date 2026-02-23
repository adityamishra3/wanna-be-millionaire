import { Prisma } from "../../generated/prisma/client"
import { Role } from "../../generated/prisma/enums"
import {z} from 'zod'
import { loginSchema, registerSchema } from "../validations/auth.validations"
type SafeUser = {
    id : string
    username: string
    email: string
    role: Role
    ideas?: SafeIdea[]
}

type SafeIdea = {
    id : string
    title: string
    content: string
    isPublic: boolean
}

type UserWithIdeas = Prisma.UserGetPayload<{
    include: {ideas: true}
}>

type LoginBody = z.infer<typeof loginSchema>
type RegisterBody = z.infer<typeof registerSchema>
export type {SafeUser, SafeIdea,UserWithIdeas, LoginBody, RegisterBody }