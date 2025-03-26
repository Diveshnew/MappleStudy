const Tag = require('../models/Tag');

// Create Tag handler function
exports.createTag = async (req, res) => {
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
    const tagDetails = await Tag.create({ name, description });
    // (Optional) Remove console.log in production or use a logger
    console.log('Tag created:', tagDetails);

    // Return response (using 201 Created for new resource)
    return res.status(201).json({
      success: true,
      message: 'Tag created successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Tags handler function
exports.showAllTags = async (req, res) => {
  try {
    // Find all tags and return only name and description
    const allTags = await Tag.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: 'All tags returned successfully',
      allTags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
