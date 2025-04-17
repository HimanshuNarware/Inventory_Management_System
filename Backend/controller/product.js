/** @format */

const Product = require('../models/product');
const Purchase = require('../models/purchase');
const Sales = require('../models/sales');

// Add Post
const addProduct = (req, res) => {
  console.log('req: ', req.body);

  try {
    // Validate required fields
    if (!req.body.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!req.body.name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    if (!req.body.manufacturer) {
      return res.status(400).json({ error: 'Manufacturer is required' });
    }

    // Convert price to number if provided
    let price = 0;
    if (req.body.price) {
      price = Number(req.body.price);
      if (isNaN(price) || price < 0) {
        return res
          .status(400)
          .json({ error: 'Price must be a valid non-negative number' });
      }
    }

    const addProduct = new Product({
      userID: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      stock: 0,
      price: price,
      description: req.body.description || '',
      category: req.body.category || 'Uncategorized',
    });

    addProduct
      .save()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.error('Error saving product:', err);
        res
          .status(500)
          .json({ error: 'Failed to save product', details: err.message });
      });
  } catch (error) {
    console.error('Error in addProduct:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    // Validate userId parameter
    if (!req.params.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if userId is a valid ObjectId (to prevent server crash)
    if (
      req.params.userId.length !== 24 &&
      req.params.userId !== 'guest-user-id'
    ) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    // Handle guest user case
    const query =
      req.params.userId === 'guest-user-id'
        ? {} // For guest users, show all products
        : { userID: req.params.userId };

    const findAllProducts = await Product.find(query).sort({ _id: -1 }); // -1 for descending
    res.json(findAllProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      details: error.message,
    });
  }
};

// Delete Selected Product
const deleteSelectedProduct = async (req, res) => {
  try {
    // Validate product ID
    if (!req.params.id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product ID is a valid ObjectId
    if (req.params.id.length !== 24) {
      return res.status(400).json({ error: 'Invalid Product ID format' });
    }

    // Delete the product
    const deleteProduct = await Product.deleteOne({ _id: req.params.id });

    // Delete related purchase records
    const deletePurchaseProduct = await Purchase.deleteOne({
      ProductID: req.params.id,
    });

    // Delete related sales records
    const deleteSaleProduct = await Sales.deleteOne({
      ProductID: req.params.id,
    });

    // Check if product was found and deleted
    if (deleteProduct.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product deleted successfully',
      details: { deleteProduct, deletePurchaseProduct, deleteSaleProduct },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      error: 'Failed to delete product',
      details: error.message,
    });
  }
};

// Update Selected Product
const updateSelectedProduct = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.productID) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    if (!req.body.name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    if (!req.body.manufacturer) {
      return res.status(400).json({ error: 'Manufacturer is required' });
    }

    // Check if product ID is a valid ObjectId
    if (req.body.productID.length !== 24) {
      return res.status(400).json({ error: 'Invalid Product ID format' });
    }

    // Convert price to number if provided
    if (req.body.price !== undefined) {
      const price = Number(req.body.price);
      if (isNaN(price) || price < 0) {
        return res
          .status(400)
          .json({ error: 'Price must be a valid non-negative number' });
      }
    }

    // Create update object with all fields that might be updated
    const updateFields = {
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description || '',
      category: req.body.category || 'Uncategorized',
    };

    // Add price to update fields if it's provided
    if (req.body.price !== undefined) {
      updateFields.price = Number(req.body.price);
    }

    // Add stock to update fields if it's provided
    if (req.body.stock !== undefined) {
      updateFields.stock = req.body.stock;
    }

    console.log('Updating product with fields:', updateFields);

    const updatedResult = await Product.findByIdAndUpdate(
      { _id: req.body.productID },
      updateFields,
      { new: true, runValidators: true } // Return updated document and run validators
    );

    // Check if product was found and updated
    if (!updatedResult) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Product updated:', updatedResult);
    res.json({
      message: 'Product updated successfully',
      product: updatedResult,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      error: 'Failed to update product',
      details: error.message,
    });
  }
};

// Search Products
const searchProduct = async (req, res) => {
  try {
    // Validate search term
    const searchTerm = req.query.searchTerm;
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    // Perform the search with case-insensitive regex
    const products = await Product.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).sort({ _id: -1 });

    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      error: 'Failed to search products',
      details: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteSelectedProduct,
  updateSelectedProduct,
  searchProduct,
};
