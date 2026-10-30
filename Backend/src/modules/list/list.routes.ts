import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware";
import { AddList, deleteList, getList, updateList } from "./list.controller";

const router = Router()

router.get('/', protect, getList)
router.post('/', protect, AddList)
router.delete('/:id', protect, deleteList)
router.put('/:id', protect, updateList)

export default router