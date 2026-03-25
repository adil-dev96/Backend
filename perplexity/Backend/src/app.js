import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import chatRouter from "./routes/chats.route.js";
import morgan from 'morgan'
import cors from 'cors';
const app = express(); 

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET",'POST','DELETE','PUT']
}))


app.get('/', (req,res)=>{
    res.json({message:"server is running successfully"})
})  

app.use('/api/auth', authRouter)
app.use('/api/chat', chatRouter)
export default app;