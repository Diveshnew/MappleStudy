import * as Icons from 'react-icons/vsc';
import { useDispatch } from 'react-redux';
import { NavLink, matchPath, useLocation } from 'react-router-dom';

import { resetCourseState } from '../../../slices/courseSlice';

// SidebarLink component renders a navigational link with an icon and active styling
export default function SidebarLink({ link, iconName }) {
  // Dynamically get the icon component based on the iconName prop
  const Icon = Icons[iconName];
  // Get current location to determine active route
  const location = useLocation();
  // Setup dispatch to trigger redux actions
  const dispatch = useDispatch();

  // Helper function to check if the given route matches current pathname
  const matchRoute = (route) => matchPath({ path: route }, location.pathname);

  return (
    <NavLink
      to={link.path}
      // Reset course state on every navigation click
      onClick={() => dispatch(resetCourseState())}
      // Apply active/inactive styles based on route match
      className={`relative px-8 py-2 text-sm font-medium transition-all duration-200 ${
        matchRoute(link.path)
          ? 'bg-[var(--color-yellow-800)] text-[var(--color-yellow-50)]'
          : 'bg-opacity-0 text-[var(--color-richblack-300)]'
      }`}
    >
      {/* Highlight bar on active link */}
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem] bg-[var(--color-yellow-50)] ${
          matchRoute(link.path) ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Icon and link text */}
      <div className="flex items-center gap-x-2">
        <Icon className="text-lg" />
        <span>{link.name}</span>
      </div>
    </NavLink>
  );
}
