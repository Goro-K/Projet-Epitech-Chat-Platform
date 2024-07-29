import express from 'express';
import {createServer, displayServers, deleteServers, displayChannels, deleteServer } from '../controllers/serversController.js';
import image from '../../middleware/multerConfig.js';
import requireAuth from '../../middleware/auth.js';

const router = express.Router();

router.use(requireAuth)
router.post('/', image, createServer); //créera un serveur
router.get('/', displayServers); //affichera tout
router.delete('/', deleteServers); //supprimera tout
router.delete('/:id', deleteServer); //supprimera un serveur
router.get('/:id/channels', displayChannels)
// router.get('/display/:name', serversController.displayServers); //affichera tout

// router.get('/display/:name', (req, res) => {
//     res.send('ok');
// });



export default router;