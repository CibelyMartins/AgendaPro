import { Router } from 'express';
import ServiceController from '../controllers/serviceController.js';

const router = Router();

router.get('/', ServiceController.getAll);
router.get('/:id', ServiceController.getById);
router.post('/', ServiceController.create);
router.put('/:id', ServiceController.update);
router.delete('/:id', ServiceController.remove);

export default router;
