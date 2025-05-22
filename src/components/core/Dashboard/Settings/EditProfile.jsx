import { useForm } from 'react-hook-form'; // For handling form validation and submission
import { useDispatch, useSelector } from 'react-redux'; // To access and dispatch Redux state/actions
import { useNavigate } from 'react-router-dom'; // For programmatic navigation

import { updateProfile } from '../../../../services/operations/SettingsAPI'; // API call to update profile
import IconBtn from '../../../common/IconBtn'; // Custom button component with an icon

// Options for gender dropdown
const genders = ['Male', 'Female', 'Non-Binary', 'Prefer not to say', 'Other'];

export default function EditProfile() {
  // Extracting user data from Redux store
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Used to navigate to other routes
  const dispatch = useDispatch(); // Used to dispatch actions

  // Setting up react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Function to handle form submission
  const submitProfileForm = async (data) => {
    try {
      // Dispatch the profile update action with token and form data
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log('ERROR MESSAGE - ', error.message);
    }
  };

  return (
    <>
      {/* Main Form */}
      <form onSubmit={handleSubmit(submitProfileForm)}>
        {/* Section container */}
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] p-8 px-12">
          <h2 className="text-lg font-semibold text-[var(--color-richblack-5)]">
            Profile Information
          </h2>

          {/* First Name & Last Name Fields */}
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* First Name */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="firstName" className="lable-style">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter first name"
                className="form-style"
                {...register('firstName', { required: true })}
                defaultValue={user?.firstName}
              />
              {errors.firstName && (
                <span className="-mt-1 text-[12px] text-[var(--color-yellow-100)]">
                  Please enter your first name.
                </span>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="lastName" className="lable-style">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter first name"
                className="form-style"
                {...register('lastName', { required: true })}
                defaultValue={user?.lastName}
              />
              {errors.lastName && (
                <span className="-mt-1 text-[12px] text-[var(--color-yellow-100)]">
                  Please enter your last name.
                </span>
              )}
            </div>
          </div>

          {/* DOB & Gender Fields */}
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* Date of Birth */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="dateOfBirth" className="lable-style">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                className="form-style"
                {...register('dateOfBirth', {
                  required: {
                    value: true,
                    message: 'Please enter your Date of Birth.',
                  },
                  max: {
                    value: new Date().toISOString().split('T')[0],
                    message: 'Date of Birth cannot be in the future.',
                  },
                })}
                defaultValue={user?.additionalDetails?.dateOfBirth}
              />
              {errors.dateOfBirth && (
                <span className="-mt-1 text-[12px] text-[var(--color-yellow-100)]">
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>

            {/* Gender Dropdown */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="gender" className="lable-style">
                Gender
              </label>
              <select
                type="text"
                name="gender"
                id="gender"
                className="form-style"
                {...register('gender', { required: true })}
                defaultValue={user?.additionalDetails?.gender}
              >
                {genders.map((ele, i) => (
                  <option key={i} value={ele}>
                    {ele}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <span className="-mt-1 text-[12px] text-[var(--color-yellow-100)]">
                  Please enter your Date of Birth.
                </span>
              )}
            </div>
          </div>

          {/* Contact Number & About Fields */}
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* Contact Number */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="contactNumber" className="lable-style">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                id="contactNumber"
                placeholder="Enter Contact Number"
                className="form-style"
                {...register('contactNumber', {
                  required: {
                    value: true,
                    message: 'Please enter your Contact Number.',
                  },
                  maxLength: { value: 12, message: 'Invalid Contact Number' },
                  minLength: { value: 10, message: 'Invalid Contact Number' },
                })}
                defaultValue={user?.additionalDetails?.contactNumber}
              />
              {errors.contactNumber && (
                <span className="-mt-1 text-[12px] text-[var(--color-yellow-100)]">
                  {errors.contactNumber.message}
                </span>
              )}
            </div>

            {/* About/Bio */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="about" className="lable-style">
                About
              </label>
              <input
                type="text"
                name="about"
                id="about"
                placeholder="Enter Bio Details"
                className="form-style"
                {...register('about', { required: true })}
                defaultValue={user?.additionalDetails?.about}
              />
              {errors.about && (
                <span className="-mt-1 text-[12px] text-[var(--color-yellow-100)]">
                  Please enter your About.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Buttons: Cancel and Save */}
        <div className="flex justify-end gap-2">
          {/* Cancel button navigates back to profile page */}
          <button
            onClick={() => {
              navigate('/dashboard/my-profile');
            }}
            className="cursor-pointer rounded-md bg-[var(--color-richblack-700)] py-2 px-5 font-semibold text-[var(--color-richblack-50)]"
          >
            Cancel
          </button>
          {/* Submit button to save changes */}
          <IconBtn type="submit" text="Save" />
        </div>
      </form>
    </>
  );
}
