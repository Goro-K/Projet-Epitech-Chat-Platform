import express from 'express';
import { getMessagesFromChannel, deleteAllChannels } from '../controllers/channelsController.js';
import requireAuth from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth)
router.get('/:channelId/messages', getMessagesFromChannel);
router.delete('/', deleteAllChannels);

export default router;