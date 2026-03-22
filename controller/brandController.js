const Brand = require("../models/Brand");

// Create new brand
exports.createBrand = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Brand name is required" });
    }

    const brandExists = await Brand.findOne({ name });

    if (brandExists) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    const brand = await Brand.create({ name });

    res.status(201).json(brand);
  } catch (error) {
    console.error(error);

    // duplicate key safety
    if (error.code === 11000) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Get all brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete brand by ID
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    await brand.deleteOne();

    res.status(200).json({
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
