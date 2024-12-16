const Offer = require("../models/OfferSchema");

// Create a new product
exports.createOffer = async (req, res) => {
  const { name, description, discount, category, brand, product,} = req.body;

  // Check if required fields are empty
  if ( !name || !discount || !description) {
    return res.status(400).json({
      status: "fail",
      message:
        "Fields (Name, description, discount) are required.",
    });
  }

  const offerData = {
    name,
    description,
    discount,
    category: category || null,  // Set category to null if not provided
    brand: brand || null,        // Set brand to null if not provided
    product: product || null     // Set product to null if not provided
  };


  try {
    const offer = new Offer(offerData);
    await offer.save();
    res.status(201).json({
      status: "success",
      data: {offer},
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get all products
exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate("category").populate("brand").populate("product").populate({
      path: 'product',  // Populating the 'product' field
      populate: {
        path: 'brand',   // Populating the 'brand' field inside 'product'
        select: 'name',   // Only select the 'name' field from the 'Brand' model
      }
    });
    res.status(200).json({
      status: "success",
      data: {offers},
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get a single product by ID
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate("category").populate("brand").populate("product").populate({
      path: 'product',  // Populating the 'product' field
      populate: {
        path: 'brand',   // Populating the 'brand' field inside 'product'
        select: 'name',   // Only select the 'name' field from the 'Brand' model
      }
    });
    if (!offer) {
      return res.status(404).json({
        status: "fail",
        message: "Offer not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {offer},
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Update a product
exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!offer) {
      return res.status(404).json({
        status: "fail",
        message: "Offer not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {offer},
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Delete a product
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({
        status: "fail",
        message: "Offer not found",
      });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
