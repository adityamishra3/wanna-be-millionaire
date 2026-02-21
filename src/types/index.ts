import { Prisma } from "../../generated/prisma/client"
import { Role } from "../../generated/prisma/enums"

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


export type {SafeUser, SafeIdea,UserWithIdeas }