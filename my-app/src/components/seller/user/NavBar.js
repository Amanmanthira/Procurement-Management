import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FaUserAlt, FaSignOutAlt, FaClock, FaMoon, FaSun } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const NavBar = () => {
  const [time, setTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Format hours, minutes, and seconds to display
  const hours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
  const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
  const seconds = time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds();

  return (
    <Navbar className="px-5" expand="lg" variant="dark" fixed="top" 
            style={{ background: isDarkMode ? 'linear-gradient(to right, #1c3b6d, #5f7cb7)' : 'linear-gradient(to right, #ff7f50, #ff6347)' }}>
      <Navbar.Brand href="#" className="font-weight-bold" style={{ fontSize: '1.5rem', color: '#fff' }}>
        <span className='fw-bold' style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)' }}>TechFix</span> 
        <span className='fw-light'> Supplier Dashboard</span>
      </Navbar.Brand>

      <Nav className="ml-auto d-flex align-items-center ">
        {/* Modern Clock - Circular Design */}
        <div className="clock-container mr-4">
          <div className="clock">
            <div className="time">{hours}:{minutes}:{seconds}</div>
          </div>
        </div>

     

        {/* User Dropdown */}
        <NavDropdown 
          title={<FaUserAlt size={24} />} 
          id="basic-nav-dropdown"
          align="end"
          style={{ borderColor: 'transparent' }}
          className="dropdown-animated ml-6"
        >
          <NavDropdown.Item href="#">Profile</NavDropdown.Item>
          <NavDropdown.Item href="#" onClick={() => {
            sessionStorage.removeItem('authToken');
            window.location.href = '/login';
          }}>
            Logout <FaSignOutAlt />
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
};

export default NavBar;
