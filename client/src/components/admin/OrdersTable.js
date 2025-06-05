import React, { useState } from 'react';
import { Table, Badge, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import api from '../../services/api';

const OrdersTable = ({ orders, onOrderUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toString().includes(searchTerm) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      return sortDirection === 'asc' 
        ? new Date(a[sortField]) - new Date(b[sortField])
        : new Date(b[sortField]) - new Date(a[sortField]);
    } else if (sortField === 'total') {
      return sortDirection === 'asc' 
        ? a.total - b.total
        : b.total - a.total;
    } else {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      return sortDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    }
  });
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };
  
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await api.updateOrderStatus(orderId, { status: newStatus });
      onOrderUpdated(response.data.data.order);
      
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus
        });
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      // You could add error handling here
    }
  };
  
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
  
  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  return (
    <>
      <div className="mb-3 d-flex gap-3">
        <InputGroup className="flex-grow-1">
          <Form.Control
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button 
              variant="outline-secondary" 
              onClick={() => setSearchTerm('')}
            >
              Clear
            </Button>
          )}
        </InputGroup>
        
        <Form.Select 
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </Form.Select>
      </div>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('orderNumber')} style={{cursor: 'pointer'}}>
              Order # {getSortIcon('orderNumber')}
            </th>
            <th onClick={() => handleSort('customer.name')} style={{cursor: 'pointer'}}>
              Customer {getSortIcon('customer.name')}
            </th>
            <th onClick={() => handleSort('total')} style={{cursor: 'pointer'}}>
              Total {getSortIcon('total')}
            </th>
            <th onClick={() => handleSort('status')} style={{cursor: 'pointer'}}>
              Status {getSortIcon('status')}
            </th>
            <th onClick={() => handleSort('createdAt')} style={{cursor: 'pointer'}}>
              Date {getSortIcon('createdAt')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.length > 0 ? (
            sortedOrders.map(order => (
              <tr key={order._id}>
                <td>#{order.orderNumber || order._id.slice(-6)}</td>
                <td>{order.customer?.name || 'N/A'}</td>
                <td>${order.total?.toFixed(2) || '0.00'}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      Details
                    </Button>
                    <Form.Select 
                      size="sm" 
                      style={{ width: 'auto' }}
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-3">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No orders match your search criteria' 
                  : 'No orders available'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      
      {/* Order Details Modal */}
      <Modal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Order #{selectedOrder?.orderNumber || (selectedOrder?._id?.slice(-6))}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <h5>Customer Information</h5>
                  <p className="mb-1"><strong>Name:</strong> {selectedOrder.customer?.name}</p>
                  <p className="mb-1"><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                  <p className="mb-1"><strong>Phone:</strong> {selectedOrder.customer?.phone || 'N/A'}</p>
                </div>
                <div>
                  <h5>Order Information</h5>
                  <p className="mb-1"><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p className="mb-1"><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
                  <p className="mb-1"><strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'N/A'}</p>
                </div>
              </div>
              
              <h5>Shipping Address</h5>
              <p className="mb-3">
                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}, {selectedOrder.shippingAddress?.country}
              </p>
              
              <h5>Order Items</h5>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product?.name || item.productName || 'Unknown Product'}</td>
                      <td>${item.price?.toFixed(2) || '0.00'}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                    <td>${selectedOrder.subtotal?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Shipping:</strong></td>
                    <td>${selectedOrder.shippingCost?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Tax:</strong></td>
                    <td>${selectedOrder.tax?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                    <td><strong>${selectedOrder.total?.toFixed(2) || '0.00'}</strong></td>
                  </tr>
                </tfoot>
              </Table>
              
              {selectedOrder.notes && (
                <>
                  <h5>Order Notes</h5>
                  <p>{selectedOrder.notes}</p>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {selectedOrder && (
            <Form.Select 
              style={{ width: 'auto' }}
              value={selectedOrder.status}
              onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrdersTable;
