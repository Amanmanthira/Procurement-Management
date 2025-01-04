import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import { FaDollarSign, FaEuroSign, FaPoundSign } from 'react-icons/fa'; // Currency icons
import "../../styles/AdminDashboard.css"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchProducts, fetchQuotationHistory } from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import NavBar from '../../components/admin/NavBar';
import axios from 'axios'; // for fetching API data

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardSupplier = () => {
  const [productCount, setProductCount] = useState(0);
  const [quotationCount, setQuotationCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [productData, setProductData] = useState([]);
  const [quotationData, setQuotationData] = useState([]);
  const [bgClass, setBgClass] = useState('');
  const [animationClass, setAnimationClass] = useState('');
  const [greeting, setGreeting] = useState('');
  // Currency data state
  const [currencyRates, setCurrencyRates] = useState({});
  const [loadingCurrency, setLoadingCurrency] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await fetchProducts();
        const quotations = await fetchQuotationHistory();

        setProductCount(products.length);
        setQuotationCount(quotations.length);

        const lowStock = products.filter(
          (product) => product.inventory < product.minimumStockLevel
        );
        setLowStockCount(lowStock.length);

        setProductData(products);
        setQuotationData(quotations);
        // Fetching Currency Rates
        const currencyResponse = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/USD`
        );
        setCurrencyRates(currencyResponse.data.rates); // Store all rates
        setLoadingCurrency(false);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();

    

    // Time-based Greeting
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
      setBgClass("morning-bg");
      setAnimationClass("morning-animate");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
      setBgClass("afternoon-bg");
      setAnimationClass("afternoon-animate");
    } else {
      setGreeting("Good Evening");
      setBgClass("evening-bg");
      setAnimationClass("evening-animate");
    }
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts.

  const getAnimationClass = () => {
    return 'fade-in'; // animation class for fade-in effect
  };

  // Chart Data
  const barChartData = {
    labels: productData.map((product) => product.name),
    datasets: [
      {
        label: 'Inventory',
        data: productData.map((product) => product.inventory),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: '#1c3b6d',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
    ],
  };

  const pieChartData = {
    labels: ['Low Stock', 'In Stock'],
    datasets: [
      {
        data: [lowStockCount, productCount - lowStockCount],
        backgroundColor: ['#FF6B6B', '#4B8BBE'],
        hoverBackgroundColor: ['#FF4C4C', '#3B72A1'],
      },
    ],
  };

  const lineChartData = {
    labels: quotationData.map((quote) =>
      new Date(quote.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Quotations Over Time',
        data: quotationData.map((quote, index) => index + 1),
        fill: false,
        backgroundColor: '#4BC0C0',
        borderColor: '#1c3b6d',
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#4BC0C0',
        pointRadius: 5,
        tension: 0.4,
      },
    ],
  };

  return (
    <Container fluid className="p-0 bg-gradient-to-r from-[#dce2ec] to-[#0a40ac]">
      <NavBar />

      <Row className="d-flex h-full mt-5 pt-5">
        {/* Sidebar */}
        <Col xs={12} sm={4} md={3} lg={2} className="sidebar position-fixed text-white">
          <Sidebar />
        </Col>

        {/* Main Content Area */}
        <Col xs={12} sm={8} md={9} lg={10} className="ml-auto p-6">
          {/* Greeting Section */}
          <Row className="mb-6 mx-2">
            <Col>
              <Card className={`bg-white shadow-2xl border-0 rounded-3xl hover:scale-105 transition-transform ${bgClass}`}>
                <Card.Body className="p-6">
                  <h2 className={`text-[#1c3b6d] text-3xl font-semibold ${animationClass}`}>
                    {greeting}, Admin
                  </h2>
                  <p className="text-[#5f7cb7] text-lg">Welcome back to your dashboard. Here's a summary of your business status.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Currency Exchange Rates with Slide Show Effect */}
          <Row className="mb-6 mx-4">
            <Col>
              <Card className="bg-gradient-to-r from-[#4d73be] to-[#ccd7f3] shadow-lg border-0 rounded-2xl transform hover:scale-105 transition-all duration-500 ease-in-out">
                <Card.Body className="p-4 space-y-3">
                  <h5 className="text-white text-2xl font-extrabold text-center tracking-wider transform hover:scale-110 transition-all duration-300 ease-in-out">
                    Currency Exchange Rates
                  </h5>
                  <div className="space-y-3">
                    {loadingCurrency ? (
                      <div className="mx-auto w-10 h-10 border-4 border-t-white border-t-transparent border-solid rounded-full animate-spin"></div>
                    ) : (
                      <>
                        {/* USD to LKR */}
                        <div className="flex justify-between items-center py-3 px-5 border-b border-white/40 hover:bg-white/20 transition-all ease-in-out rounded-xl transform hover:scale-105 duration-300 animate-slideInFromLeft">
                          <FaDollarSign className="text-2xl text-white transform hover:rotate-180 transition-all duration-300" />
                          <span className="text-lg font-semibold text-white">USD to LKR</span>
                          <span className="text-lg font-bold text-white">
                            {currencyRates.LKR ? currencyRates.LKR.toFixed(2) : "N/A"}
                          </span>
                        </div>

                        {/* EUR to LKR */}
                        <div className="flex justify-between items-center py-3 px-5 border-b border-white/40 hover:bg-white/20 transition-all ease-in-out rounded-xl transform hover:scale-105 duration-300 animate-slideInFromRight">
                          <FaEuroSign className="text-2xl text-white transform hover:rotate-180 transition-all duration-300" />
                          <span className="text-lg font-semibold text-white">EUR to LKR</span>
                          <span className="text-lg font-bold text-white">
                            {currencyRates.EUR ? currencyRates.EUR.toFixed(2) : "N/A"}
                          </span>
                        </div>

                        {/* GBP to LKR */}
                        <div className="flex justify-between items-center py-3 px-5 hover:bg-white/20 transition-all ease-in-out rounded-xl transform hover:scale-105 duration-300 animate-slideInFromLeft">
                          <FaPoundSign className="text-2xl text-white transform hover:rotate-180 transition-all duration-300" />
                          <span className="text-lg font-semibold text-white">GBP to LKR</span>
                          <span className="text-lg font-bold text-white">
                            {currencyRates.GBP ? currencyRates.GBP.toFixed(2) : "N/A"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Statistics Cards */}
          <Row className="mb-5 mx-1">
            <Col md={4}>
              <Card className="shadow-2xl bg-white rounded-2xl hover:bg-[#f1f1f1] transition-all transform">
                <Card.Body>
                  <h5 className="text-[#1c3b6d]">Total Products</h5>
                  <h3 className="text-[#5f7cb7] text-3xl font-semibold">{productCount}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-2xl bg-white rounded-2xl hover:bg-[#f1f1f1] transition-all transform">
                <Card.Body>
                  <h5 className="text-[#1c3b6d]">Total Quotations</h5>
                  <h3 className="text-[#5f7cb7] text-3xl font-semibold">{quotationCount}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-2xl bg-white rounded-2xl hover:bg-[#f1f1f1] transition-all transform">
                <Card.Body>
                  <h5 className="text-[#1c3b6d]">Supplier's Low Stock Products</h5>
                  <h3 className="text-[#5f7cb7] text-3xl font-semibold">{lowStockCount}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts Layout */}
          <Row className="mb-6 mx-1">
            <Col md={4} sm={6} xs={12} className="mb-4">
              <Card className="shadow-2xl bg-white rounded-3xl p-4">
                <Card.Body>
                  <h5 className="text-[#1c3b6d] text-lg font-semibold">Inventory Distribution</h5>
                  <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} sm={6} xs={12} className="mb-4">
              <Card className="shadow-2xl bg-white rounded-3xl p-4">
                <Card.Body>
                  <h5 className="text-[#1c3b6d] text-lg font-semibold">Stock Availability</h5>
                  <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} sm={6} xs={12} className="mb-4">
              <Card className="shadow-2xl bg-white rounded-3xl p-4">
                <Card.Body>
                  <h5 className="text-[#1c3b6d] text-lg font-semibold">Quotations Over Time</h5>
                  <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardSupplier;
