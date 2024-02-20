import PropTypes from 'prop-types';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingPage from '../pages/LoadingPage';

const ProtectedRoute = ({ children }) => {
    const { isLoading, isAuthenticated } = useAuth0();
    const location = useLocation();
    const [isConnected, setIsConnected] = useState(false);
    const [isCheckingConnection, setIsCheckingConnection] = useState(true);

    // Check mongo connection
    useEffect(() => {
      const checkConnection = async () => {
          try {
              const response = await axios.get(`${import.meta.env.VITE_API_URL}/health`);
              setIsConnected(response.status === 200);
          } catch (error) {
              console.error('Failed to connect to backend:', error);
              setIsConnected(false);
          } finally {
              setIsCheckingConnection(false);
          }
      };

      checkConnection();
  }, []);

    // If auth0 loading or checking backend connection, display loading page
    if (isLoading || isCheckingConnection) {
        return <LoadingPage />;
    }

    // If not connected to backend, redirect to error page
    if(!isConnected && !isCheckingConnection) {
        return <Navigate to="/error" replace state={{ from: location }} />;
    }
    
    // If not authenticated by auth0, redirect to login page
    if (!isAuthenticated) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }
    
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;