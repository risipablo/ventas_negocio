import { Router } from 'express';
import { getGastos, addGasto, updateGasto, deleteGasto } from './gastos.controller';
import { protect } from '../../middlewares/authMiddleware';

const router = Router();
router.use(protect);

router.get('/', getGastos);
router.post('/', addGasto);
router.put('/:id', updateGasto);
router.delete('/:id', deleteGasto);

export default router;