const Profile = require('../models/Profile');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

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
    const userDetails = await User.findById(userId);
    const profile = await Profile.findById(userDetails?.additionalDetails);

    // If profile doesn't exist
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
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
      profile,
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete associated profile
    await Profile.findByIdAndDelete(user.additionalDetails);

    // TODO: Unenroll user from enrolled courses (future enhancement)

    // Delete user document
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteAccount:', error);
    return res.status(500).json({
      success: false,
      message: 'User cannot be deleted successfully',
    });
  }
};

// Get User Profile
exports.getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user and populate only necessary profile fields
    const userDetails = await User.findById(userId)
      .populate('additionalDetails', 'about contactNumber gender dateOfBirth')
      .exec();

    return res.status(200).json({
      success: true,
      message: 'User data fetched successfully',
      data: userDetails,
    });
  } catch (error) {
    console.error('Error in getAllUserDetails:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
