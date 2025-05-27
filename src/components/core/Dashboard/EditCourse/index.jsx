// Importing React hooks and necessary modules
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// Importing API function to get full course details
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';
// Importing Redux actions to set course data and editing state
import { setCourse, setEditCourse } from '../../../../slices/courseSlice';
// Component to render step-wise course editing interface
import RenderSteps from '../AddCourse/RenderSteps';

export default function EditCourse() {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // IIFE to fetch and set course details on component mount
    (async () => {
      setLoading(true);
      const response = await getFullDetailsOfCourse(courseId, token);

      if (response && response.courseDetails && response.courseDetails._id) {
        // Normalize course content by ensuring subSection is always an array
        const normalizedContent = (
          response.courseDetails.courseContent || []
        ).map((sec) => ({
          ...sec,
          subSection: sec.subSections || sec.subSection || [],
        }));

        // Dispatch Redux actions to update course state
        dispatch(setEditCourse(true));
        dispatch(
          setCourse({
            ...response.courseDetails,
            courseContent: normalizedContent,
          })
        );
      } else {
        // Log warning if response is invalid or course not found
        console.warn('Course not found or malformed response.');
      }

      setLoading(false);
    })();
    // Dependency array includes all variables used inside useEffect
  }, [courseId, dispatch, token]);

  // Show spinner while loading is true
  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page title */}
      <h1 className="mb-14 text-3xl font-medium text-[var(--color-richblack-5)]">
        Edit Course
      </h1>
      {/* Conditional rendering: show steps if course exists, else show fallback text */}
      <div className="mx-auto max-w-[600px]">
        {course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-[var(--color-richblack-100)]">
            Course not found
          </p>
        )}
      </div>
    </div>
  );
}
