import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { changePassword } from '../../../../services/operations/SettingsAPI'; // API call to change password
import IconBtn from '../../../common/IconBtn'; // Custom button component with icon

export default function UpdatePassword() {
  // Get auth token from Redux store
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Hook to navigate programmatically

  // States to toggle password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // useForm hook to manage form state and validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Submit handler for the password update form
  const submitPasswordForm = async (data) => {
    try {
      await changePassword(token, data); // Call API to change password
    } catch (error) {
      console.log('ERROR MESSAGE - ', error.message); // Log error if any
    }
  };

  return (
    <>
      {/* Password update form */}
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] p-8 px-12">
          <h2 className="text-lg font-semibold text-[var(--color-richblack-5)]">
            Password
          </h2>

          {/* Input fields for current and new password */}
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* Current Password Field */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="oldPassword" className="lable-style">
                Current Password
              </label>
              <input
                type={showOldPassword ? 'text' : 'password'} // Toggle input type
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter Current Password"
                className="form-style"
                {...register('oldPassword', { required: true })} // Register field with validation
              />
              <span
                onClick={() => setShowOldPassword((prev) => !prev)} // Toggle show/hide password
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.oldPassword && (
                <span className="-mt-1 text-[12px] text-[var(--color-yellow-100)]">
                  Please enter your Current Password.
                </span>
              )}
            </div>

            {/* New Password Field */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="newPassword" className="lable-style">
                New Password
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'} // Toggle input type
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
                className="form-style"
                {...register('newPassword', { required: true })} // Register field with validation
              />
              <span
                onClick={() => setShowNewPassword((prev) => !prev)} // Toggle show/hide password
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.newPassword && (
                <span className="-mt-1 text-[12px] text-[var(--color-yellow-100)]">
                  Please enter your New Password.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          {/* Cancel button to navigate back */}
          <button
            onClick={() => {
              navigate('/dashboard/my-profile');
            }}
            className="cursor-pointer rounded-md bg-[var(--color-richblack-700)] py-2 px-5 font-semibold text-[var(--color-richblack-50)]"
          >
            Cancel
          </button>
          {/* Submit button with custom icon */}
          <IconBtn type="submit" text="Update" />
        </div>
      </form>
    </>
  );
}
