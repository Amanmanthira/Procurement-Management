import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Spinner, Modal, Form } from 'react-bootstrap';
import Sidebar from '../../components/admin/Sidebar';
import NavBar from '../../components/admin/NavBar';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { fetchUser, deleteUser, updateUser } from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchUser();
        setUsers(userData);
      } catch (err) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Open modal for editing user
  const handleEdit = (user) => {
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setEditingUser(user);
    setShowModal(true);
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      await updateUser(editingUser._id, userForm);
      setUsers(users.map((user) =>
        user._id === editingUser._id ? { ...user, ...userForm } : user
      ));
      setShowModal(false);
      setSuccess(true);
    } catch (err) {
      setError(`Error updating user: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user._id !== id));
        setSuccess(true);
      } catch (err) {
        setError(`Error deleting user: ${err.message}`);
      }
    }
  };

  return (
    <Container fluid className="p-0 bg-gradient-to-r from-[#dce2ec] to-[#0a40ac] h-screen">
      <NavBar />
      <Row className="d-flex h-100 mt-5 pt-5">
        <Col xs={12} sm={4} md={3} lg={2} className="sidebar position-fixed">
          <Sidebar />
        </Col>

        <Col xs={12} sm={8} md={9} lg={10} className="ml-auto p-4">
          <h3 className="mb-4 text-blue-900">Manage Users</h3>
          {loading ? (
            <Spinner animation="border" />
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <Table striped bordered hover className="min-w-full text-center">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                        <th className="py-3 px-5 text-sm font-semibold">Name</th>
                        <th className="py-3 px-5 text-sm font-semibold">Email</th>
                        <th className="py-3 px-5 text-sm font-semibold">Role</th>
                        <th className="py-3 px-5 text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-100 transition-colors duration-300">
                            <td className="py-3 px-5 text-sm">{user.name}</td>
                            <td className="py-3 px-5 text-sm">{user.email}</td>
                            <td className="py-3 px-5 text-sm">{user.role}</td>
                            <td className="py-3 px-5 text-sm">
                            <div className="flex justify-center space-x-3">
                                <Button
                                variant="link"
                                className="text-blue-500 hover:text-blue-700 transition-colors"
                                onClick={() => handleEdit(user)}
                                >
                                <FaEdit />
                                </Button>
                                <Button
                                variant="link"
                                className="text-red-500 hover:text-red-700 transition-colors"
                                onClick={() => handleDelete(user._id)}
                                >
                                <FaTrash />
                                </Button>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
            </Table>

          )}

          {success && <div className="alert alert-success">User updated successfully!</div>}

          {/* Edit User Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={userForm.name}
                    onChange={handleFormChange}
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userForm.email}
                    onChange={handleFormChange}
                  />
                </Form.Group>

                <Form.Group controlId="formRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={userForm.role}
                    onChange={handleFormChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleUpdate}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default ManageUsers;
