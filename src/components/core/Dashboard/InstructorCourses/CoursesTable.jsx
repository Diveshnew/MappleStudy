// Import necessary hooks and components from react-redux and other libraries
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';

// Import styles for responsive table
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

// React useState hook for managing local component state
import { useState } from 'react';

// Import icons used in UI
import { FaCheck } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { HiClock } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';

// React Router hook to navigate programmatically
import { useNavigate } from 'react-router-dom';

// Utility to format course creation date
import { formatDate } from '../../../../services/formatDate';

// Functions to handle API calls related to courses
import {
  deleteCourse,
  fetchInstructorCourses,
} from '../../../../services/operations/courseDetailsAPI';

// Course status constants like 'DRAFT' or 'PUBLISHED'
import { COURSE_STATUS } from '../../../../utils/constants';

// Modal component for confirming actions like course deletion
import ConfirmationModal from '../../../common/ConfirmationModal';

// CoursesTable component to display instructor's courses
export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const TRUNCATE_LENGTH = 30;

  // Handler to delete a course and refresh course list
  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  // Render course table
  return (
    <>
      {/* Responsive Table for displaying courses */}
      <Table className="rounded-xl border border-[var(--color-richblack-800)] ">
        <Thead>
          {/* Table Header Row */}
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-[var(--color-richblack-800)] px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-[var(--color-richblack-100)]">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-[var(--color-richblack-100)]">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-[var(--color-richblack-100)]">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-[var(--color-richblack-100)]">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* Show this row if there are no courses */}
          {courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-[var(--color-richblack-100)]">
                No courses found
              </Td>
            </Tr>
          ) : (
            // Map through each course and display a row
            courses?.map((course) => (
              <Tr
                key={course._id}
                className="flex gap-x-10 border-b border-[var(--color-richblack-800)] px-6 py-8"
              >
                {/* Course name, image, description and status */}
                <Td className="flex flex-1 gap-x-4">
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[148px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-lg font-semibold text-[var(--color-richblack-5)]">
                      {course.courseName}
                    </p>
                    <p className="text-xs text-[var(--color-richblack-300)]">
                      {course.courseDescription.split(' ').length >
                      TRUNCATE_LENGTH
                        ? course.courseDescription
                            .split(' ')
                            .slice(0, TRUNCATE_LENGTH)
                            .join(' ') + '...'
                        : course.courseDescription}
                    </p>
                    <p className="text-[12px] text-white">
                      Created: {formatDate(course.createdAt)}
                    </p>
                    {/* Show Draft or Published status */}
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-[var(--color-richblack-700)] px-2 py-[2px] text-[12px] font-medium text-[var(--color-pink-100)]">
                        <HiClock size={14} />
                        Drafted
                      </div>
                    ) : (
                      <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-[var(--color-richblack-700)] px-2 py-[2px] text-[12px] font-medium text-[var(--color-yellow-100)]">
                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[var(--color-yellow-100)] text-[var(--color-richblack-700)]">
                          <FaCheck size={8} />
                        </div>
                        Published
                      </div>
                    )}
                  </div>
                </Td>
                {/* Course duration (currently hardcoded) */}
                <Td className="text-sm font-medium text-[var(--color-richblack-100)]">
                  2hr 30min
                </Td>
                {/* Course price */}
                <Td className="text-sm font-medium text-[var(--color-richblack-100)]">
                  ₹{course.price}
                </Td>
                {/* Action buttons for edit and delete */}
                <Td className="text-sm font-medium text-[var(--color-richblack-100)] ">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`);
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-[var(--color-caribbeangreen-300)]"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: 'Do you want to delete this course?',
                        text2:
                          'All the data related to this course will be deleted',
                        btn1Text: !loading ? 'Delete' : 'Loading...  ',
                        btn2Text: 'Cancel',
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      });
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {/* Show confirmation modal if it's open */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
