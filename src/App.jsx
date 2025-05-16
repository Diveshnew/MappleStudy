import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/common/Navbar';
import OpenRoute from './components/core/Auth/OpenRoute';
import Error from './pages/Error';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';

function App() {
  return (
    <div className="flex-1 w-screen bg-[var(--color-richblack-900)] flex flex-col font-[var(--font-inter)]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route
          path="about"
          element={
            <OpenRoute>
              <About />
            </OpenRoute>
          }
        />

        <Route
          path="*"
          element={
            <OpenRoute>
              <Error />
            </OpenRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
