import React, { useState, useEffect } from 'react';
import { addProduct, fetchProducts, updateProduct, deleteProduct } from '../../services/api';
import { Button, Form, Container, Row, Col, ListGroup, Card, Navbar, Nav, NavDropdown, Modal } from 'react-bootstrap';
import { FaPlusCircle, FaBoxOpen, FaUserAlt, FaSignOutAlt, FaCogs, FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import Sidebar from '../../components/seller/user/Sidebar';
import NavBar from '../../components/seller/user/NavBar';

const SupplierDashboard = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    inventory: '',
    minimumStockLevel: '',
  });
  const [products, setProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const token = sessionStorage.getItem('authToken'); // Use sessionStorage to get the token

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const productData = await fetchProducts(token); // Fetch products using the token
          setProducts(productData);
        } catch (error) {
          console.error('Error fetching products:', error);
          alert('Error fetching products');
        }
      };
      fetchData();
    } else {
      alert('User not logged in');
    }
  }, [token]);

  // Add a new product
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.inventory || !newProduct.minimumStockLevel) {
      alert('Please fill in all fields');
      return;
    }
  
    if (!token) {
      alert('User is not logged in');
      return;
    }
  
    try {
      console.log('Attempting to send data to server...');
      const response = await addProduct(newProduct);
      console.log('Response from server:', response);
  
      alert('Product added successfully');
      setProducts([...products, response]);
      setNewProduct({ name: '', price: '', inventory: '', minimumStockLevel: '' });
    } catch (error) {
      alert('Error adding product: ' + error.message);
    }
  };

  // Handle editing a product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // Update an edited product
  const handleUpdateProduct = async () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.inventory || !editingProduct.minimumStockLevel) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await updateProduct(token, editingProduct._id, editingProduct);
      if (response) {
        const updatedProducts = products.map((product) => 
          product._id === editingProduct._id ? editingProduct : product
        );
        setProducts(updatedProducts);
        setShowEditModal(false); // Close the modal after update
      }
    } catch (error) {
      alert('Error updating product: ' + error.message);
    }
  };

  // Delete a product
  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(token, id);
      setProducts(products.filter(product => product._id !== id));
      alert('Product deleted successfully');
    } catch (error) {
      alert('Error deleting product: ' + error.message);
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowEditModal(false); // Close the modal
    setEditingProduct(null);  // Clear the editing product
  };

  return (
    <Container fluid className="p-0">
      <NavBar/>

      <Row className="d-flex h-100 mt-5 pt-5">
        {/* Sidebar */}
        <Col xs={12} sm={4} md={3} lg={2} className="sidebar position-fixed">
          <Sidebar/>
        </Col>

        {/* Main Content Area */}
        <Col xs={12} sm={8} md={9} lg={10} className="main-content ml-auto p-4">
          <h2 className="text-dark mb-4">Manage Your Products</h2>

          <Card className="mb-5 shadow-lg rounded">
            <Card.Body>
              <h4 className="mb-4 text-dark">Add New Product</h4>

              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="productName">
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter product name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="productPrice">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="productInventory">
                      <Form.Label>Inventory</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter inventory"
                        value={newProduct.inventory}
                        onChange={(e) => setNewProduct({ ...newProduct, inventory: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="minimumStockLevel">
                      <Form.Label>Minimum Stock Level</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter minimum stock level"
                        value={newProduct.minimumStockLevel}
                        onChange={(e) => setNewProduct({ ...newProduct, minimumStockLevel: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  variant="primary"
                  onClick={handleAddProduct}
                  className="mt-3 w-100"
                >
                  Add Product
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className="shadow-lg rounded">
            <Card.Body>
              <h4 className="mb-4 text-dark">Your Products</h4>
              <ListGroup>
                {products.length > 0 ? (
                  products.map((product) => (
                    <ListGroup.Item key={product._id} className="bg-light text-dark rounded">
                      <Row className="d-flex align-items-center">
                        <Col md={6}>
                          <h5>{product.name}</h5>
                          <p className="mb-0">Price: {product.price}LKR</p>
                          <p className="mb-0">Inventory: {product.inventory}</p>
                        </Col>
                        <Col md={6} className="text-right">
                          <Button variant="danger" className="ml-2" onClick={() => handleDeleteProduct(product._id)}>Delete</Button>
                          <Button variant="info" className="ml-2" onClick={() => handleEditProduct(product)}>Edit</Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="bg-light text-dark rounded">No products found</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingProduct && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="editProductName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="editProductPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="editProductInventory">
                    <Form.Label>Inventory</Form.Label>
                    <Form.Control
                      type="number"
                      value={editingProduct.inventory}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inventory: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="editMinimumStockLevel">
                    <Form.Label>Minimum Stock Level</Form.Label>
                    <Form.Control
                      type="number"
                      value={editingProduct.minimumStockLevel}
                      onChange={(e) => setEditingProduct({ ...editingProduct, minimumStockLevel: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                variant="primary"
                onClick={handleUpdateProduct}
                className="w-100 mt-3"
              >
                Update Product
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SupplierDashboard;
