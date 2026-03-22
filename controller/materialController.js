const Material = require("../models/Material");

// Create new material
exports.createMaterial = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "material name is required" });
    }

    const materialExists = await Material.findOne({ name });

    if (materialExists) {
      return res.status(400).json({ message: "material already exists" });
    }

    const material = await Material.create({ name });

    res.status(201).json(material);
  } catch (error) {
    console.error(error);

    // duplicate key safety
    if (error.code === 11000) {
      return res.status(400).json({ message: "Material already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Get all materials
exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ name: 1 });
    res.status(200).json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete material by ID
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    await material.deleteOne();

    res.status(200).json({
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
