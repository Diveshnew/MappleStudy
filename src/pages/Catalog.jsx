// Importing necessary hooks and libraries
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// Importing components used in the catalog page
import Footer from '../components/common/Footer';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import Error from './Error';

// Catalog component displays all courses under a selected category
const Catalog = () => {
  // Accessing loading state from Redux store
  const { loading } = useSelector((state) => state.profile);
  // Extracting the catalog name from the URL parameters
  const { catalogName } = useParams();

  // State to determine if the category exists or not
  const [noSuchCategory, setNoSuchCategory] = useState(false);
  // State to store the MongoDB ObjectId of the matched category
  const [categoryId, setCategoryId] = useState('');
  // State to store data fetched from the backend for this catalog
  const [catalogPageData, setCatalogPageData] = useState(null);
  // State to track active tab (Most Popular or New)
  const [active, setActive] = useState(1);

  // 1) Fetch list of all categories to match the current catalog name (slug)
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await apiConnector('GET', categories.CATEGORIES_API);
        const allCats = res?.data?.allCategories || [];
        // Find category by comparing slug format
        const matched = allCats.find(
          (ct) => ct.name.split(' ').join('-').toLowerCase() === catalogName
        );
        // If no category matched, set flag
        if (!matched) {
          setNoSuchCategory(true);
          setCategoryId('');
        } else {
          setNoSuchCategory(false);
          setCategoryId(matched._id);
        }
      } catch (err) {
        // Handle API errors
        console.error('Error fetching categories:', err);
        setNoSuchCategory(true);
        setCategoryId('');
      }
    };
    getCategories();
  }, [catalogName]);

  // 2) Once categoryId is available, fetch catalog page data
  useEffect(() => {
    if (!categoryId) return;
    const getCategoryDetails = async () => {
      try {
        const res = await getCatalogPageData(categoryId);
        console.log('Printing Res: ', res);
        setCatalogPageData(res);
      } catch (error) {
        console.log('Error fetching catalog page data:', error);
      }
    };
    getCategoryDetails();
  }, [categoryId]);

  // ────── Conditional Rendering Logic ──────

  // If the provided catalog slug is invalid, show 404-style error component
  if (noSuchCategory) {
    return <Error />;
  }

  // While waiting for backend data, show loading spinner
  if (!catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // If backend explicitly returned success = false, treat it as an error
  if (catalogPageData.success === false) {
    return <Error />;
  }

  // Ensure arrays are present, fallback to empty arrays if missing
  const selectedCourses = catalogPageData?.selectedCourses || [];
  const differentCourses = catalogPageData?.differentCourses || [];
  const mostSellingCourses = catalogPageData?.mostSellingCourses || [];

  return (
    <>
      {/* Hero section with breadcrumb and catalog name */}
      <div className="box-content bg-[var(--color-richblack-800)]">
        <div className="w-full max-w-[var(--maxwidth-maxContent)] mx-auto px-4 flex min-h-[260px] flex-col justify-center gap-4">
          <p className="text-sm text-[var(--color-richblack-300)]">
            Home / Catalog /{' '}
            <span className="text-[var(--color-yellow-25)]">
              {catalogName.replace('-', ' ')}
            </span>
          </p>
          <p className="text-3xl text-[var(--color-richblack-5)]">
            {catalogName.replace('-', ' ')}
          </p>
        </div>
      </div>

      {/* Main content area, constrained to max width */}
      <div className="w-full max-w-[var(--maxwidth-maxContent)] mx-auto px-4">
        {/* Section 1: Featured course selection */}
        <div className="py-12">
          <div className="section_heading">Courses to get you started</div>
          {/* Tab UI to toggle Most Popular vs New */}
          <div className="my-4 flex border-b border-b-[var(--color-richblack-600)] text-sm">
            <p
              className={`px-4 py-2 ${
                active === 1
                  ? 'border-b border-b-[var(--color-yellow-25)] text-[var(--color-yellow-25)]'
                  : 'text-[var(--color-richblack-50)]'
              } cursor-pointer`}
              onClick={() => setActive(1)}
            >
              Most Popular
            </p>
            <p
              className={`px-4 py-2 ${
                active === 2
                  ? 'border-b border-b-[var(--color-yellow-25)] text-[var(--color-yellow-25)]'
                  : 'text-[var(--color-richblack-50)]'
              } cursor-pointer`}
              onClick={() => setActive(2)}
            >
              New
            </p>
          </div>
          {/* Course slider component displaying selected courses */}
          <CourseSlider Courses={selectedCourses} />
        </div>

        {/* Section 2: Highlighting other categories' top courses */}
        <div className="py-12">
          <div className="section_heading">
            Top courses in some other category
          </div>
          <div className="py-8">
            <CourseSlider Courses={differentCourses} />
          </div>
        </div>

        {/* Section 3: Frequently bought courses */}
        <div className="py-12">
          <div className="section_heading">Frequently Bought</div>
          <div className="py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Render up to 4 most selling course cards */}
              {mostSellingCourses.slice(0, 4).map((course, i) => (
                <Course_Card course={course} key={i} Height={'h-[400px]'} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Footer component at the bottom of the page */}
      <Footer />
    </>
  );
};

// Exporting the Catalog component
export default Catalog;
