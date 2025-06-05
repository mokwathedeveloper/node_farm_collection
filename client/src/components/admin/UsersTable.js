import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import api from '../../services/api';

const UsersTable = ({ users, onUserDeleted }) => {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge bg="danger">Admin</Badge>;
      case 'user':
        return <Badge bg="primary">User</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
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
  
  const handleDelete = async (userId) => {
    // Don't allow deleting yourself
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && currentUser._id === userId) {
      alert("You cannot delete your own account!");
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(userId);
        onUserDeleted(userId);
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user. Please try again.');
      }
    }
  };
  
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Joined</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{getRoleBadge(user.role)}</td>
            <td>{formatDate(user.createdAt)}</td>
            <td>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => handleDelete(user._id)}
                disabled={user.role === 'admin'}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UsersTable;
