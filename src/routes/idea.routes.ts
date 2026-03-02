import {Router} from "express"
import { getIdeasByUserId, createIdea, getAllIdeas, deleteIdea, getPublicIdeas, updateIdea, likeIdea, deleteLike } from "../controllers/idea.controller"
import { requireRole } from "../middlewares/role.middleware"
import { Role } from "../../generated/prisma/enums"
const router = Router()

router.get('/me', getIdeasByUserId)
router.post('/', createIdea)
router.get('/all', requireRole(Role.ADMIN) ,getAllIdeas)
router.delete('/:id',deleteIdea)
router.get('/public', getPublicIdeas)
router.patch('/:id', updateIdea)
router.post('/:id/like', likeIdea)
router.delete('/:id/like', deleteLike)
export default router