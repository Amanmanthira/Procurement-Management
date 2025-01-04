import React, { useState, useEffect } from 'react';
import { fetchProducts, saveQuoteRequest } from '../../services/api';
import { Card, ListGroup, Button, Navbar, Nav, NavDropdown, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../../components/admin/Sidebar';
import NavBar from '../../components/admin/NavBar';

const AdminAcceptedQuotations = () => {
  const [products, setProducts] = useState([]);
  const [quoteModalShow, setQuoteModalShow] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quoteItems, setQuoteItems] = useState([]);
  const [acceptedQuotations, setAcceptedQuotations] = useState([]);
  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const productData = await fetchProducts();
        setProducts(productData);
        setFilteredProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    if (token) fetchAllProducts();
  }, [token]);

  useEffect(() => {
    const fetchAcceptedQuotes = async () => {
      try {
        if (token) {
          const response = await fetch(`http://localhost:5000/api/quotes/admin/accepted-quotations`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch accepted quotations');
          }

          const data = await response.json();
          setAcceptedQuotations(data);
        }
      } catch (error) {
        console.error('Error fetching accepted quotations:', error.message);
      }
    };

    fetchAcceptedQuotes();
  }, [token]);

  const handleSupplierChange = (e) => {
    const supplierId = e.target.value;
    setSelectedSupplier(supplierId);
    if (supplierId) {
      setFilteredProducts(products.filter((product) => product.supplier._id === supplierId));
    } else {
      setFilteredProducts(products);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setQuoteItems((prev) => {
      const existingItemIndex = prev.findIndex((item) => item.productId === productId);
      const newItems = [...prev];
      if (existingItemIndex !== -1) {
        newItems[existingItemIndex].quantity = quantity;
      } else {
        newItems.push({ productId, quantity });
      }
      return newItems;
    });
  };

  const handleSubmitQuote = async () => {
    try {
      if (!selectedSupplier) {
        throw new Error('Supplier must be selected.');
      }

      const supplier = products.find((product) => product.supplier._id === selectedSupplier)?.supplier;
      const supplierName = supplier ? supplier.name : '';

      const quoteProducts = quoteItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      if (!quoteProducts.length) {
        throw new Error('No products selected.');
      }

      const data = {
        supplierId: selectedSupplier,
        supplierName: supplierName,
        products: quoteProducts,
        date: new Date(),
      };

      const response = await saveQuoteRequest(token, selectedSupplier, quoteProducts, data.date);
      console.log('Quote request sent:', response);
      setQuoteModalShow(false);
    } catch (error) {
      console.error('Error sending quote request:', error.message);
    }
  };

  const handlePrint = (quotation) => {
    const printWindow = window.open('', '', 'width=800, height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Quotation - ${quotation._id}</title>
          <style>
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #f4f4f9; }
            .container { max-width: 800px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 12px; box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { font-size: 36px; color: #1c3b6d; margin: 0; }
            .header p { font-size: 18px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #1c3b6d; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            td { font-size: 16px; }
            .quote-details { margin-top: 30px; font-size: 18px; }
            .total-amount { font-weight: bold; color: #1c3b6d; font-size: 20px; }
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
                    <td>${product.price ? `${product.price.toFixed(2)}LKR` : 'N/A'}</td>
                    <td>${product.price ? `${(product.price * product.quantity).toFixed(2)}LKR` : 'N/A'}</td>
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
    <Container fluid className="p-0 bg-gradient-to-r from-[#dce2ec] to-[#0a40ac] h-screen" >
      <NavBar />

      <Row className="d-flex h-100 mt-5 pt-5">
        <Col xs={12} sm={4} md={3} lg={2} className="sidebar position-fixed">
          <Sidebar onQuoteRequest={() => setQuoteModalShow(true)} />
        </Col>

        <Col xs={12} sm={8} md={9} lg={10} className="ml-auto p-4">
          <h2 className="text-light mb-4">Accepted Quotations</h2>
          <Card className="shadow-lg rounded mb-4 border-0">
            <Card.Body className="p-4">
              <ListGroup>
                {acceptedQuotations.length > 0 ? (
                  acceptedQuotations.map((quotation, index) => (
                    <ListGroup.Item
                      key={quotation._id}
                      className={`text-dark rounded mb-3 shadow-sm border-0 transition-all duration-300 hover:shadow-2xl hover:transform hover:scale-105 
                        ${index === 0 ? 'bg-light' : 'bg-white'}`}
                    >
                      <Row>
                        <Col md={4} className="d-flex flex-column align-items-start">
                          <h5 className="text-primary font-weight-bold mb-2">Quotation ID: {quotation._id}</h5>
                          <p className="mb-1">
                            <strong>Supplier:</strong> {quotation.supplierName}
                          </p>
                          <p className="text-muted">
                            <strong>Date:</strong> {new Date(quotation.date).toLocaleDateString()}
                          </p>
                          <Button
                            variant="outline-primary"
                            className="mt-3 px-4 py-2 rounded-pill font-weight-semibold"
                            onClick={() => handlePrint(quotation)}
                          >
                            Print Quotation
                          </Button>
                        </Col>
                        <Col md={8}>
                          <h6 className="text-muted mb-3">Products:</h6>
                          <ListGroup className="mb-0">
                            {quotation.products.map((product) => (
                              <ListGroup.Item
                                key={product.productId}
                                className="d-flex justify-content-between align-items-center border-0 p-3 mb-2 bg-light rounded-3 shadow-sm"
                              >
                                <p className="font-weight-semibold">{product.productName}</p>
                                <p className="text-muted">
                                  <strong>Price:</strong> {product.price}LKR | <strong>Qty:</strong> {product.quantity}
                                </p>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-center text-muted p-4">
                    No accepted quotations available
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quotation Modal */}
      <Modal show={quoteModalShow} onHide={() => setQuoteModalShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Send Quotation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Supplier</Form.Label>
            <Form.Control as="select" onChange={handleSupplierChange}>
              <option value="">-- Choose a Supplier --</option>
              {products
                .map((product) => product.supplier)
                .filter((value, index, self) => self.findIndex((t) => t._id === value._id) === index)
                .map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                ))}
            </Form.Control>
          </Form.Group>
          <ListGroup>
            {filteredProducts.map((product) => (
              <ListGroup.Item key={product._id}>
                <Row className="d-flex align-items-center">
                  <Col>{product.name}</Col>
                  <Col>
                    <Form.Control
                      type="number"
                      value={quoteItems.find(item => item.productId === product._id)?.quantity || 0}
                      onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                      placeholder="Quantity"
                    />
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setQuoteModalShow(false)}>Close</Button>
          <Button variant="primary" onClick={handleSubmitQuote}>Send Quotation</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminAcceptedQuotations;
