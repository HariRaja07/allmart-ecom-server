const mongoose = require("mongoose");

const HomeCategorySchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
});

module.exports = mongoose.model("HomeCategory", HomeCategorySchema);
