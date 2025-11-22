import { Router } from 'express';
import { getPropFirms, createPropFirm } from '../controllers/propFirmController';

const router = Router();

router.get('/', getPropFirms);
router.post('/', createPropFirm);

export default router;
