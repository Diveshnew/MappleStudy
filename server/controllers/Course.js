const Course = require('../models/Course');
const Tag = require('../models/Tag');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

// --------Create Course Handler Function------------
exports.createCourse = async (req, res) => {
  try {
    // Extract data from request body
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    // Get thumbnail image from files
    const thumbnail = req.files.thumbnailImage;

    // Validate required fields
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
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
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: 'Instructor details not found',
      });
    }

    // Check if the provided tag exists
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: 'Tag details not found',
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
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // Update instructor's course list
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // (Optional) Update tag schema if needed
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
