const express = require('express');
const router = express.Router();
const brandController = require('../controllers/BrandController'); 


router.route('/')
    .post(brandController.createBrand)
    .get(brandController.getBrands);

router.route('/:id')
    .get(brandController.getBrandById)
    .put(brandController.updateBrand)
    .delete(brandController.deleteBrand);

module.exports = router;
