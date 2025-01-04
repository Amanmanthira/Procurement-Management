import React from 'react';
import { FaBoxOpen, FaPlusCircle, FaCogs, FaQuestionCircle, FaChartBar, FaListUl, FaTicketAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className="sidebar-menu"
      style={{
        width: '280px',
        height: '100vh',
        background: 'linear-gradient(to right, #1c3b6d, #5f7cb7)',
        color: 'white',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderRadius: '0 70px 0  15px', // Rounded corners
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', // Added shadow for elevation
      }}
    >
      <ul
        className="menu-list"
        style={{
          listStyle: 'none',
          padding: '0',
          margin: '0',
        }}
      >
        <li>
          <a
            href="/SDashboard"
            className="menu-item"
            style={styles.menuItem}
          >
            <FaChartBar size={24} style={styles.icon} />
            <span style={styles.text}>Dashboard</span>
          </a>
        </li>
        <li>
          <a
            href="/SupplierDashboard"
            className="menu-item"
            style={styles.menuItem}
          >
            <FaPlusCircle size={24} style={styles.icon} />
            <span style={styles.text}>Manage Products</span>
          </a>
        </li>
        <li>
          <Link
            to="/SupplierQuatation"
            className="menu-item"
            style={styles.menuItem}
          >
            <FaListUl size={24} style={styles.icon} />
            <span style={styles.text}>View Quations</span>
          </Link>
        </li>
        <li>
          <Link
            to="/SupplierAcceptedQuatation"
            className="menu-item"
            style={styles.menuItem}
          >
            <FaTicketAlt size={24} style={styles.icon} />
            <span style={styles.text}>Accepted Quations</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

const styles = {
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    marginBottom: '15px',
    color: 'white',
    textDecoration: 'none',
    position: 'relative',
  },
  icon: {
    transition: 'color 0.3s ease',
  },
  text: {
    marginLeft: '15px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'font-weight 0.3s ease',
  },
  menuItemHover: {
    backgroundColor: '#3949ab',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)', // Added shadow effect
    transform: 'scale(1.05)', // Slight scaling on hover
  },
};

export default Sidebar;
