import {z} from 'zod'
import { Role } from '../../generated/prisma/enums'

export const loginSchema = z.union([
    z.object({
        email: z.email(),
        username: z.undefined().optional(),
        password: z.string().min(6)
    }),
    z.object({
        email: z.undefined().optional(),
        username: z.string(),
        password: z.string().min(6)
    })
])


export const registerSchema = z.object({
    email: z.email(),
    username: z.string(),
    password: z.string().min(6),
    role: z.enum(Role).optional()
})