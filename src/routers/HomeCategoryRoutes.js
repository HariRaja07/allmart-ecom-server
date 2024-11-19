const express = require('express');
const router = express.Router();
const homeCategoryController = require('../controllers/HomeCategoryControllers'); 


router.route('/')
    .post(homeCategoryController.createHomeCategory)
    .get(homeCategoryController.getHomeCategories);

router.route('/:id')
    .get(homeCategoryController.getHomeCategoryById)
    .put(homeCategoryController.updateHomeCategory)
    .delete(homeCategoryController.deleteHomeCategory);

module.exports = router;
