const HomeContent = require("../models/HomeContent");

// Get home page content
exports.getHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.findOne();

    return res.status(200).json(content);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Update home page content
exports.updateHomeContent = async (req, res) => {
  try {
    let home = await HomeContent.findOne();

    if (!home) {
      // validate all
      home = new HomeContent({
        heroImage: req.body.heroImage,
        menCollectionImage: req.body.menCollectionImage,
        womenCollectionImage: req.body.womenCollectionImage,
      });
    } else {
      //  ignore empty strings
      if (req.body.heroImage && req.body.heroImage.trim() !== "") {
        home.heroImage = req.body.heroImage;
      }

      if (
        req.body.menCollectionImage &&
        req.body.menCollectionImage.trim() !== ""
      ) {
        home.menCollectionImage = req.body.menCollectionImage;
      }

      if (
        req.body.womenCollectionImage &&
        req.body.womenCollectionImage.trim() !== ""
      ) {
        home.womenCollectionImage = req.body.womenCollectionImage;
      }
    }

    await home.save();
    res.status(200).json(home);
  } catch (error) {
    console.error("HomeContent update error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};
