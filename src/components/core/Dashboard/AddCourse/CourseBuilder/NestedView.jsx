// Import necessary React hooks and icons
import { useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { RxDropdownMenu } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';

// Import API services and slice actions
import {
  deleteSection,
  deleteSubSection, // API call to delete subsection
} from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';

// Import custom components
import ConfirmationModal from '../../../../common/ConfirmationModal';
import SubSectionModal from './SubSectionModal';

export default function NestedView({ handleChangeEditSectionName }) {
  // Access course and auth token from Redux store
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Local state to manage modals and view/edit toggles
  const [addSubSection, setAddSubsection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  // Handle deletion of an entire section
  const handleDeleteSection = async (sectionId) => {
    try {
      await deleteSection(
        // Create FormData and pass sectionId
        new FormData().append('sectionId', sectionId),
        token
      );
      // Remove deleted section from course content
      const filteredContent = (course.courseContent || []).filter(
        (sec) => sec._id !== sectionId
      );
      // Update course state
      dispatch(setCourse({ ...course, courseContent: filteredContent }));
    } catch (error) {
      console.error('Error deleting section:', error);
    }
    setConfirmationModal(null);
  };

  // Handle deletion of a specific sub-section (lecture)
  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    // Build form data
    const formData = new FormData();
    formData.append('sectionId', sectionId);
    formData.append('subSectionId', subSectionId);

    // Call API helper with (formData, token)
    const updatedSection = await deleteSubSection(formData, token);

    if (updatedSection) {
      // Normalize key for UI
      const formatted = {
        ...updatedSection,
        subSection: updatedSection.subSections || [],
      };

      // Replace only that section in courseContent
      const updatedCourseContent = (course.courseContent || []).map((sec) =>
        sec._id === formatted._id ? formatted : sec
      );
      dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
    }

    setConfirmationModal(null);
  };

  return (
    <>
      {/* Container for nested section and sub-section structure */}
      <div
        className="rounded-lg bg-[var(--color-richblack-700)] p-6 px-8"
        id="nestedViewContainer"
      >
        {/* Iterate through each section */}
        {(course.courseContent || []).map((section) => (
          <details key={section._id} open>
            {/* Section header with title and actions */}
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-[var(--color-richblack-600)] py-2">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-[var(--color-richblack-50)]" />
                <p className="font-semibold text-[var(--color-richblack-50)]">
                  {section.sectionName}
                </p>
              </div>
              <div className="flex items-center gap-x-3">
                {/* Edit section button */}
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }
                >
                  <MdEdit className="text-xl text-[var(--color-richblack-300)]" />
                </button>
                {/* Delete section button with confirmation modal */}
                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: 'Delete this Section?',
                      text2: 'All the lectures in this section will be deleted',
                      btn1Text: 'Delete',
                      btn2Text: 'Cancel',
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                >
                  <RiDeleteBin6Line className="text-xl text-[var(--color-richblack-300)]" />
                </button>
                <span className="font-medium text-[var(--color-richblack-300)]">
                  |
                </span>
                <AiFillCaretDown className="text-xl text-[var(--color-richblack-300)]" />
              </div>
            </summary>

            {/* Sub-sections (lectures) list */}
            <div className="px-6 pb-4">
              {(section.subSection || []).map((data) => (
                <div
                  key={data._id}
                  onClick={() =>
                    setViewSubSection({
                      ...data,
                      sectionId: section._id,
                    })
                  }
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-[var(--color-richblack-600)] py-2"
                >
                  {/* Sub-section title */}
                  <div className="flex items-center gap-x-3 py-2">
                    <RxDropdownMenu className="text-2xl text-[var(--color-richblack-50)]" />
                    <p className="font-semibold text-[var(--color-richblack-50)]">
                      {data.title}
                    </p>
                  </div>

                  {/* Edit/Delete actions for sub-section */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-3"
                  >
                    {/* Edit sub-section button */}
                    <button
                      onClick={() =>
                        setEditSubSection({ ...data, sectionId: section._id })
                      }
                    >
                      <MdEdit className="text-xl text-[var(--color-richblack-300)]" />
                    </button>

                    {/* Delete sub-section with confirmation modal */}
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: 'Delete this Sub-Section?',
                          text2: 'This lecture will be deleted',
                          btn1Text: 'Delete',
                          btn2Text: 'Cancel',
                          btn1Handler: () =>
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      <RiDeleteBin6Line className="text-xl text-[var(--color-richblack-300)]" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Button to add a new lecture (sub-section) */}
              <button
                onClick={() => setAddSubsection(section._id)}
                className="mt-3 flex items-center gap-x-1 text-[var(--color-yellow-50)]"
              >
                <FaPlus className="text-lg" />
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>

      {/* Modals for adding, viewing, and editing sub-sections */}
      {addSubSection && (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubsection}
          courseId={course._id}
          sectionId={addSubSection}
          token={token}
          add
        />
      )}
      {viewSubSection && (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          courseId={course._id}
          sectionId={viewSubSection.sectionId}
          token={token}
          view
        />
      )}
      {editSubSection && (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          courseId={course._id}
          sectionId={editSubSection.sectionId}
          token={token}
          edit
        />
      )}

      {/* Global confirmation modal for delete actions */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
