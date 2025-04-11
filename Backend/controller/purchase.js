/** @format */

const Purchase = require('../models/purchase');
const purchaseStock = require('./purchaseStock');

// Add Purchase Details
const addPurchase = (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userID) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!req.body.productID) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    if (!req.body.quantityPurchased || req.body.quantityPurchased <= 0) {
      return res
        .status(400)
        .json({ error: 'Valid quantity purchased is required' });
    }

    const addPurchaseDetails = new Purchase({
      userID: req.body.userID,
      ProductID: req.body.productID,
      QuantityPurchased: req.body.quantityPurchased,
      PurchaseDate:
        req.body.purchaseDate || new Date().toISOString().split('T')[0],
      TotalPurchaseAmount: req.body.totalPurchaseAmount,
    });

    addPurchaseDetails
      .save()
      .then((result) => {
        purchaseStock(req.body.productID, req.body.quantityPurchased);
        res.status(200).json(result);
      })
      .catch((err) => {
        console.error('Error saving purchase:', err);
        res
          .status(500)
          .json({ error: 'Failed to save purchase', details: err.message });
      });
  } catch (error) {
    console.error('Error in addPurchase:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get All Purchase Data
const getPurchaseData = async (req, res) => {
  try {
    // Validate userId parameter
    if (!req.params.userID) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if userId is a valid ObjectId (to prevent server crash)
    if (
      req.params.userID.length !== 24 &&
      req.params.userID !== 'guest-user-id'
    ) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    // Handle guest user case
    const query =
      req.params.userID === 'guest-user-id'
        ? {} // For guest users, show all purchases
        : { userID: req.params.userID };

    const findAllPurchaseData = await Purchase.find(query)
      .sort({ _id: -1 })
      .populate('ProductID'); // -1 for descending order

    res.json(findAllPurchaseData);
  } catch (error) {
    console.error('Error fetching purchase data:', error);
    res.status(500).json({
      error: 'Failed to fetch purchase data',
      details: error.message,
    });
  }
};

// Get total purchase amount
const getTotalPurchaseAmount = async (req, res) => {
  try {
    // Validate userId parameter
    if (!req.params.userID) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if userId is a valid ObjectId (to prevent server crash)
    if (
      req.params.userID.length !== 24 &&
      req.params.userID !== 'guest-user-id'
    ) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    // Handle guest user case
    const query =
      req.params.userID === 'guest-user-id'
        ? {} // For guest users, show all purchases
        : { userID: req.params.userID };

    let totalPurchaseAmount = 0;
    const purchaseData = await Purchase.find(query);

    purchaseData.forEach((purchase) => {
      totalPurchaseAmount += purchase.TotalPurchaseAmount;
    });

    res.json({ totalPurchaseAmount });
  } catch (error) {
    console.error('Error calculating total purchase amount:', error);
    res.status(500).json({
      error: 'Failed to calculate total purchase amount',
      details: error.message,
    });
  }
};

module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount };
