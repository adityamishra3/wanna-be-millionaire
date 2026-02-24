import {Router} from 'express'
import { login, register,logout, getMe } from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)
router.get('/me', authMiddleware, getMe)
export default router