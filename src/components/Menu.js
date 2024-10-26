import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../axiosInstance';
import { 
  FaBars, 
  FaTimes, 
  FaCalendarAlt, 
  FaUsers, 
  FaCalendarPlus,
  FaBookmark
} from 'react-icons/fa';

const Menu = () => {
  const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const [tailorId, setTailorId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchTailorId = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const response = await axiosInstance.get('/api/tailor/id', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTailorId(response.data.tailor_id);
        } catch (error) {
          console.error('Error fetching tailor ID:', error);
        }
      }
    };

    fetchTailorId();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const menuItems = [
    {
      to: `/book-appointment/${tailorId}`,
      icon: <FaBookmark className="w-5 h-5" />,
      text: "Customer books app."
    },
    {
      to: "/customers",
      icon: <FaUsers className="w-5 h-5" />,
      text: "Customers"
    },
    {
      to: "/calendar",
      icon: <FaCalendarAlt className="w-5 h-5" />,
      text: "Calendar"
    },
    {
      to: "/appointments/new",
      icon: <FaCalendarPlus className="w-5 h-5" />,
      text: "Create Appointment"
    }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-gray-800 to-gray-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-white text-2xl font-semibold flex items-center">
            Tailor
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="text-white p-2 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? 
                <FaTimes className="w-6 h-6" /> : 
                <FaBars className="w-6 h-6" />
              }
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-gray-300 hover:text-white flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-700 transition duration-200"
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ml-4"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ml-4"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? 'max-h-96 opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-gray-300 hover:text-white flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout({ returnTo: window.location.origin });
                }}
                className="w-full text-left bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-4"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  loginWithRedirect();
                }}
                className="w-full text-left bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-4"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;