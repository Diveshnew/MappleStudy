const Profile = require('../models/Profile');
const CourseProgress = require('../models/CourseProgress');
const Course = require('../models/Course');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require('../utils/secToDuration');

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = '', about = '', contactNumber } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!contactNumber || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing',
      });
    }

    // Get user and associated profile
    const userDetails = await User.findById(userId).select('additionalDetails');
    if (!userDetails) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const profile = await Profile.findById(userDetails.additionalDetails);
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: 'Profile not found' });
    }

    // Update profile fields
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;

    // Save updated profile
    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user
    const user = await User.findById(userId).select('additionalDetails');
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Delete associated profile
    await Profile.findByIdAndDelete(user.additionalDetails);

    // TODO: Unenroll user from enrolled courses (future enhancement)

    // Delete user document
    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAccount:', error);
    return res
      .status(500)
      .json({ success: false, message: 'User cannot be deleted successfully' });
  }
};

// Get User Profile
exports.getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user and populate only necessary profile fields
    const userDetails = await User.findById(userId)
      .select('name email additionalDetails')
      .populate('additionalDetails', 'about contactNumber gender dateOfBirth')
      .lean();

    if (!userDetails) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User data fetched successfully',
      data: userDetails,
    });
  } catch (error) {
    console.error('Error in getAllUserDetails:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Display Picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const file = req.files?.displayPicture;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: 'No image file provided.' });
    }

    const { id: userId } = req.user;
    const image = await uploadImageToCloudinary(
      file,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true, select: 'name email image' }
    ).lean();

    return res.json({
      success: true,
      message: 'Image updated successfully.',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating display picture:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Enrolled Courses with Duration & Progress
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select('courses')
      .populate({
        path: 'courses',
        select: 'courseName courseContent price',
        populate: {
          path: 'courseContent',
          select: 'subSections',
          populate: { path: 'subSections', select: 'timeDuration' },
        },
      })
      .lean();

    if (!user || !user.courses.length) {
      return res
        .status(404)
        .json({ success: false, message: 'No enrolled courses found.' });
    }

    const courseIds = user.courses.map((c) => c._id);
    const progresses = await CourseProgress.find({
      courseId: { $in: courseIds },
      userId,
    })
      .select('courseId completedVideos')
      .lean();
    const progressMap = progresses.reduce((map, doc) => {
      map[doc.courseId] = doc.completedVideos.length;
      return map;
    }, {});

    const result = user.courses.map((course) => {
      // Use subSections (plural), since that's your schema
      const totalSeconds = course.courseContent.reduce(
        (sum, content) =>
          sum +
          content.subSections.reduce(
            (s, sub) => s + parseInt(sub.timeDuration || 0, 10),
            0
          ),
        0
      );
      const totalSections = course.courseContent.reduce(
        (count, content) => count + content.subSections.length,
        0
      );
      const completed = progressMap[course._id] || 0;
      const progressPercentage = totalSections
        ? Math.round((completed / totalSections) * 10000) / 100
        : 100;

      return {
        _id: course._id,
        courseName: course.courseName,
        totalDuration: convertSecondsToDuration(totalSeconds),
        progressPercentage,
      };
    });

    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Instructor Dashboard: Compute stats via aggregation
exports.instructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const courses = await Course.aggregate([
      { $match: { instructor: mongoose.Types.ObjectId(instructorId) } },
      {
        $project: {
          courseName: 1,
          courseDescription: 1,
          totalStudentsEnrolled: { $size: '$studentsEnroled' },
          totalAmountGenerated: {
            $multiply: [{ $size: '$studentsEnroled' }, '$price'],
          },
        },
      },
    ]);

    return res.json({ success: true, courses });
  } catch (error) {
    console.error('Error in instructor dashboard:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
