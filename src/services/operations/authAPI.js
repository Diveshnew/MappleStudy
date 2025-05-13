import { toast } from 'react-hot-toast';
import { setLoading, setToken } from '../../slices/authSlice';
import { resetCart } from '../../slices/cartSlice';
import { setUser } from '../../slices/profileSlice';
import { apiConnector } from '../apiconnector';
import { endpoints } from '../apis';

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

// Helper to standardize loading/toast behavior
async function withLoading(dispatch, asyncFn) {
  const toastId = toast.loading('Loading...');
  dispatch(setLoading(true));

  try {
    const result = await asyncFn();
    return result;
  } finally {
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  }
}

// Automatically throws if success !== true
async function requestOrThrow(method, url, body) {
  const response = await apiConnector(method, url, body);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data;
}

export function sendOtp(email, navigate) {
  return async (dispatch) =>
    withLoading(dispatch, async () => {
      const data = await requestOrThrow('POST', SENDOTP_API, {
        email,
        checkUserPresent: true,
      });
      toast.success('OTP Sent Successfully');
      navigate('/verify-email');
      return data;
    }).catch((err) => {
      console.error('SENDOTP error:', err);
      toast.error(err.message || 'Could not send OTP');
    });
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) =>
    withLoading(dispatch, async () => {
      await requestOrThrow('POST', SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });
      toast.success('Signup Successful');
      navigate('/login');
    }).catch((err) => {
      console.error('SIGNUP error:', err);
      toast.error(err.message || 'Signup Failed');
      navigate('/signup');
    });
}

export function login(email, password, navigate) {
  return async (dispatch) =>
    withLoading(dispatch, async () => {
      const data = await requestOrThrow('POST', LOGIN_API, { email, password });
      toast.success('Login Successful');

      dispatch(setToken(data.token));
      const userImage =
        data.user.image ||
        `https://api.dicebear.com/5.x/initials/svg?seed=${data.user.firstName}${data.user.lastName}`;
      dispatch(setUser({ ...data.user, image: userImage }));

      localStorage.setItem('token', JSON.stringify(data.token));
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard/my-profile');
      return data;
    }).catch((err) => {
      console.error('LOGIN error:', err);
      toast.error(err.message || 'Login Failed');
    });
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged Out');
    navigate('/');
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) =>
    withLoading(dispatch, async () => {
      await requestOrThrow('POST', RESETPASSTOKEN_API, { email });
      toast.success('Reset Email Sent');
      setEmailSent(true);
    }).catch((err) => {
      console.error('RESET TOKEN error:', err);
      toast.error(err.message || 'Failed to send reset email');
    });
}

export function resetPassword(password, confirmPassword, token) {
  return async (dispatch) =>
    withLoading(dispatch, async () => {
      await requestOrThrow('POST', RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });
      toast.success('Password has been reset successfully');
    }).catch((err) => {
      console.error('RESET PASSWORD error:', err);
      toast.error(err.message || 'Unable to reset password');
    });
}
