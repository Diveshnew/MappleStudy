import { FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { deleteProfile } from '../../../../services/operations/SettingsAPI';

export default function DeleteAccount() {
  // Extract the authentication token from Redux state
  const { token } = useSelector((state) => state.auth);
  // Get dispatch function to send actions
  const dispatch = useDispatch();
  // Hook to navigate to different routes
  const navigate = useNavigate();

  // Handler invoked when user confirms deletion
  async function handleDeleteAccount() {
    try {
      // Dispatch the deleteProfile action with token and navigate callback
      dispatch(deleteProfile(token, navigate));
    } catch (error) {
      // Log any errors during the deletion process
      console.log('ERROR MESSAGE - ', error.message);
    }
  }

  return (
    <>
      {/* Container for the delete account section */}
      <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-[var(--color-pink-700)] bg-[var(--color-pink-900)] p-8 px-12">
        {/* Icon wrapper */}
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-[var(--color-pink-700)]">
          {/* Trash icon indicating deletion */}
          <FiTrash2 className="text-3xl text-[var(--color-pink-200)]" />
        </div>
        {/* Text and action section */}
        <div className="flex flex-col space-y-2">
          {/* Section title */}
          <h2 className="text-lg font-semibold text-[var(--color-richblack-5)]">
            Delete Account
          </h2>
          {/* Warning message about consequences of deletion */}
          <div className="w-3/5 text-[var(--color-pink-25)]">
            <p>Would you like to delete account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the content associated with it.
            </p>
          </div>
          {/* Action button to confirm account deletion */}
          <button
            type="button"
            className="w-fit cursor-pointer italic text-[var(--color-pink-300)]"
            onClick={handleDeleteAccount} // Trigger delete handler
          >
            I want to delete my account.
          </button>
        </div>
      </div>
    </>
  );
}
