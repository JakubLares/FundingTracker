import { Router } from 'express';
import {
  exportChallenges,
  exportPayouts,
  importChallenges,
  importPayouts,
} from '../controllers/exportController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/challenges', exportChallenges);
router.get('/payouts', exportPayouts);
router.post('/challenges', importChallenges);
router.post('/payouts', importPayouts);

export default router;
