import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';

import Navbar from './components/common/Navbar';
import OpenRoute from './components/core/Auth/OpenRoute';
import PrivateRoute from './components/core/Auth/PrivateRoute';

import About from './pages/About';
import Error from './pages/Error';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';

import Cart from './components/core/Dashboard/Cart';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import MyProfile from './components/core/Dashboard/MyProfile';
import Settings from './components/core/Dashboard/Settings';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import { ACCOUNT_TYPE } from './utils/constants';
import MyCourses from './components/core/Dashboard/MyCourses';
import AddCourse from './components/core/Dashboard/AddCourse';
import EditCourse from './components/core/Dashboard/EditCourse';
import Catalog from './pages/Catalog';

function App() {
  const { user } = useSelector((state) => state.profile);
  return (
    <div className="flex-1 w-screen bg-[var(--color-richblack-900)] flex flex-col font-[var(--font-inter)]">
      <Navbar />

      <Routes>
        {/** 1) Public pages (no guard) */}
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />

        {/** 2) Unauthenticated-only pages */}
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        {/** 3) Protected dashboard page */}
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings />} />
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
            </>
          )}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              {/* <Route path="dashboard/instructor" element={<Instructor />} /> */}
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        </Route>

        {/** 4) Catch-all error page */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
