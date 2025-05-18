import { useState } from 'react';
import { VscSignOut } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { sidebarLinks } from '../../../data/dashboard-links';
import { logout } from '../../../services/operations/authAPI';
import ConfirmationModal from '../../common/ConfirmationModal';
import SidebarLink from './SidebarLink';

// Sidebar component renders navigation links and logout functionality
export default function Sidebar() {
  // Extract user profile and loading state from redux store
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  // Extract authentication loading state from redux store
  const { loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Dispatch actions to redux
  const navigate = useNavigate(); // Navigate between routes
  const [confirmationModal, setConfirmationModal] = useState(null); // State to control logout confirmation modal

  // Show a spinner while profile or auth data is loading
  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] md:sticky md:top-0">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* Main Sidebar Container */}
      <div
        className="
           flex
           min-w-[220px]
           flex-col
           justify-between
           border-r-[1px]
           border-r-[var(--color-richblack-700)]
           bg-[var(--color-richblack-800)]
           pt-10
           md:sticky
           md:top-[3.5rem]   /* sit just below header */
           md:bottom-0       /* stick to bottom */
           overflow-y-auto   /* enable scrolling if content overflows */
        "
      >
        {/* 1) Top Section: Dynamic Links Based on User Role */}
        <div className="flex flex-col space-y-1">
          {sidebarLinks.map((link) => {
            // Filter links by account type if specified
            if (link.type && user?.accountType !== link.type) return null;
            // Render SidebarLink component for each valid link
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            );
          })}
        </div>

        {/* 2) Bottom Section: Divider, Settings, and Logout */}
        <div className="mt-auto flex flex-col items-center space-y-4 w-full">
          {/* Horizontal divider */}
          <div className="h-px w-10/12 bg-[var(--color-richblack-700)]" />

          {/* Settings link */}
          <SidebarLink
            link={{ name: 'Settings', path: '/dashboard/settings' }}
            iconName="VscSettingsGear"
          />

          {/* Logout button triggers confirmation modal */}
          <button
            onClick={() =>
              setConfirmationModal({
                text1: 'Are you sure?',
                text2: 'You will be logged out of your account.',
                btn1Text: 'Logout',
                btn2Text: 'Cancel',
                // Logout handler dispatches logout action and redirects
                btn1Handler: () => dispatch(logout(navigate)),
                // Cancel handler closes the modal
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-4 py-2 text-sm font-medium text-[var(--color-richblack-300)]"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for logout action */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
