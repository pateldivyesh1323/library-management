import express from 'express';
import { protect } from '../middlewares/index.js';
import { createNew, deleteBook, getAll, getOne, likeBook, unlikeBook, updateBook } from '../controllers/bookControllers.js';

const router = express.Router();

router.route('/').get(protect, getAll);
router.route('/:id').get(protect, getOne);
router.route('/').post(protect, createNew);
router.route('/:id').put(protect, updateBook);
router.route('/:id').delete(protect, deleteBook);
router.route('/like/:id').put(protect, likeBook);
router.route('/unlike/:id').put(protect, unlikeBook);

export default router;