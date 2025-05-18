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

import MyProfile from './components/core/Dashboard/MyProfile';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="flex-1 w-screen bg-[var(--color-richblack-900)] flex flex-col font-[var(--font-inter)]">
      <Navbar />

      <Routes>
        {/** 1) Public pages (no guard) */}
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />

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
          <Route
            path="dashboard/my-profile"
            element={
              <PrivateRoute>
                <MyProfile />
              </PrivateRoute>
            }
          />
        </Route>

        {/** 4) Catch-all error page */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
