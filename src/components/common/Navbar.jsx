// Import necessary libraries and components
import React, { useEffect, useState } from 'react';
import { AiOutlineMenu, AiOutlineShoppingCart } from 'react-icons/ai';
import { BsChevronDown } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import logo from '../../assets/Logo/Logo-Full-Light.png';
import { NavbarLinks } from '../../data/navbar-links';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { ACCOUNT_TYPE } from '../../utils/constants';

function Navbar() {
  // Access auth and profile data from Redux store
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  // Get current URL path
  const location = useLocation();

  // Component state
  const [subLinks, setSubLinks] = useState([]); // For dynamic category dropdown
  const [loading, setLoading] = useState(false); // To handle loading state while fetching categories
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile menu toggle state

  // Fetch category data on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await apiConnector('GET', categories.CATEGORIES_API);
        // Check if the response is an array before setting it
        setSubLinks(
          Array.isArray(res.data.allCategories) ? res.data.allCategories : []
        );
      } catch (error) {
        console.error('Could not fetch Categories.', error);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  // Function to check if current route matches
  const matchRoute = (route) => {
    if (route === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(route);
  };

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Header Navbar */}
      <header className="bg-[var(--color-richblack-800)] z-50 shadow-lg">
        {/* Black strip above with logo and main menu */}
        <div className="flex items-center justify-center bg-[var(--color-black)] border-b border-b-[var(--color-richblack-800)]">
          <div className="flex flex-col md:flex-row w-full max-w-[var(--maxwidth-maxContent)] items-center justify-between px-4 py-2">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center justify-between w-full md:w-auto px-1 py-1">
              <Link to="/" onClick={closeMobileMenu}>
                <img
                  src={logo}
                  alt="Logo"
                  width={170}
                  height={32}
                  loading="lazy"
                />
              </Link>

              {/* Hamburger menu button for mobile */}
              <button
                className="block md:hidden text-2xl text-[var(--color-richblack-25)] focus:outline-none"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? '✖' : <AiOutlineMenu />}
              </button>
            </div>

            {/* Navigation Links (Responsive) */}
            <nav
              className={`${
                mobileMenuOpen ? 'block' : 'hidden'
              } md:block mt-4 md:mt-0 relative overflow-visible`}
            >
              <ul className="flex flex-col md:flex-row items-center gap-6">
                {NavbarLinks.map(({ title, path }, idx) => (
                  <li key={idx} className="relative group">
                    {/* Special handling for 'Catalog' with dropdown */}
                    {title === 'Catalog' ? (
                      <div className="flex items-center cursor-pointer gap-1 text-[var(--color-white)] group-hover:text-[var(--color-yellow-25)] transition-colors">
                        <span className="flex items-center">
                          {title}
                          <BsChevronDown className="ml-1" />
                        </span>

                        {/* Dropdown with category links */}
                        <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2 w-56 bg-[var(--color-richblack-5)] border border-[var(--color-richblack-700)] rounded-lg shadow-lg p-4 text-[var(--color-richblack-900)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-auto">
                          {/* Triangle pointer on top */}
                          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-4 h-4 bg-[var(--color-richblack-5)] rotate-45 -mt-2" />
                          {/* Show loading or category links */}
                          {loading ? (
                            <p>Loading...</p>
                          ) : subLinks.length ? (
                            subLinks.map((cat, i) => (
                              <Link
                                key={i}
                                to={`/catalog/${cat.name
                                  .split(' ')
                                  .join('-')
                                  .toLowerCase()}`}
                                className="block py-2 px-3 hover:bg-[var(--color-yellow-50)] rounded"
                                onClick={closeMobileMenu}
                              >
                                {cat.name}
                              </Link>
                            ))
                          ) : (
                            <p>No Categories Found</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Normal link for non-catalog items
                      <Link
                        to={path}
                        onClick={closeMobileMenu}
                        className="relative group"
                      >
                        <p
                          className={`
                            ${
                              matchRoute(path)
                                ? 'text-[var(--color-yellow-25)]'
                                : 'text-white'
                            }
                            after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-[var(--color-yellow-25)] after:w-0 after:transition-all after:duration-500 after:ease-in-out group-hover:after:w-full transition-colors
                          `}
                        >
                          {title}
                        </p>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right-side Buttons: Cart, Auth, Profile */}
            <div
              className={`${
                mobileMenuOpen ? 'block' : 'hidden'
              } md:flex items-center gap-4 mt-4 md:mt-0`}
            >
              {/* Show cart only for students */}
              {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <Link to="/dashboard/cart" className="relative">
                  <AiOutlineShoppingCart className="text-2xl text-white" />
                  {/* Badge with item count */}
                  {totalItems > 0 && (
                    <span className="absolute -bottom-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {/* Show login/signup if not authenticated */}
              {!token ? (
                <>
                  <Link to="/login" onClick={closeMobileMenu}>
                    <button className="px-4 py-2 bg-[var(--color-richblack-800)] text-[var(--color-white)] rounded transition duration-300 transform hover:scale-105 hover:shadow-lg">
                      Log In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <button className="px-4 py-2 bg-[var(--color-richblack-800)] text-[var(--color-white)] rounded transition duration-300 transform hover:scale-105 hover:shadow-lg">
                      Sign Up
                    </button>
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
