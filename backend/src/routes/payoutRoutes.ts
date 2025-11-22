import { Router } from 'express';
import {
  getPayouts,
  getPayoutById,
  createPayout,
  updatePayout,
  deletePayout,
} from '../controllers/payoutController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getPayouts);
router.get('/:id', getPayoutById);
router.post('/', createPayout);
router.put('/:id', updatePayout);
router.delete('/:id', deletePayout);

export default router;
