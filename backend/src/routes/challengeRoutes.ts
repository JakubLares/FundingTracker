import { Router } from 'express';
import {
  getChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from '../controllers/challengeController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getChallenges);
router.get('/:id', getChallengeById);
router.post('/', createChallenge);
router.put('/:id', updateChallenge);
router.delete('/:id', deleteChallenge);

export default router;
