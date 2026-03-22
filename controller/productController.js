const Product = require("../models/Product");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      material,
      gender,
      images,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !price ||
      !countInStock ||
      !category ||
      !brand ||
      !sizes ||
      !colors ||
      !material ||
      !gender ||
      !images ||
      images.length < 2
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    //  Prevent extra unwanted fields
    const allowedFields = [
      "name",
      "description",
      "price",

      "countInStock",
      "category",
      "brand",
      "sizes",
      "colors",

      "material",
      "gender",
      "images",
    ];

    const extraFields = Object.keys(req.body).filter(
      (key) => !allowedFields.includes(key),
    );

    if (extraFields.length > 0) {
      return res.status(400).json({
        message: `Invalid fields: ${extraFields.join(", ")}`,
      });
    }

    const product = new Product({
      name,
      description,
      price,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      material,
      gender,
      images,
      user: req.user._id,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)[0].message,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      countInStock,
      category,
      brand,
      sizes,
      colors,

      material,
      gender,
      images,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Update fields if provided
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;

      // Save the updated product
      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.status(200).json({ message: "Product removed" });
    } else {
      res.status(404).json({ messahe: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Get product with highest rating
exports.getBestSeller = async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (bestSeller) {
      res.status(200).json(bestSeller);
    } else {
      res.status(404).json({ message: "No best seller found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Get latest products
exports.getNewArrivals = async (req, res) => {
  try {
    // Fetch latest 8 products
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.status(200).json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Get all products with filtering, sorting and pagination
exports.getProducts = async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;
    let query = {};
    // Filter logic
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }
    if (material) {
      query.material = { $in: material.split(",") };
    }
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (size) {
      query.sizes = { $in: size.split(",") };
    }
    if (color) {
      query.colors = { $in: color.split(",") };
    }
    if (gender) {
      query.gender = gender;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        {
          name: { $regex: search, $options: "i" },
        },
        {
          description: { $regex: search, $options: "i" },
        },
      ];
    }

    // Sort Logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limitNum = Number(req.query.limit) || 12;
    const skip = (page - 1) * limitNum;

    // count total products
    const total = await Product.countDocuments(query);

    // fetch paginated products
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      products,
      page,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Get similar products
exports.getSimilarProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const similarProducts = await Product.find({
      _id: { $ne: id }, // Exclude the current product ID
      gender: product.gender,
      category: product.category,
    }).limit(4);
    res.status(200).json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
