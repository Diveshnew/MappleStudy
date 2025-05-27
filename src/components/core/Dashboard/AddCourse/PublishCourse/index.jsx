// Importing React hooks and utilities
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Importing API function and Redux actions
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import { resetCourseState, setStep } from '../../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../../utils/constants';
// Reusable button component with optional icon
import IconBtn from '../../../../common/IconBtn';

export default function PublishCourse() {
  // Setting up react-hook-form utilities
  const { register, handleSubmit, setValue, getValues } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Accessing token and course from Redux store
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  // Local state to manage loading status
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default checkbox value if course is already published
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue('public', true);
    }
    // Empty dependency array ensures this effect runs once on mount
  }, []);

  // Navigate to previous step in course creation flow
  const goBack = () => {
    dispatch(setStep(2));
  };

  // Reset course state and redirect to course listing
  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate('/dashboard/my-courses');
  };

  // Handle course publish or draft logic based on checkbox state
  const handleCoursePublish = async () => {
    // Check if the form value matches the current status — no need to make API call
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues('public') === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues('public') === false)
    ) {
      // No change in status; directly redirect
      goToCourses();
      return;
    }

    // Create FormData object to send status update
    const formData = new FormData();
    formData.append('courseId', course._id);

    // Determine the new status based on checkbox
    const courseStatus = getValues('public')
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT;
    formData.append('status', courseStatus);

    setLoading(true);
    // API call to update course status
    const result = await editCourseDetails(formData, token);
    if (result) {
      // On success, navigate to course list
      goToCourses();
    }
    setLoading(false);
  };

  // Form submission handler
  const onSubmit = (data) => {
    // Trigger publish logic on submit
    handleCoursePublish();
  };

  return (
    <div className="rounded-md border-[1px] border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] p-6">
      {/* Title */}
      <p className="text-2xl font-semibold text-[var(--color-richblack-5)]">
        Publish Settings
      </p>

      {/* Form to toggle public status */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox field to mark course as public */}
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register('public')}
              className="border-gray-300 h-4 w-4 rounded bg-[var(--color-richblack-500)] text-[var(--color-richblack-400)] focus:ring-2 focus:ring-[var(--color-richblack-5)]"
            />
            <span className="ml-2 text-[var(--color-richblack-400)]">
              Make this course as public
            </span>
          </label>
        </div>

        {/* Navigation buttons */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-[var(--color-richblack-300)] py-[8px] px-[20px] font-semibold text-[var(--color-richblack-900)]"
          >
            Back
          </button>

          {/* Save/Submit button */}
          <IconBtn type="submit" disabled={loading} text="Save Changes" />
        </div>
      </form>
    </div>
  );
}
