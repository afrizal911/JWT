const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const movieController = require('../controllers/movieController');
const auth = require('../middleware/auth');
const { validateMovieCreate, validateMovieUpdate } = require('../middleware/validation');

router.get('/', movieController.getAll);
router.get('/:id', movieController.getById);
router.post('/', validateMovieCreate, movieController.create);
router.put('/:id', validateMovieUpdate, movieController.update);
router.delete('/:id', auth, movieController.remove);

module.exports = router;