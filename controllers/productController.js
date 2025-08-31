const connectDB = require("../db/db");
const { ObjectId } = require("mongodb");

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const db = await connectDB();
    const newProduct = {
      name,
      price,
      description: description || "",
      createdBy: req.user.id, // user id from JWT
      createdAt: new Date(),
    };

    await db.collection("products").insertOne(newProduct);
    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products
// Get all products with pagination and search
exports.getProducts = async (req, res) => {
  try {
    const db = await connectDB();

    // Query params: page, limit, search
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const filter = search
      ? { name: { $regex: search, $options: "i" } } // case-insensitive search
      : {};

    const products = await db.collection("products")
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("products").countDocuments(filter);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const db = await connectDB();
    const product = await db.collection("products").findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const db = await connectDB();

    const product = await db.collection("products").findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // only creator can update
    if (product.createdBy !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    await db.collection("products").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, price, description } }
    );

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product
// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const db = await connectDB();

    const product = await db.collection("products").findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // only admin can delete
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete products" });
    }

    await db.collection("products").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


