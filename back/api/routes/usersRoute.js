import {Router} from 'express';

import {login, signup, getAllUser, getUser, changePassword, deleteUser} from '../controllers/usersController.js';
import requireAuth from '../../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);

router.use(requireAuth)
router.get('/', getAllUser)
router.get('/:id', getUser)
router.put('/:id/password', changePassword);
router.delete('/:id', deleteUser);

export default router;