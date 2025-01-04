import React, { useState, useEffect } from 'react';
import { fetchQuotationHistory } from '../../services/api'; // Ensure this API is calling the correct endpoint
import { Table, Spinner,Card, Row, Col, Container, Navbar, Nav, NavDropdown  } from 'react-bootstrap';
import { FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../../components/admin/Sidebar';
import NavBar from '../../components/admin/NavBar';

const QuotationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await fetchQuotationHistory();  // Fetch quotation history from the updated endpoint
        setHistory(data);  // Set the fetched data
      } catch (error) {
        setError(error);  // Handle errors
      } finally {
        setLoading(false);  // Set loading to false when done
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div>Error fetching quotation history: {error.message}</div>;
  }

  return (
    <Container fluid className="p-0 bg-gradient-to-r from-[#dce2ec] to-[#0a40ac] h-screen" >
      <NavBar/>

      <Row className="d-flex h-100 mt-5 pt-5">
        {/* Sidebar */}
        <Col xs={12} sm={4} md={3} lg={2} className="sidebar position-fixed">
          <Sidebar />
        </Col>
                <Col xs={12} sm={8} md={9} lg={10} className="ml-auto p-4">
        
                <Table className="min-w-full table-auto bg-white shadow-lg rounded-lg overflow-hidden">
  <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
    <tr>
      <th className="py-3 px-4 text-left">Quotation ID</th>
      <th className="py-3 px-4 text-left">Supplier</th>
      <th className="py-3 px-4 text-left">Products</th>
      <th className="py-3 px-4 text-left">Approval Status</th>
      <th className="py-3 px-4 text-left">Date</th>
    </tr>
  </thead>
  <tbody className="text-sm text-gray-700">
    {history.length > 0 ? (
      history.map((quote) => (
        <tr key={quote._id} className="hover:bg-gray-50">
          <td className="py-3 px-4">{quote._id}</td>
          <td className="py-3 px-4">{quote.supplierName || 'Unknown Supplier'}</td>
          <td className="py-3 px-4">
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
          <td className="py-3 px-4">{quote.status || 'Pending'}</td>
          <td className="py-3 px-4">{new Date(quote.date).toLocaleString()}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={5} className="py-3 px-4 text-center text-gray-500">
          No quotation history available.
        </td>
      </tr>
    )}
  </tbody>
</Table>

              </Col>
      
            </Row>
      
      </Container>
  );
};

export default QuotationHistory;
