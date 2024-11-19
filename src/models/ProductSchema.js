const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    qrcode: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
    },
    stock: {
        type: Number,
        required: true,
    },
    sellingprice: {
        type: Number,
        required: true,
    },
    costPrice: {
        type: Number,
        //required: true,
    },
});

module.exports = mongoose.model("Product", productSchema);
