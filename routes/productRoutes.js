const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createProduct);         // Create
router.get("/", getProducts);                           // Read all
router.get("/:id", getProductById);                     // Read one
router.put("/:id", authMiddleware, updateProduct);      // Update
router.delete("/:id", authMiddleware, deleteProduct);   // Delete

module.exports = router;
