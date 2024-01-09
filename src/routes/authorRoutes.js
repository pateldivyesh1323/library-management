import express from 'express'
import { registerAuthor, loginAuthor, getAllAuthors, updateAuthor, deleteAuthor, getOneAuthor, getCurrentAuthor } from '../controllers/authorControllers.js';
import { protect } from '../middlewares/index.js'

const router = express.Router();

router.route('/login').post(loginAuthor);
router.route('/').post(registerAuthor);
router.route('/').get(protect, getAllAuthors);
router.route('/me').get(protect, getCurrentAuthor);
router.route('/:id').get(protect, getOneAuthor);
router.route('/').put(protect, updateAuthor);
router.route('/').delete(protect, deleteAuthor);

export default router;