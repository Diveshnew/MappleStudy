// Import necessary hooks and libraries
import { useEffect, useState } from 'react';
import { VscAdd } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import service function for fetching instructor courses
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
// Import common components
import IconBtn from '../../common/IconBtn';
import CoursesTable from './InstructorCourses/CoursesTable';

export default function MyCourses() {
  // Get the authentication token from Redux state
  const { token } = useSelector((state) => state.auth);
  // React Router hook to navigate between pages
  const navigate = useNavigate();
  // State to store instructor's courses
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch instructor courses when component mounts
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
    };
    fetchCourses();
    // Dependency array left empty to run effect only on mount
  }, []);

  return (
    <div>
      {/* Header with title and button to add a new course */}
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-[var(--color-richblack-5)]">
          My Courses
        </h1>
        <IconBtn
          text="Add Course"
          onClick={() => navigate('/dashboard/add-course')}
        >
          <VscAdd />
        </IconBtn>
      </div>
      {/* Render the CoursesTable component if courses are available */}
      {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
    </div>
  );
}
