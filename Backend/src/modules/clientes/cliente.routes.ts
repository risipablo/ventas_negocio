import { Router } from 'express';
import { getClientes, addCliente, updateCliente, deleteCliente } from './cliente.controller';
import { protect } from '../../middlewares/authMiddleware';

const router = Router();
router.use(protect);

router.get('/', getClientes);
router.post('/', addCliente);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);

export default router;