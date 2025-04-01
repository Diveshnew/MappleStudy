const Category = require('../models/Category');

// Create Category handler function
exports.createCategory = async (req, res) => {
  try {
    // Extract data from request body
    const { name, description } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Create entry in the DB using object shorthand
    const categoryDetails = await Category.create({ name, description });
    // (Optional) Remove console.log in production or use a logger
    console.log('Category created:', categoryDetails);

    // Return response (using 201 Created for new resource)
    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Categories handler function
exports.showAllCategories = async (req, res) => {
  try {
    // Find all categories and return only name and description
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      message: 'All categories returned successfully',
      allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
