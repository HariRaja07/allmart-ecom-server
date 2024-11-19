const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');


router.route('/')
    .post(dealController.createDeal) // Route to create a deal
    .get(dealController.getDeals); // Route to get all active deals for the "Top Deals" page
    

// Route to get a specific deal by ID
router.get('/:id', dealController.getDealById);

// Route to deactivate a deal
router.put('/:id/deactivate', dealController.deactivateDeal);

router.put('/:id', dealController.updateDeal);
router.delete('/:id', dealController.deleteDeal);
module.exports = router;
