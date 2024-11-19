const HomeCategory = require('../models/HomeCategorySchema');



exports.createHomeCategory = async (req, res) => {
    try {
        const homeCategory = new HomeCategory(req.body);
        await homeCategory.save();
        res.status(200).json({
            status: "success",
            data: { homeCategory },
        });
    } catch (error) {
        return res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
};

// Get all home categories
exports.getHomeCategories = async (req, res) => {
    try {
        const homeCategories = await HomeCategory.find().populate("category");
        res.status(200).json({
            status: "success",
            data: { homeCategories },
        });
    } catch (error) {
        return res.status(404).json({
            status: "fail",
            message: error.message
        });
    }
};

// Get a homeCategory by ID
exports.getHomeCategoryById = async (req, res) => {
    try {
        const homeCategory = await HomeCategory.findById(req.params.id).populate("category");
        if (!homeCategory) {
            return res.status(404).json({ message: 'HomeCategory not found' });
        }
        res.status(200).json({
            status: "success",
            data: { homeCategory },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a homeCategory
exports.updateHomeCategory = async (req, res) => {
    try {
        const homeCategory = await HomeCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!homeCategory) {
            return res.status(404).json({ message: 'HomeCategory not found' });
        }
        res.status(200).json({
            status: "success",
            data: { homeCategory },
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a homeCategory
exports.deleteHomeCategory = async (req, res) => {
    try {
        const homeCategory = await HomeCategory.findByIdAndDelete(req.params.id);
        if (!homeCategory) {
            return res.status(404).json({ message: 'HomeCategory not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
