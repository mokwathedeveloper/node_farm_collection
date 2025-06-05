import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import api from '../../services/api';

const OrdersTable = ({ orders }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'processing':
        return <Badge bg="info">Processing</Badge>;
      case 'shipped':
        return <Badge bg="primary">Shipped</Badge>;
      case 'delivered':
        return <Badge bg="success">Delivered</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };
  
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, { status: newStatus });
      // Refresh orders after update
      window.location.reload();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };
  
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order._id}>
            <td>{order._id.substring(0, 8)}...</td>
            <td>{order.user?.name || 'Guest'}</td>
            <td>{formatDate(order.createdAt)}</td>
            <td>${order.totalPrice.toFixed(2)}</td>
            <td>{getStatusBadge(order.status)}</td>
            <td>
              <div className="d-flex gap-1">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleUpdateStatus(order._id, 'processing')}
                  disabled={order.status !== 'pending'}
                >
                  Process
                </Button>
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={() => handleUpdateStatus(order._id, 'shipped')}
                  disabled={order.status !== 'processing'}
                >
                  Ship
                </Button>
                <Button 
                  variant="outline-success" 
                  size="sm"
                  onClick={() => handleUpdateStatus(order._id, 'delivered')}
                  disabled={order.status !== 'shipped'}
                >
                  Deliver
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OrdersTable;
