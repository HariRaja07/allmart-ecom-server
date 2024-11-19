const Product = require("../models/ProductSchema");
const Category = require("../models/CategorySchema");  // Assuming you have a Category model

// Create a new product
exports.createProduct = async (req, res) => {
  const { image, qrcode, name, category, brand, stock, sellingprice, desc } = req.body;

  // Check if required fields are empty
  if (!image || !qrcode || !name || !category || !brand || stock === undefined || !sellingprice || !desc) {
    return res.status(400).json({
      status: "fail",
      message:
        "All fields (image, qrcode, name, category, stock, sellingprice, description) are required.",
    });
  }

  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category").populate("brand");
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get products by category name
exports.getProductsByCategory = async (req, res) => {
  const { categoryName } = req.params;  // Get category name from URL

  try {
    // Find category by name (you may need to make it case-insensitive)
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not found",
      });
    }

    // Find products that belong to this category
    const products = await Product.find({ category: category._id }).populate("category");

    if (products.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No products found for this category",
      });
    }

    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
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
