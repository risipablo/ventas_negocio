import { Router } from 'express';

import { protect } from '../../middlewares/authMiddleware';
import { addProveedor, bulkDeleteProveedores, deleteProveedor, getProveedores, updateProveedor } from './proveedores.controller';

const router = Router();
router.use(protect);

router.get('/', getProveedores);
router.post('/', addProveedor);
router.put('/:id', updateProveedor);
router.delete('/:id', deleteProveedor);
router.post('/bulk-delete', bulkDeleteProveedores);

export default router;