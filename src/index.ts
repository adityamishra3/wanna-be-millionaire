import express, {Request, Response} from "express"
import {ApiResponse} from "./types/apiResponse"
import userRouter from "./routes/user.routes"
import authRouter from "./routes/auth.routes"
import ideaRouter from "./routes/idea.routes"
import { authMiddleware } from "./middlewares/auth.middleware"
import cookieParser from 'cookie-parser'
import { errorMiddleware } from "./middlewares/error.middleware"
const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())
app.use(cookieParser())

app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/idea', authMiddleware, ideaRouter)

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

app.listen(PORT, ()=>{
    console.log("Server is running on port: ", PORT)
})