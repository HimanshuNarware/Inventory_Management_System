/** @format */

const Sales = require('../models/sales');
const soldStock = require('../controller/soldStock');

// Add Sales
const addSales = (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userID) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!req.body.productID) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    if (!req.body.storeID) {
      return res.status(400).json({ error: 'Store ID is required' });
    }

    if (!req.body.stockSold || req.body.stockSold <= 0) {
      return res
        .status(400)
        .json({ error: 'Valid stock sold quantity is required' });
    }

    const addSale = new Sales({
      userID: req.body.userID,
      ProductID: req.body.productID,
      StoreID: req.body.storeID,
      StockSold: req.body.stockSold,
      SaleDate: req.body.saleDate || new Date().toISOString().split('T')[0],
      TotalSaleAmount: req.body.totalSaleAmount,
    });

    addSale
      .save()
      .then((result) => {
        soldStock(req.body.productID, req.body.stockSold);
        res.status(200).json(result);
      })
      .catch((err) => {
        console.error('Error saving sale:', err);
        res
          .status(500)
          .json({ error: 'Failed to save sale', details: err.message });
      });
  } catch (error) {
    console.error('Error in addSales:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get All Sales Data
const getSalesData = async (req, res) => {
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
        ? {} // For guest users, show all sales
        : { userID: req.params.userID };

    const findAllSalesData = await Sales.find(query)
      .sort({ _id: -1 })
      .populate('ProductID')
      .populate('StoreID'); // -1 for descending order

    res.json(findAllSalesData);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({
      error: 'Failed to fetch sales data',
      details: error.message,
    });
  }
};

// Get total sales amount
const getTotalSalesAmount = async (req, res) => {
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
        ? {} // For guest users, show all sales
        : { userID: req.params.userID };

    let totalSaleAmount = 0;
    const salesData = await Sales.find(query);

    salesData.forEach((sale) => {
      totalSaleAmount += sale.TotalSaleAmount;
    });

    res.json({ totalSaleAmount });
  } catch (error) {
    console.error('Error calculating total sales amount:', error);
    res.status(500).json({
      error: 'Failed to calculate total sales amount',
      details: error.message,
    });
  }
};

const getMonthlySales = async (req, res) => {
  try {
    const sales = await Sales.find();

    // Initialize array with 12 zeros
    const salesAmount = [];
    salesAmount.length = 12;
    salesAmount.fill(0);

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.SaleDate.split('-')[1]) - 1;

      salesAmount[monthIndex] += sale.TotalSaleAmount;
    });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addSales,
  getMonthlySales,
  getSalesData,
  getTotalSalesAmount,
};
