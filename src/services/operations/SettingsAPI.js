import { toast } from 'react-hot-toast';
import { setUser } from '../../slices/profileSlice';
import { apiConnector } from '../apiconnector';
import { settingsEndpoints } from '../apis';
import { logout } from './authAPI';

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

// Helper: show loading toast and return its ID
const showLoading = (message = 'Loading...') => toast.loading(message);

// Helper: handle errors and dismiss toast
const handleError = (toastId, error, fallbackMessage) => {
  console.error(error);
  const message = error?.response?.data?.message || fallbackMessage;
  toast.error(message);
  toast.dismiss(toastId);
};

// Helper: build authorization header
const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

// Thunk: update user display picture
export const updateDisplayPicture = (token, formData) => async (dispatch) => {
  const toastId = showLoading();
  try {
    const response = await apiConnector(
      'PUT',
      UPDATE_DISPLAY_PICTURE_API,
      formData,
      { ...authHeader(token), 'Content-Type': 'multipart/form-data' }
    );

    const { success, data, message } = response.data;
    if (!success) throw new Error(message);

    dispatch(setUser(data));
    toast.success('Display picture updated successfully');
  } catch (error) {
    handleError(toastId, error, 'Could not update display picture');
    return;
  }

  toast.dismiss(toastId);
};

// Thunk: update user profile details
export const updateProfile = (token, formData) => async (dispatch) => {
  const toastId = showLoading();
  try {
    const response = await apiConnector(
      'PUT',
      UPDATE_PROFILE_API,
      formData,
      authHeader(token)
    );

    const { success, data, updatedUserDetails, message } = response.data;
    if (!success) throw new Error(message);

    // Ensure we have a user object to work with
    const userDetails = updatedUserDetails || data;
    const { firstName, lastName, image: existingImage } = userDetails || {};
    const avatar =
      existingImage ||
      `https://api.dicebear.com/5.x/initials/svg?seed=${firstName || ''}+${
        lastName || ''
      }`;

    dispatch(setUser({ ...userDetails, image: avatar }));
    toast.success('Profile updated successfully');
  } catch (error) {
    handleError(toastId, error, 'Could not update profile');
    return;
  }

  toast.dismiss(toastId);
};

// Function: change user password
export const changePassword = async (token, formData) => {
  const toastId = showLoading();
  try {
    const response = await apiConnector(
      'POST',
      CHANGE_PASSWORD_API,
      formData,
      authHeader(token)
    );

    if (!response.data.success) throw new Error(response.data.message);
    toast.success('Password changed successfully');
  } catch (error) {
    handleError(toastId, error, 'Failed to change password');
    return;
  }

  toast.dismiss(toastId);
};

// Thunk: delete user profile
export const deleteProfile = (token, navigate) => async (dispatch) => {
  const toastId = showLoading();
  try {
    const response = await apiConnector(
      'DELETE',
      DELETE_PROFILE_API,
      null,
      authHeader(token)
    );

    if (!response.data.success) throw new Error(response.data.message);

    dispatch(logout(navigate));
    toast.success('Profile deleted successfully');
  } catch (error) {
    handleError(toastId, error, 'Could not delete profile');
    return;
  }

  toast.dismiss(toastId);
};
