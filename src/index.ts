import express, {Request, Response} from "express"
import {ApiResponse} from "./types/apiResponse"
import userRouter from "./routes/user.routes"
import authRouter from "./routes/auth.routes"
import ideaRouter from "./routes/idea.routes"
import { authMiddleware } from "./middlewares/auth.middleware"
import cookieParser from 'cookie-parser'
import { errorMiddleware } from "./middlewares/error.middleware"
import cors from 'cors'
import helmet from 'helmet'
import logger from "./utils/logger"
import path from 'path'
import { createServer } from "http"
import { initSocket } from "./config/socket"
const app = express()
const server = createServer(app);
const io = initSocket(server)
io.on('connect', (socket) => {
    console.log("Client connected:", socket.id)
})
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials:true // allows to send the cookie 
}))
app.use(express.json())
app.use(cookieParser())

app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/idea', authMiddleware, ideaRouter)

const distPath = process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../../dist')
    : path.join(__dirname, '../dist')

app.use(express.static(distPath))
app.use(errorMiddleware)
app.get('/health', (req: Request, res: Response)=>{
    const response: ApiResponse<string> = {
        success: true,
        module: "Root",
        data: "Healthy Server",
        message: "Server is running healthy"
    }
    res.json(response)
})

// changing from app to server so that we can attach our websocket to it as well, since app is just for http request, server has both, app and socket

server.listen(PORT, ()=>{
    // console.log("Server is running on port: ", PORT)
    logger.info(`Server is running on port: ${PORT}`)
})