const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const { validateCategoryCreate, validateCategoryUpdate } = require('../middleware/validation');

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', auth, validateCategoryCreate,categoryController.create);
router.put('/:id', auth, validateCategoryUpdate, categoryController.update);
router.delete('/:id', categoryController.remove);

module.exports = router;