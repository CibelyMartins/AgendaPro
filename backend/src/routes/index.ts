import { Router } from 'express';
import { healthCheck } from '../controllers/healthController.js';

export const router = Router();

router.get('/health', healthCheck);
