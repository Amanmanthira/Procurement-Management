import React from 'react';
import { FaBoxOpen, FaPlusCircle, FaCogs, FaQuestionCircle, FaChartBar, FaListUl, FaTicketAlt, FaPlug, FaPlus, FaUserEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = ({ onQuoteRequest }) => {
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
        borderRadius: '0 70px 0  15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
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
            href="/ADashboard"
            className="menu-item"
            style={styles.menuItem}
          >
            <FaChartBar size={24} style={styles.icon} />
            <span style={styles.text}>Dashboard</span>
          </a>
        </li>
        <li>
          <a
            href="/AddUser"
            className="menu-item"
            style={styles.menuItem}
          >
            <FaPlus size={24} style={styles.icon} />
            <span style={styles.text}>Add New Users</span>
          </a>
        </li>
        <li>
          <a
            href="/ManageUser"
            className="menu-item"
            style={styles.menuItem}
          >
            <FaUserEdit size={24} style={styles.icon} />
            <span style={styles.text}>Manage Users</span>
          </a>
        </li>
        <li>
          <a
            href="/AdminDashboard"
            className="menu-item"
            style={styles.menuItem}
          >
            <FaBoxOpen size={24} style={styles.icon} />
            <span style={styles.text}>suppliers Products</span>
          </a>
        </li>
        
        <li>
          <button
            className="menu-item"
            style={styles.menuItem}
            onClick={onQuoteRequest} // Using the passed prop to open the modal
          >
            <FaPlusCircle size={24} style={styles.icon} />
            <span style={styles.text}>Send Quotations</span>
          </button>
        </li>
        <li>
          <Link
            to="/quotation-history"
            className="menu-item"
            style={styles.menuItem}
          >
            <FaListUl size={24} style={styles.icon} />
            <span style={styles.text}>View Quotations</span>
          </Link>
        </li>
        <li>
          <Link
            to="/AllAcceptedQuatation"
            className="menu-item"
            style={styles.menuItem}
          >
            <FaTicketAlt size={24} style={styles.icon} />
            <span style={styles.text}>Accepted Quotations</span>
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
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    transform: 'scale(1.05)',
  },
};

export default Sidebar;
