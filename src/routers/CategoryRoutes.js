const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryControllers'); 


router.route('/')
    .post(categoryController.createCategory)
    .get(categoryController.getCategories);

router.route('/:id')
    .get(categoryController.getCategoryById)
    .put(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;
