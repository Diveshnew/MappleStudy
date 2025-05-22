import { toast } from 'react-hot-toast';

import { setLoading, setUser } from '../../slices/profileSlice';
import { apiConnector } from '../apiconnector';
import { profileEndpoints } from '../apis';
import { logout } from './authAPI';

// Destructure API endpoint URLs from profileEndpoints
const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints;

// Fetch and set the user details
export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading('Loading...'); // Show loading toast
    dispatch(setLoading(true)); // Set loading state to true

    try {
      // Make API request to get user details
      const response = await apiConnector('GET', GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });

      console.log('GET_USER_DETAILS API RESPONSE............', response);

      // If API call was not successful, throw error
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // If user has no profile image, generate one using Dicebear
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;

      // Dispatch user data (with image) to Redux store
      dispatch(setUser({ ...response.data.data, image: userImage }));
    } catch (error) {
      // On error, logout user and show error toast
      dispatch(logout(navigate));
      console.log('GET_USER_DETAILS API ERROR............', error);
      toast.error('Could Not Get User Details');
    }

    toast.dismiss(toastId); // Remove loading toast
    dispatch(setLoading(false)); // Set loading state to false
  };
}

// Fetch list of courses the user is enrolled in
export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading('Loading...'); // Show loading toast
  let result = [];

  try {
    // Log information in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('BEFORE Calling BACKEND API FOR ENROLLED COURSES');
      console.log('HITTING ENDPOINT →', GET_USER_ENROLLED_COURSES_API);
    }

    // Make API call to fetch enrolled courses
    const response = await apiConnector(
      'GET',
      GET_USER_ENROLLED_COURSES_API,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('RAW RESPONSE:', response);
      console.log('AFTER Calling BACKEND API FOR ENROLLED COURSES');
    }

    // If response is successful, save data
    if (response.data.success) {
      result = response.data.data;
    } else {
      // If API responds with success false, throw error
      throw new Error(response.data.message);
    }
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;

    // If user has no enrolled courses, treat it as an empty array
    if (status === 404 && data?.message === 'No enrolled courses found.') {
      console.warn('No enrolled courses — returning empty array');
      result = [];
    } else {
      // Log any other type of error
      console.error('GET_USER_ENROLLED_COURSES_API ERROR', {
        status,
        data,
        message: error.message,
      });
      toast.error('Could Not Get Enrolled Courses');
    }
  } finally {
    toast.dismiss(toastId); // Remove loading toast
  }

  return result; // Return the courses array (could be empty)
}

// Fetch instructor data (i.e., courses created by instructor)
export async function getInstructorData(token) {
  const toastId = toast.loading('Loading...'); // Show loading toast
  let result = [];

  try {
    // Make API call to get instructor data
    const response = await apiConnector('GET', GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log('GET_INSTRUCTOR_API_RESPONSE', response);
    result = response?.data?.courses; // Extract courses from response
  } catch (error) {
    console.log('GET_INSTRUCTOR_API ERROR', error);
    toast.error('Could not Get Instructor Data'); // Show error toast
  }

  toast.dismiss(toastId); // Remove loading toast
  return result; // Return instructor courses (could be empty)
}
