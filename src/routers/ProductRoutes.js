const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductControllers');


router.route('/')
    .post(productController.createProduct)
    .get(productController.getProducts);

    router.get('/category/:categoryName', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
module.exports = router;
