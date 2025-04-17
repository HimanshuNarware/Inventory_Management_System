/** @format */

const Store = require('../models/store');

// Add Store
const addStore = async (req, res) => {
  try {
    console.log('Adding store:', req.body);

    // Validate required fields
    if (!req.body.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!req.body.name) {
      return res.status(400).json({ error: 'Store name is required' });
    }

    // Validate other required fields
    if (!req.body.category) {
      return res.status(400).json({ error: 'Store category is required' });
    }

    if (!req.body.address) {
      return res.status(400).json({ error: 'Store address is required' });
    }

    if (!req.body.city) {
      return res.status(400).json({ error: 'Store city is required' });
    }

    const addStore = new Store({
      userID: req.body.userId,
      name: req.body.name,
      category: req.body.category || 'General',
      address: req.body.address || '',
      city: req.body.city || '',
      image: req.body.image || '',
    });

    console.log('Store to be saved:', addStore);

    const result = await addStore.save();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding store:', error);

    // Check for MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};

      // Extract validation error messages
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }

      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    // Check for MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Duplicate store',
        details: 'A store with this name already exists',
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Failed to add store',
      details: error.message,
    });
  }
};

// Get All Stores
const getAllStores = async (req, res) => {
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
        ? {} // For guest users, show all stores
        : { userID: req.params.userID };

    const findAllStores = await Store.find(query).sort({ _id: -1 }); // -1 for descending
    res.json(findAllStores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({
      error: 'Failed to fetch stores',
      details: error.message,
    });
  }
};

module.exports = { addStore, getAllStores };
