import { Router } from 'express';
import { getArchivos, uploadArchivo, deleteArchivo } from './archivo.controller';
import { protect } from '../../middlewares/authMiddleware';
import { upload } from '../../middlewares/upload';

const router = Router();
router.use(protect);

router.get('/', getArchivos);
router.post('/', upload.single('archivo'), uploadArchivo); 
router.delete('/:id', deleteArchivo);

export default router;