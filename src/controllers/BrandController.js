const Brand = require('../models/BrandSchema');


exports.createBrand = async (req, res) => {
    try {
        const brand = new Brand(req.body);
        await brand.save();
        res.status(200).json({
            status: "success",
            data: { brand },
        });
    } catch (error) {
        return res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
};

// Get all brands
exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json({
            status: "success",
            data: { brands },
        });
    } catch (error) {
        return res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
};

// Get a brand by ID
exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({
            status: "success",
            data: { brand },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a brand
exports.updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({
            status: "success",
            data: { brand },
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a brand
exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
