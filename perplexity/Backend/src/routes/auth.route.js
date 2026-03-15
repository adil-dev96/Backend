import { Router } from 'express'
import { authUser } from '../middleware/auth.middleware.js'
import { register, verifyEmail, loginUser, getMe} from '../controllers/auth.controller.js'
import {loginValidator, registerValidator} from '../validators/auth.validator.js'
 const authRouter = Router()

    
authRouter.post('/register', registerValidator,register)

authRouter.post("/login", loginValidator , loginUser)

authRouter.get('/get-me', authUser, getMe )

authRouter.get('/verify-email', verifyEmail)


export default authRouter