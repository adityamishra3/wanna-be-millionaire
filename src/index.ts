import express, {Request, Response} from "express"
import {ApiResponse} from "./types/apiResponse"
import userRouter from './routes/user.routes'
const app = express()
const PORT = 3000

app.use(express.json())


app.use('/users', userRouter)

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