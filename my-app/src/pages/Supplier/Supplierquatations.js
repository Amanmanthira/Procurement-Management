import React, { useState, useEffect } from 'react';
import { fetchSupplierQuotations, updateQuotationStatus, moveToAcceptedQuotations } from '../../services/api'; // Ensure moveToAcceptedQuotations is imported
import { Table, Spinner, Button, Dropdown, DropdownButton, Container, Row,Navbar, Nav, NavDropdown, Col, Card } from 'react-bootstrap';
import { FaPlusCircle, FaBoxOpen, FaUserAlt, FaSignOutAlt, FaCogs, FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/seller/user/Sidebar'; // Assuming Sidebar component exists
import NavBar from '../../components/seller/user/NavBar';

const QuotationHistoryForSupplier = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem('authToken'); // Use sessionStorage to get the token

  useEffect(() => {
    const fetchSupplierQuotationsData = async () => {
      try {
        const data = await fetchSupplierQuotations(token); // Fetch quotations using the token
        setQuotations(data);
      } catch (error) {
        setError(error);  // Handle errors
      } finally {
        setLoading(false);  // Set loading to false when done
      }
    };

    if (token) {
      fetchSupplierQuotationsData();
    } else {
      alert('User not logged in');
    }
  }, [token]);

  const handleStatusChange = async (quotationId, newStatus) => {
    try {
      await updateQuotationStatus(quotationId, newStatus);  // Update status via API
      // Update the status locally to reflect the change in UI
      setQuotations((prevQuotations) =>
        prevQuotations.map((quote) =>
          quote._id === quotationId ? { ...quote, status: newStatus } : quote
        )
      );

      // If accepted, move quotation to 'AcceptedQuotations' (can be done by backend)
      if (newStatus === 'Accepted') {
        await moveToAcceptedQuotations(quotationId); // Now using the function from api.js
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error fetching quotations: {error.message}</div>;
  }

  return (
    <Container fluid className="p-0">
        <NavBar/>
      <Row className="d-flex h-100 mt-5 pt-5">
        {/* Sidebar */}
        <Col xs={12} sm={4} md={3} lg={2} className="sidebar position-fixed">
          <Sidebar />
        </Col>

        {/* Main Content Area */}
        <Col xs={12} sm={8} md={9} lg={10} className="main-content ml-auto p-4 ">
          <Card className="shadow-lg rounded h-screen">
            <Card.Body>
              <h2 className="text-dark mb-4">Quotation History</h2>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Quotation ID</th>
                    <th>Supplier</th>
                    <th>Products</th>
                    <th>Approval Status</th>
                    <th>Date</th>
                    <th>Action</th> {/* Add a new column for actions */}
                  </tr>
                </thead>
                <tbody>
                  {quotations.length > 0 ? (
                    quotations.map((quote) => (
                      <tr key={quote._id}>
                        <td>{quote._id}</td>
                        <td>{quote.supplierName || 'Unknown Supplier'}</td>
                        <td>
                          {quote.products.length > 0 ? (
                            quote.products.map((item, index) => (
                              <div key={index}>
                                {item.productName} x {item.quantity}
                              </div>
                            ))
                          ) : (
                            'No Products'
                          )}
                        </td>
                        <td>{quote.status || 'Pending'}</td>
                        <td>{new Date(quote.date).toLocaleString()}</td>
                        <td>
                          <DropdownButton
                            id={`dropdown-status-${quote._id}`}
                            title="Change Status"
                            onSelect={(selectedStatus) => handleStatusChange(quote._id, selectedStatus)}
                          >
                            <Dropdown.Item eventKey="Accepted">Accept</Dropdown.Item>
                            <Dropdown.Item eventKey="Rejected">Reject</Dropdown.Item>
                            <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
                          </DropdownButton>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No quotation history available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QuotationHistoryForSupplier;
