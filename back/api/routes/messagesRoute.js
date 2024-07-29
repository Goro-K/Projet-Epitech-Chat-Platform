import express from 'express';
import { deleteAllMessages } from '../controllers/messagesController.js';
import requireAuth from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth)
// router.get('/', getMessage);
router.delete('/', deleteAllMessages)

export default router;