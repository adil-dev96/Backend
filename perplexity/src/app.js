import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";

const app = express(); 

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))


app.get('/', (req,res)=>{
    res.json({message:"server is running successfully"})
})  

app.use('/api/auth', authRouter)
export default app;