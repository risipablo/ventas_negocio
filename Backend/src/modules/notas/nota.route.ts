import { Router } from 'express';
import { getNotas, addNota, updateNota, deleteNota } from './nota.controller';
import { protect } from '../../middlewares/authMiddleware';

const router = Router();
router.use(protect);

router.get('/', getNotas);
router.post('/', addNota);
router.put('/:id', updateNota);
router.delete('/:id', deleteNota);

export default router;