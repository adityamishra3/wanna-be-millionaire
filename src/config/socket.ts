import {Server} from 'socket.io'
import { AppError } from '../utils/errors'

let io: Server

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors:{
            credentials: true,
            origin: process.env.CLIENT_URL || 'http://localhost:5173'
        }
    })
    return io
}

export const getIO = ():Server => {
    if (!io) throw new AppError('Socket.io not initialized', 500)
    return io;
}