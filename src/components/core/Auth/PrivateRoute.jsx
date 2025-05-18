// PrivateRoute component ensures only authenticated users can access certain routes
import { useSelector } from 'react-redux'; // Hook to read state from Redux store
import { Navigate } from 'react-router-dom'; // Component to redirect unauthenticated users

const PrivateRoute = ({ children }) => {
  // Extract authentication token from 'auth' slice in Redux state
  const { token } = useSelector((state) => state.auth);

  // If a valid token exists, render the protected children components
  if (token !== null) return children;
  // If no token, redirect the user to the login page
  else return <Navigate to="/login" />;
};

export default PrivateRoute;
