// MyProfile component displays the user's profile and personal details
import { RiEditBoxLine } from 'react-icons/ri'; // Icon for edit buttons
import { useSelector } from 'react-redux'; // Hook to access Redux store state
import { useNavigate } from 'react-router-dom'; // Hook to programmatically navigate routes

import { formattedDate } from '../../../utils/dateFormatter'; // Utility to format date strings
import IconBtn from '../../common/IconBtn'; // Reusable icon button component

export default function MyProfile() {
  // Extract the user object from the Redux 'profile' slice
  const { user } = useSelector((state) => state.profile);
  // Get navigation function to redirect user to settings page
  const navigate = useNavigate();

  return (
    <>
      {/* Page title */}
      <h1 className="mb-14 text-3xl font-medium text-[var(--color-richblack-5)]">
        My Profile
      </h1>

      {/* Profile header with picture, name, email, and edit button */}
      <div className="flex items-center justify-between rounded-md border-[1px] border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] p-8 px-12">
        <div className="flex items-center gap-x-4">
          {/* User avatar */}
          <img
            src={user?.image} // Display user's image if available
            alt={`profile-${user?.firstName}`} // Alt text for accessibility
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="space-y-1">
            {/* Full name */}
            <p className="text-lg font-semibold text-[var(--color-richblack-5)]">
              {user?.firstName + ' ' + user?.lastName}
            </p>
            {/* Email address */}
            <p className="text-sm text-[var(--color-richblack-300)]">
              {user?.email}
            </p>
          </div>
        </div>
        {/* Edit profile button navigates to settings */}
        <IconBtn
          text="Edit"
          onclick={() => {
            navigate('/dashboard/settings');
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* Section: About */}
      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-[var(--color-richblack-5)]">
            About
          </p>
          {/* Edit about section button */}
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate('/dashboard/settings');
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        {/* Display user's about text or placeholder if empty */}
        <p
          className={`${
            user?.additionalDetails?.about
              ? 'text-[var(--color-richblack-5)]'
              : 'text-[var(--color-richblack-400)]'
          } text-sm font-medium`}
        >
          {user?.additionalDetails?.about ?? 'Write Something About Yourself'}
        </p>
      </div>

      {/* Section: Personal Details */}
      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-[var(--color-richblack-5)]">
            Personal Details
          </p>
          {/* Edit personal details button */}
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate('/dashboard/settings');
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="flex max-w-[500px] justify-between">
          {/* Left column of details */}
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-[var(--color-richblack-600)]">
                First Name
              </p>
              <p className="text-sm font-medium text-[var(--color-richblack-5)]">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-[var(--color-richblack-600)]">
                Email
              </p>
              <p className="text-sm font-medium text-[var(--color-richblack-5)]">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-[var(--color-richblack-600)]">
                Gender
              </p>
              <p className="text-sm font-medium text-[var(--color-richblack-5)]">
                {user?.additionalDetails?.gender ?? 'Add Gender'}
              </p>
            </div>
          </div>

          {/* Right column of details */}
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-[var(--color-richblack-600)]">
                Last Name
              </p>
              <p className="text-sm font-medium text-[var(--color-richblack-5)]">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-[var(--color-richblack-600)]">
                Phone Number
              </p>
              <p className="text-sm font-medium text-[var(--color-richblack-5)]">
                {user?.additionalDetails?.contactNumber ?? 'Add Contact Number'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-[var(--color-richblack-600)]">
                Date Of Birth
              </p>
              {/* Format date or show placeholder */}
              <p className="text-sm font-medium text-[var(--color-richblack-5)]">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  'Add Date Of Birth'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
