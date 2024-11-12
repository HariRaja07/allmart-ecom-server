const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartsController');


router.route('/')
    .post(cartController.addToCart)
    .get(cartController.getCart);
router.delete('/:id', cartController.removeFromCart);
module.exports = router;
