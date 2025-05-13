// ProfileDropdown component: shows user avatar with a dropdown menu for Dashboard and Logout
import React, { useRef, useState } from 'react';
import { AiOutlineCaretDown } from 'react-icons/ai';
import { VscDashboard, VscSignOut } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

// Custom hook to detect clicks outside the dropdown and close it
import useOnClickOutside from '../../../hooks/useOnClickOutside';
// Logout API operation
import { logout } from '../../../services/operations/authAPI';

// Memoized component to avoid unnecessary re-renders when props/state don't change
const ProfileDropdown = React.memo(function ProfileDropdown() {
  // Get current user from Redux store
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Dropdown open state and ref for click-outside detection
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useOnClickOutside(ref, () => setOpen(false));

  // If user data is not ready, don't render the dropdown
  if (!user) return null;

  // Render either profile image or initials fallback avatar
  const renderAvatar = () => {
    if (user.image) {
      return (
        <img
          src={user.image}
          alt={`profile-${user.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
      );
    } else {
      // Compute initials from first and last name
      const initials = `${user.firstName?.[0] || ''}${
        user.lastName?.[0] || ''
      }`;
      return (
        <div className="aspect-square w-[30px] rounded-full bg-[var(--color-richblack-700)] flex items-center justify-center text-sm font-medium text-[var(--color-richblack-25)]">
          {initials.toUpperCase()}
        </div>
      );
    }
  };

  return (
    // Button toggles the dropdown open state
    <button
      className="relative"
      onClick={() => setOpen(true)}
      aria-haspopup="menu"
      aria-expanded={open}
    >
      <div className="flex items-center gap-x-1">
        {renderAvatar()} {/* Show avatar or initials */}
        <AiOutlineCaretDown className="text-sm text-[var(--color-richblack-100)]" />
      </div>

      {/* Dropdown menu, only rendered when open */}
      {open && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-[var(--color-richblack-700)] overflow-hidden rounded-md border-[1px] border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)]"
          role="menu"
        >
          {/* Dashboard link with active styling */}
          <NavLink
            to="/dashboard/my-profile"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm hover:bg-[var(--color-richblack-700)] hover:text-[var(--color-richblack-25)] ${
                isActive
                  ? 'text-[var(--color-yellow-50)]' // Highlight when active
                  : 'text-[var(--color-richblack-100)]'
              }`
            }
            role="menuitem"
            aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          >
            <VscDashboard className="text-lg" />
            Dashboard
          </NavLink>

          {/* Logout option triggers API call and closes dropdown */}
          <div
            onClick={() => {
              dispatch(logout(navigate));
              setOpen(false);
            }}
            className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-[var(--color-richblack-100)] hover:bg-[var(--color-richblack-700)] hover:text-[var(--color-richblack-25)]"
            role="menuitem"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
  );
});

export default ProfileDropdown;
