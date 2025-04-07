const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

// Create SubSection handler function
exports.createSubSection = async (req, res) => {
  try {
    // Extract data from request body
    const { sectionId, title, timeDuration, description } = req.body;
    // Extract file/video
    const video = req.files?.videoFile;

    // Validate required fields
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Upload video to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // Create a new subsection
    const subSectionDetails = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    // Update section with the new subsection ObjectID
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSections: subSectionDetails._id } },
      { new: true }
    ).populate('subSections'); // Ensure the field name matches your Section model

    // Return response with 201 Created status
    return res.status(201).json({
      success: true,
      message: 'SubSection created successfully',
      updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating SubSection',
      error: error.message,
    });
  }
};

// Update SubSection handler function
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;

    // Find the subsection
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: 'SubSection not found',
      });
    }

    // Update fields if provided
    if (title !== undefined) subSection.title = title;
    if (description !== undefined) subSection.description = description;

    if (req.files?.video) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      // Optionally, update timeDuration based on the uploadDetails if applicable
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    // Find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      'subSections'
    );

    console.log('Updated Section:', updatedSection);

    return res.status(200).json({
      success: true,
      message: 'SubSection updated successfully',
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the section',
      error: error.message,
    });
  }
};

// Delete SubSection handler function
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    // Remove the subsection ID from the section's subSection array
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { subSections: subSectionId },
    });

    // Delete the subsection document
    const subSection = await SubSection.findByIdAndDelete(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: 'SubSection not found',
      });
    }

    // Return updated section with populated subsections
    const updatedSection = await Section.findById(sectionId).populate(
      'subSections'
    );

    return res.status(200).json({
      success: true,
      message: 'SubSection deleted successfully',
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the SubSection',
      error: error.message,
    });
  }
};
