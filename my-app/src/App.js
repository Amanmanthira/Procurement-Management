import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';  // Assuming Login is in components folder
import AdminDashboard from './pages/Admin/AdminDashboards';  // Admin component
import SupplierDashboard from './pages/Supplier/SupplierDashboard';  // Supplier component
import 'bootstrap/dist/css/bootstrap.min.css';
import QuotationHistory from './pages/Admin/AdminQutationView';
import SupplierQuotationPage from './pages/Supplier/Supplierquatations';
import DashboardSupplier from './pages/Supplier/DashboardSupplier';
import AcceptedQuotationsForSupplier from './pages/Supplier/AcceptedQuotationsForSupplier';
import AdminAcceptedQuotations from './pages/Admin/AdminAcceptedQuotations';
import Dashboard from './pages/Admin/Dashboard';
import AddUser from './pages/Admin/AddUser';
import ManageUsers from './pages/Admin/ManageUsers';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    // If there's no token, you can redirect the user to login page
    if (!token) {
      window.location.href = '/login';
    }
  }, [token]);

  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />


          <Route path="/AdminDashboard" element={token && <AdminDashboard />} />
          <Route path="/quotation-history" element={<QuotationHistory/>} />
          <Route path="/AllAcceptedQuatation" element={token && <AdminAcceptedQuotations/>} />
          <Route path="/ADashboard" element={token && <Dashboard/>} />
          <Route path="/AddUser" element={token && <AddUser/>} />
          <Route path="/ManageUser" element={token && <ManageUsers/>} />



          <Route path="/SDashboard" element={token && <DashboardSupplier/> } />
          <Route path="/SupplierDashboard" element={token && <SupplierDashboard />} />
          <Route path="/SupplierQuatation" element={token && <SupplierQuotationPage/>} />
          <Route path="/SupplierAcceptedQuatation" element={token && <AcceptedQuotationsForSupplier/>} />


        </Routes>
    </Router>
  );
};

export default App;
