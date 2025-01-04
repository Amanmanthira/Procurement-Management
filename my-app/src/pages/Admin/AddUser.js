import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import Sidebar from '../../components/admin/Sidebar';
import NavBar from '../../components/admin/NavBar';
import { FaUserPlus } from 'react-icons/fa';
import { registerUser } from '../../services/api'; // Import registerUser function
import '../../styles/AddUser.css'; // Include custom CSS for animations and styling

const AddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const data = await registerUser({ name, email, password, role });  // Call registerUser from api.js
      setSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'An error occurred while adding the user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-0 bg-gradient-to-r from-[#dce2ec] to-[#0a40ac] h-screen">
      <NavBar />

      <Row className="d-flex h-100 mt-5 pt-5">
        {/* Sidebar */}
        <Col xs={12} sm={4} md={3} lg={2} className="sidebar position-fixed">
          <Sidebar />
        </Col>

        <Col xs={12} sm={8} md={9} lg={10} className="ml-auto p-5">
          <Card className="shadow-lg rounded-lg p-4 card-animation">
          <Card.Body className="p-8 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 rounded-xl shadow-xl relative overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2022/02/16/08/15/background-7016262_1280.png")' }}></div>

  {/* Form Section */}
  <div className="relative z-10 max-w-lg mx-auto space-y-6 bg-white p-8 rounded-lg shadow-2xl backdrop-blur-md bg-opacity-60">
    <h3 className="text-4xl font-bold text-center text-blue-800 mb-6 tracking-tight">
      <FaUserPlus className="inline-block mr-2 text-blue-500" /> Add New User
    </h3>

    {loading ? (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full border-4 border-t-4 border-blue-500 w-10 h-10"></div>
      </div>
    ) : (
      <Form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 text-red-600 text-center p-3 rounded-md shadow-md">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-600 text-center p-3 rounded-md shadow-md">
            User added successfully!
          </div>
        )}

        {/* Name Input */}
        <Form.Group controlId="formName" className="mb-6">
          <Form.Label className="text-gray-800 text-lg">Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all transform hover:scale-105"
            style={{
                borderRadius: '9999px', // Make the button round
                margin: '0 auto', // Center the button horizontally
                display: 'block', // Ensure it behaves as a block-level element
              }}/>
        </Form.Group>

        {/* Email Input */}
        <Form.Group controlId="formEmail" className="mb-6">
          <Form.Label className="text-gray-800 text-lg">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all transform hover:scale-105"
            style={{
                borderRadius: '9999px', // Make the button round
                margin: '0 auto', // Center the button horizontally
                display: 'block', // Ensure it behaves as a block-level element
              }}/>
        </Form.Group>

        {/* Password Input */}
        <Form.Group controlId="formPassword" className="mb-6">
          <Form.Label className="text-gray-800 text-lg">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all transform hover:scale-105"
            style={{
                borderRadius: '9999px', // Make the button round
                margin: '0 auto', // Center the button horizontally
                display: 'block', // Ensure it behaves as a block-level element
              }}/>
        </Form.Group>

        {/* Role Select */}
        <Form.Group controlId="formRole" className="mb-6">
          <Form.Label className="text-gray-800 text-lg">Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all transform hover:scale-105"
            style={{
                borderRadius: '9999px', // Make the button round
                margin: '0 auto', // Center the button horizontally
                display: 'block', // Ensure it behaves as a block-level element
              }}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Form.Control>
        </Form.Group>

        {/* Submit Button */}
        <Button
  variant="primary"
  type="submit"
  className="w-48 py-2 mt-4 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 transition-all transform hover:scale-105"
  style={{
    borderRadius: '9999px', // Make the button round
    margin: '0 auto', // Center the button horizontally
    display: 'block', // Ensure it behaves as a block-level element
  }}
>
  Add User
</Button>

      </Form>
    )}
  </div>
</Card.Body>

          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddUser;
