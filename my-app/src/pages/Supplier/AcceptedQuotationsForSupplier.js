import React, { useState, useEffect } from 'react';
import { fetchAcceptedQuotationsForSupplier } from '../../services/api';  // Ensure API call to fetch accepted quotations is correct
import { Table, Spinner, Container, Row, Col, Card,Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import Sidebar from '../../components/seller/user/Sidebar'; // Assuming Sidebar component exists
import { FaPlusCircle, FaBoxOpen, FaUserAlt, FaSignOutAlt, FaCogs, FaQuestionCircle } from 'react-icons/fa';
import NavBar from '../../components/seller/user/NavBar';


const AcceptedQuotationsForSupplier = () => {
  const [acceptedQuotations, setAcceptedQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem('authToken'); // Use sessionStorage to get the token

  useEffect(() => {
    const fetchSupplierAcceptedQuotations = async () => {
      try {
        if (token) {
          const data = await fetchAcceptedQuotationsForSupplier(token); // Fetch accepted quotations using the token
          setAcceptedQuotations(data);
        } else {
          setError('User not logged in');
        }
      } catch (error) {
        setError(error.message);  // Handle errors
      } finally {
        setLoading(false);  // Set loading to false when done
      }
    };

    fetchSupplierAcceptedQuotations();
  }, [token]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error fetching accepted quotations: {error}</div>;
  }

  // Function to print a quotation
  const handlePrint = (quotation) => {
    const printWindow = window.open('', '', 'width=800, height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Quotation - ${quotation._id}</title>
          <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; }
            .container { max-width: 800px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { font-size: 36px; color: #004d99; margin: 0; }
            .header p { font-size: 18px; color: #555; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px 15px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #004d99; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            td { font-size: 16px; }
            .quote-details { margin-top: 30px; font-size: 18px; }
            .total-amount { font-weight: bold; color: #004d99; font-size: 20px; }
            .footer { margin-top: 40px; text-align: center; font-size: 14px; color: #aaa; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>TechFix</h1>
              <p>Quotation for Services and Products</p>
            </div>
            
            <h2>Quotation #${quotation._id}</h2>
            <p><strong>Supplier:</strong> ${quotation.supplierName || 'Unknown Supplier'}</p>
            <p><strong>Status:</strong> ${quotation.status || 'Accepted'}</p>
            <p><strong>Acceptance Date:</strong> ${new Date(quotation.acceptedDate).toLocaleString()}</p>
            
            <h3>Products</h3>
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${quotation.products.map(product => `
                  <tr>
                    <td>${product.productName}</td>
                    <td>${product.quantity}</td>
                    <td>${product.price ? `$${product.price.toFixed(2)}` : 'N/A'}</td>
                    <td>${product.price ? `$${(product.price * product.quantity).toFixed(2)}` : 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="quote-details">
              <p><strong>Total Amount:</strong> <span class="total-amount">${quotation.products.reduce((sum, product) => sum + (product.price * product.quantity), 0).toFixed(2)}LKR</span></p>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing TechFix!</p>
              <p>Contact us at: info@techfix.com | 123-456-7890</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  

  return (
    <Container fluid className="p-0">

        <NavBar/>


      <Row className="d-flex h-100 mt-5 pt-5">
        {/* Sidebar */}
        <Col xs={12} sm={4} md={3} lg={2} className="sidebar position-fixed">
          <Sidebar />
        </Col>

        {/* Main Content Area */}
        <Col xs={12} sm={8} md={9} lg={10} className="main-content ml-auto p-4">
          <Card className="shadow-lg rounded">
            <Card.Body>
              <h2 className="text-dark mb-4">Accepted Quotations</h2>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Quotation ID</th>
                    <th>Supplier</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Acceptance Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptedQuotations.length > 0 ? (
                    acceptedQuotations.map((quote) => (
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
                        <td>{quote.status || 'Accepted'}</td>
                        <td>{new Date(quote.acceptedDate).toLocaleString()}</td>
                        <td>
                          <Button variant="primary" onClick={() => handlePrint(quote)}>
                            Print Quotation
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No accepted quotations available.
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

export default AcceptedQuotationsForSupplier;
