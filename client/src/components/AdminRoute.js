import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { Spinner } from 'react-bootstrap';

const AdminRoute = ({ children }) => {
  const { isAdmin, adminLoading } = useContext(AdminContext);

  if (adminLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminRoute;