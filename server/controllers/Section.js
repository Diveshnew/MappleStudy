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

    // Check if the course exists before adding section
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Create section
    const newSection = await Section.create({ sectionName });

    // Update course with section objectID
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    )
      .populate({
        path: 'courseContent',
        populate: {
          path: 'subSections', // Populate sub-sections inside each section
        },
      })
      .exec();

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

    // Check if section exists before updating
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // Update section name
    section.sectionName = sectionName;
    await section.save();

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
    const { sectionId, courseId } = req.body;

    // Check for required fields
    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Section ID and Course ID are required',
      });
    }

    // Check if section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // Remove section from the course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { courseContent: sectionId } },
      { new: true }
    );

    // Double-check if course was found
    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Delete the section
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
