const Section = require('../models/Section');
const Course = require('../models/Course');

// --------Create Section Handler Function------------
exports.createSection = async (req, res) => {
  try {
    // Extract data from request body
    const { sectionName, courseId } = req.body;

    // Validate required fields
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Section name and course ID are required',
      });
    }

    // Create section
    const newSection = await Section.create({ sectionName });

    // Update course with section objectID
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    );

    // TODO: Use populate to replace sections/sub-sections in updatedCourseDetails

    // Return response with 201 Created for new resource
    return res.status(201).json({
      success: true,
      message: 'Section created successfully',
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to create section, please try again',
      error: error.message,
    });
  }
};

// --------Update Section Handler Function------------
exports.updateSection = async (req, res) => {
  try {
    // Extract data from request body
    const { sectionName, sectionId } = req.body;

    // Validate required fields
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: 'Section name and section ID are required',
      });
    }

    // Update section
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    // Optionally, return the updated section object
    return res.status(200).json({
      success: true,
      message: 'Section updated successfully',
      section,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to update section, please try again.',
      error: error.message,
    });
  }
};

// --------Delete Section Handler Function------------
exports.deleteSection = async (req, res) => {
  try {
    // Get sectionId from URL parameters
    const { sectionId } = req.params;

    // Delete section using findByIdAndDelete
    await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: 'Section deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to delete section, please try again.',
      error: error.message,
    });
  }
};
