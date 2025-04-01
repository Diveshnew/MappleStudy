const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

// --------Create Course Handler Function------------
exports.createCourse = async (req, res) => {
  try {
    // Extract data from request body
    const { courseName, courseDescription, whatYouWillLearn, price, category } =
      req.body;

    // Get thumbnail image from files
    const thumbnail = req.files.thumbnailImage;

    // Validate required fields
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Check for instructor using authenticated user ID
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log('Instructor Details: ', instructorDetails);
    // Todo: verify that userId and instructorDetails._id are same or different?

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: 'Instructor details not found',
      });
    }

    // Check if the provided category exists
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: 'Category details not found',
      });
    }

    // Upload thumbnail image to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // Create new course entry in the database
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // Update instructor's course list
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // (Optional) Update category schema if needed
    // Todo

    // Return response with 201 Created
    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message,
    });
  }
};

//-----------getAllCourses handler function--------------
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate('instructor')
      .populate('category') // Ensure category is also populated
      .exec();

    return res.status(200).json({
      success: true,
      message: 'All courses fetched successfully',
      data: allCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Cannot fetch course data',
      error: error.message,
    });
  }
};
