import { Router } from 'express';
import admin from './admin';
import survey from './survey';

const router = Router();

router.use('/admin', admin);
router.use('/survey', survey);

export default router;