const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    discount:{type: Number, required:true},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
});

module.exports = mongoose.model("Offer", OfferSchema);
