const mongoose = require('mongoose');
const Course = require('../models/Course');
const Category = require('../models/Category');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const User = require('../models/User');
const CourseProgress = require('../models/CourseProgress');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require('../utils/secToDuration');

// --------Create Course Handler Function------------
exports.createCourse = async (req, res) => {
  try {
    // 1. Extract data from request body, including the optional status field
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      status,
    } = req.body;

    // 2. Default status to 'Draft' if not provided by the client
    if (!status) {
      status = 'Draft';
    }

    // 3. Get the thumbnail image file from uploaded files
    const thumbnail = req.files.thumbnailImage;

    // 4. Validate that all required fields are present
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

    // 5. Ensure the provided status value is one of the allowed enum values
    if (!['Draft', 'Published'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    // 6. Retrieve instructor details using the authenticated user ID
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: 'Instructor details not found',
      });
    }

    // 7. Resolve the category: allow lookup by ObjectId or by human-readable name
    let categoryDetails;
    if (mongoose.Types.ObjectId.isValid(category)) {
      // 7a. If category value is a valid ObjectId, find by _id
      categoryDetails = await Category.findById(category);
    } else {
      // 7b. Otherwise, assume the client passed the category's name
      categoryDetails = await Category.findOne({ name: category });
    }
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: 'Category details not found',
      });
    }

    // 8. Upload the thumbnail image to Cloudinary and get its URL
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // 9. Create the new Course document with all validated and resolved data
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status,
    });

    // 10. Update the instructor's record to include this new course in their list
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // 11. Return a success response with the newly created course data
    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    // 12. Handle any unexpected errors during the process
    return res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message,
    });
  }
};

// --------Show All Courses Handler Function------------
exports.showAllCourses = async (req, res) => {
  try {
    // 1. Query all courses, selecting only key fields for listing
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
        status: true, // Include status in listing
      }
    )
      .populate('instructor') // Replace instructor ID with user details
      .populate('category') // Replace category ID with category details
      .exec();

    // 2. Return the list of courses
    return res.status(200).json({
      success: true,
      message: 'All courses fetched successfully',
      data: allCourses,
    });
  } catch (error) {
    console.error(error);
    // 3. Handle any errors fetching the courses
    return res.status(500).json({
      success: false,
      message: 'Cannot fetch course data',
      error: error.message,
    });
  }
};

// ----------Get Course Details Handler Function----------
exports.getCourseDetails = async (req, res) => {
  try {
    // 1. Extract the courseId from the request body
    const { courseId } = req.body;

    // 2. Find the course and populate nested references for detailed view
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: 'instructor',
        populate: { path: 'additionalDetails' },
      })
      .populate('category')
      .populate('ratingAndReviews')
      .populate({
        path: 'courseContent',
        populate: { path: 'subSections' },
      })
      .exec();

    // 3. If no course is found, return a 400 error
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ID ${courseId}`,
      });
    }

    // 4. Return the detailed course data
    return res.status(200).json({
      success: true,
      message: 'Course Details fetched successfully',
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    // 5. Handle unexpected errors
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ------------Edit Course------------------------
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (req.files) {
      console.log('thumbnail update');
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === 'tag' || key === 'instructions') {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({ _id: courseId })
      .populate({ path: 'instructor', populate: { path: 'additionalDetails' } })
      .populate('category')
      .populate('ratingAndReviews')
      .populate({
        path: 'courseContent',
        populate: { path: 'subSections', modal: 'SubSection' },
      })
      .exec();

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// ----------------Get All Courses-------------------
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: 'Published' },
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
      .exec();

    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

//----------------------Get Full Course Details------------
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({ path: 'instructor', populate: { path: 'additionalDetails' } })
      .populate('category')
      .populate('ratingAndReviews')
      .populate({
        path: 'courseContent',
        populate: { path: 'subSections', model: 'SubSection' },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseId,
      userId,
    });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // Now that subSections is populated, iterate over that array:
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((section) => {
      section.subSections.forEach((subSection) => {
        totalDurationInSeconds += parseInt(subSection.timeDuration, 10);
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos || [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ------------------Get Instructor Courses------------------
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve instructor courses',
      error: error.message,
    });
  }
};

// ------------------------Delete Course------------------------
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSections;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }
      await Section.findByIdAndDelete(sectionId);
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
