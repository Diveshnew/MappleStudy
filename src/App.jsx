import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './components/common/Navbar';
import OpenRoute from './components/core/Auth/OpenRoute';

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
      </Routes>
    </div>
  );
}

export default App;
