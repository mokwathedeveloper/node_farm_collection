import React, { useState } from 'react';
import { Table, Button, Badge, Form, InputGroup, Modal } from 'react-bootstrap';
import api from '../../services/api';

const UsersTable = ({ users, onUserUpdated, onUserDeleted }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === 'createdAt') {
      return sortDirection === 'asc' 
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
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
  
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await api.deleteUser(userToDelete._id);
      onUserDeleted(userToDelete._id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting user:', err);
      // You could add error handling here
    }
  };
  
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge bg="danger">Admin</Badge>;
      case 'customer':
        return <Badge bg="success">Customer</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
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
            placeholder="Search users..."
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
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </Form.Select>
      </div>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} style={{cursor: 'pointer'}}>
              Name {getSortIcon('name')}
            </th>
            <th onClick={() => handleSort('email')} style={{cursor: 'pointer'}}>
              Email {getSortIcon('email')}
            </th>
            <th onClick={() => handleSort('username')} style={{cursor: 'pointer'}}>
              Username {getSortIcon('username')}
            </th>
            <th onClick={() => handleSort('role')} style={{cursor: 'pointer'}}>
              Role {getSortIcon('role')}
            </th>
            <th onClick={() => handleSort('createdAt')} style={{cursor: 'pointer'}}>
              Joined {getSortIcon('createdAt')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.length > 0 ? (
            sortedUsers.map(user => (
              <tr key={user._id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{getRoleBadge(user.role)}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => onUserUpdated(user)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteClick(user)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-3">
                {searchTerm || roleFilter !== 'all' 
                  ? 'No users match your search criteria' 
                  : 'No users available'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the user <strong>{userToDelete?.name || userToDelete?.email}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersTable;
