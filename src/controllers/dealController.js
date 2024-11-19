const Deal = require('../models/DealSchema');

// Create a new deal
exports.createDeal = async (req, res) => {
    try {
      const { title, description, discountPercentage, startDate, endDate, product, } = req.body;
  
      const newDeal = new Deal({
        title,
        description,
        discountPercentage,
        startDate,
        endDate,
        product,
      });
  
      await newDeal.save();
  
      res.status(201).json({
        status: "success",
        data: {newDeal},
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  };

  exports.updateDeal = async (req, res) => {
    const { id } = req.params;
    const { title, description, discountPercentage, startDate, endDate, product, } = req.body;
  
    try {
      const deal = await Deal.findById(id);
  
      if (!deal) {
        return res.status(404).json({
          status: "fail",
          message: "Deal not found",
        });
      }
  
      // Update deal details
      deal.title = title || deal.title;
      deal.description = description || deal.description;
      deal.discountPercentage = discountPercentage || deal.discountPercentage;
      deal.startDate = startDate || deal.startDate;
      deal.endDate = endDate || deal.endDate;
      deal.product = product || deal.product;
  
      await deal.save();
  
      res.status(200).json({
        status: "success",
        data: {deal},
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  };

  exports.getDeals = async (req, res) => {
    try {
      const activeDeals = await Deal.find().populate("product");
      res.status(200).json({
        status: "success",
        data: {activeDeals},
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  };
// Get all active deals for "Top Deals" page
exports.getActiveDeals = async (req, res) => {
  try {
    const currentDate = new Date();

    // Fetch deals that are active and within the date range
    const activeDeals = await Deal.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    })
      .populate('product')

    if (!activeDeals.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'No active deals found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {activeDeals},
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get a specific deal by ID
exports.getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('product')

    if (!deal) {
      return res.status(404).json({
        status: 'fail',
        message: 'Deal not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {deal},
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Deactivate a deal
exports.deactivateDeal = async (req, res) => {
    const { id } = req.params;
    try {
      const deal = await Deal.findById(id);
      if (!deal) {
        return res.status(404).json({
          status: "fail",
          message: "Deal not found",
        });
      }
  
      // Set the deal as inactive
      deal.isActive = false;
      await deal.save();
  
      res.status(200).json({
        status: "success",
        message: "Deal deactivated successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  };

  exports.deleteDeal = async (req, res) => {
    try {
      const deal = await Deal.findByIdAndDelete(req.params.id);
      if (!deal) {
        return res.status(404).json({
          status: "fail",
          message: "Deal not found",
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
