import React, { useState, useEffect } from 'react';
import { fetchProducts, saveQuoteRequest } from '../../services/api';
import { Card, ListGroup, Button, Navbar, Nav, NavDropdown, Container, Row, Col, Modal, Form, InputGroup } from 'react-bootstrap';
import { FaUserAlt, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import Sidebar from '../../components/admin/Sidebar';
import NavBar from '../../components/admin/NavBar';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [quoteModalShow, setQuoteModalShow] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quoteItems, setQuoteItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const token = sessionStorage.getItem('authToken');

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const productData = await fetchProducts();
        setProducts(productData);
        setFilteredProducts(productData); // Initially, show all products
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    if (token) fetchAllProducts();
  }, [token]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.supplier?.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const handleSupplierChange = (e) => {
    const supplierId = e.target.value;
    setSelectedSupplier(supplierId);

    if (supplierId) {
      setFilteredProducts(products.filter((product) => product.supplier._id === supplierId));
    } else {
      setFilteredProducts(products); // Show all products if no supplier selected
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
      setQuoteModalShow(false); // Close modal after sending
    } catch (error) {
      console.error('Error sending quote request:', error.message);
    }
  };

  return (
    <Container fluid className="p-0">
      <NavBar/>

      <Row className="d-flex h-100 mt-5 pt-5">
        <Col xs={12} sm={4} md={3} lg={2} className="sidebar position-fixed  text-white">
          <Sidebar onQuoteRequest={() => setQuoteModalShow(true)} />
        </Col>

        <Col xs={12} sm={8} md={9} lg={10} className="ml-auto p-4">
          {/* Search Bar */}
          <div className="search-container mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products or suppliers..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute top-3 right-4 text-gray-500" size={20} />
            </div>
          </div>

          <h2 className="text-dark mb-4 text-2xl font-semibold">All Products</h2>

        {/* Product List */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {filteredProducts.map((product) => (
    <div
      className="relative product-card bg-gradient-to-r from-[#1c3b6d] to-[#5f7cb7] shadow-xl rounded-xl overflow-hidden group transform transition-transform hover:scale-105 hover:shadow-2xl"
      key={product._id}
    >
      {/* Front of the Card */}
      <div className="p-6 text-white">
        {/* Product Name with Ellipsis and Hover Effect */}
        <h5 className="text-2xl font-bold truncate group-hover:whitespace-normal group-hover:text-lg transition-all duration-300">
          {product.name}
        </h5>

        <p className="text-xl font-medium text-green-400 mt-2">{product.price} LKR</p>
        <p className="text-sm text-gray-100 mt-3">Supplier: {product.supplier?.name}</p>
        <p className="text-sm text-gray-200 mt-1">Inventory: {product.inventory}</p>
      </div>

      {/* Hover Effect: Back of the Card */}
      <div className="absolute inset-0 bg-white text-gray-800 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
        <h5 className="text-2xl font-semibold">{product.name}</h5>
        <p className="text-lg text-green-600 mt-4">{product.price} LKR</p>
        <p className="text-sm mt-2">Supplier: {product.supplier?.name}</p>
        <p className="text-sm mt-1">Inventory: {product.inventory}</p>
        <div className="mt-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-gray-800 rounded-full">
            {product.inventory} left
          </span>
        </div>
      </div>
    </div>
  ))}
</div>



        </Col>
      </Row>

      {/* Quotation Modal */}
      <Modal show={quoteModalShow} onHide={() => setQuoteModalShow(false)} size="lg" className="fade-in">
        <Modal.Header closeButton>
          <Modal.Title>Send Quotation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Supplier</Form.Label>
            <Form.Control as="select" onChange={handleSupplierChange} className="border-gray-300">
              <option value="">-- Choose a Supplier --</option>
              {products
                .map((product) => product.supplier)
                .filter((supplier, index, self) => self.findIndex((s) => s._id === supplier._id) === index)
                .map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
          <hr />
          {selectedSupplier && (
            <>
              <h5 className="text-dark font-semibold mb-2">Supplier's Products</h5>
              <ListGroup>
                {filteredProducts.map((product) => (
                  <ListGroup.Item key={product._id} className="bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Row className="flex items-center justify-between">
                      <Col md={6}>
                        <h5 className="text-gray-800">{product.name}</h5>
                        <p className="text-sm text-gray-500">Price: ${product.price}</p>
                      </Col>
                      <Col md={6} className="text-right">
                        <Form.Control
                          type="number"
                          min="1"
                          placeholder="Quantity"
                          onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value) || 0)}
                          className="w-24 border-gray-300"
                        />
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setQuoteModalShow(false)}>
            Close
          </Button>
          <Button variant="success" onClick={handleSubmitQuote}>
            Send Request
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
