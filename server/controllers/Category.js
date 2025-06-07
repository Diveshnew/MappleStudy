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

// category page Details
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: 'courses',
        populate: {
          path: 'instructor',
          select: 'firstName lastName', // only these two fields
        },
      })
      .exec();

    // Debug log to inspect the full selected category object
    console.log('Selected Category Full Data:', selectedCategory);

    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log('Category not found.');
      return res
        .status(404)
        .json({ success: false, message: 'Category not found' });
    }

    // Handle the case when there are no courses
    if (!selectedCategory.courses || selectedCategory.courses.length === 0) {
      console.log('No courses found for the selected category.');
      return res.status(404).json({
        success: false,
        message: 'NO courses found for the selected category',
      });
    }

    const selectedCourses = selectedCategory.courses;

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    }).populate({
      path: 'courses',
      populate: { path: 'instructor', select: 'firstName lastName' },
    });

    let differentCourses = [];
    for (const category of categoriesExceptSelected) {
      differentCourses.push(...category.courses);
    }

    // Get top-selling courses across all categories
    const allCategories = await Category.find().populate({
      path: 'courses',
      populate: { path: 'instructor', select: 'firstName lastName' },
    });
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      selectedCourses: selectedCourses,
      differentCourses: differentCourses,
      mostSellingCourses: mostSellingCourses,
    });
  } catch (error) {
    console.error('Error in categoryPageDetails:', error); //better logging
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
