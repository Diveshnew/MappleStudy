import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/core/Dashboard/Sidebar';

function Dashboard() {
  // Get loading states from Redux store for profile and authentication
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const { loading: authLoading } = useSelector((state) => state.auth);

  // If either profile or auth is still loading, show a spinner
  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    // Layout container: vertical on small screens, horizontal on medium and larger
    <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
      {/* Sidebar component for navigation */}
      <Sidebar />

      {/* Main content area with scrolling enabled */}
      <div className="flex-1 overflow-auto">
        {/* Responsive container for the routed child components */}
        <div className="mx-auto w-full max-w-[1000px] py-10 px-4 sm:px-6 lg:px-8">
          <Outlet /> {/* Render nested routes here */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
