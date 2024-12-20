const Wishlist = require('../models/WishlistSchema');
const Product = require('../models/ProductSchema');

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body; // product ID to add to wishlist
  const userId = req.user; // Directly access req.user (since it is just the user ID)

  try {
    // Check if wishlist already exists for the user
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create a new wishlist for the user if not exists
      wishlist = new Wishlist({
        userId,
        products: [{ productId }]
      });
    } else {
      // Add the product to the existing wishlist if not already present
      const productExists = wishlist.products.some(
        item => item.productId.toString() === productId
      );

      if (!productExists) {
        wishlist.products.push({ productId });
      }
    }

    // Save the wishlist
    await wishlist.save();

    res.status(200).json({
      status: 'success',
      message: 'Product added to wishlist',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Error adding to wishlist',
    });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.body; // product ID to remove from wishlist
  const userId = req.user; // Directly access req.user

  try {
    // Find the wishlist of the user
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Wishlist not found',
      });
    }

    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter(
      item => item.productId.toString() !== productId
    );

    // Save the updated wishlist
    await wishlist.save();

    res.status(200).json({
      status: 'success',
      message: 'Product removed from wishlist',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Error removing from wishlist',
    });
  }
};

// Get user's wishlist
exports.getUserWishlist = async (req, res) => {
  const userId = req.user; // Directly access req.user

  try {
    // Find the wishlist by user ID
    const wishlist = await Wishlist.findOne({ userId })
  .populate({
    path: 'products.productId',  // Specify that we want to populate productId inside the products array
    model: 'Product',             // Specify the model to populate (optional, usually inferred)
  });

    if (!wishlist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Wishlist not found',
      });
    }
    console.log(wishlist);

    res.status(200).json({
      status: 'success',
      data: wishlist.products,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Error fetching wishlist',
    });
  }
};
