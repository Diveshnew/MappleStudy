import ProgressBar from '@ramonak/react-progress-bar';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';

export default function EnrolledCourses() {
  // Extract token from Redux store
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // State to store enrolled courses
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  // Function to fetch user's enrolled courses
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token); // API call
      setEnrolledCourses(res); // Set data in state
    } catch (error) {
      console.log('Could not fetch enrolled courses.');
    }
  };

  // Fetch enrolled courses on component mount
  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <>
      {/* Page Heading */}
      <div className="text-3xl text-[var(--color-richblack-50)]">
        Enrolled Courses
      </div>

      {/* Loader while fetching data */}
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : // Empty state if no courses found
      !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-[var(--color-richblack-5)]">
          You have not enrolled in any course yet.
          {/* TODO: Modify this Empty State */}
        </p>
      ) : (
        // Render courses table if data exists
        <div className="my-8 text-[var(--color-richblack-5)]">
          {/* Table Header */}
          <div className="flex rounded-t-lg bg-[var(--color-richblack-500)] ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {/* Render each enrolled course */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border border-[var(--color-richblack-700)] ${
                i === arr.length - 1 ? 'rounded-b-lg' : 'rounded-none'
              }`}
              key={i}
            >
              {/* Course Name and Thumbnail - Click navigates to specific lesson */}
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  );
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-xs text-[var(--color-richblack-300)]">
                    {/* Show short description, truncate if too long */}
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>

              {/* Progress with progress bar */}
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
