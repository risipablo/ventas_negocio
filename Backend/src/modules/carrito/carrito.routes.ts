import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { addCarrito, deleteCarrito, getCarritos, updateCarrito } from './carrito.controller';

const router = Router();
router.use(protect);

router.get('/', getCarritos);
router.post('/', addCarrito);
router.put('/:id', updateCarrito); 
router.delete('/:id', deleteCarrito);

export default router;