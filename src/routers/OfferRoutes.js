const express = require('express');
const router = express.Router();
const offerController = require('../controllers/OfferController');


router.route('/')
    .post(offerController.createOffer)
    .get(offerController.getOffers);

router.get('/:id', offerController.getOfferById);
router.put('/:id', offerController.updateOffer);
router.delete('/:id', offerController.deleteOffer);
module.exports = router;
