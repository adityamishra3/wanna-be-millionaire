import {Router} from 'express'
import { login, register,logout, getMe } from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { createRateLimitMiddleware } from '../utils/limiter'
const router = Router()

const authLevelLimiter = createRateLimitMiddleware({
    windowMs: 5 * 60 * 1000,
    limit: 5,
})

router.post('/login', authLevelLimiter ,login)
router.post('/register', authLevelLimiter ,register)
router.post('/logout',authMiddleware, logout)
router.get('/me', authMiddleware, getMe)
export default router