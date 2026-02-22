import {Router} from "express"
import { getIdeasByUserId, createIdea } from "../controllers/idea.controller"
const router = Router()

router.get('/me', getIdeasByUserId)
router.post('/', createIdea)

export default router