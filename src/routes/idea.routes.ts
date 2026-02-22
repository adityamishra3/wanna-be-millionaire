import {Router} from "express"
import { getIdeasByUserId, createIdea, getAllIdeas } from "../controllers/idea.controller"
import { requireRole } from "../middlewares/role.middleware"
import { Role } from "../../generated/prisma/enums"
const router = Router()

router.get('/me', getIdeasByUserId)
router.post('/', createIdea)
router.get('/all', requireRole(Role.ADMIN) ,getAllIdeas)

export default router