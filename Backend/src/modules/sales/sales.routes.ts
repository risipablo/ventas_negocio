import { Router } from 'express';
import {
  createSale,
  deleteSale,
  getSales,
  updateSale,
} from './sales.controller';
import { validateBody } from '../../middlewares/validate';
import { saleSchema, updateSaleSchema } from './sales.validators';
import { protect } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', protect, getSales);
router.post('/', protect, validateBody(saleSchema), createSale);
router.put('/:id', protect, validateBody(updateSaleSchema), updateSale);
router.delete('/:id', protect, deleteSale);

export default router;