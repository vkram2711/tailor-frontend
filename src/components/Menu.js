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
  FaBookmark,
  FaLanguage
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Menu = () => {
  const { t, i18n } = useTranslation();
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
      text: t("Customer books app.")
    },
    {
      to: "/customers",
      icon: <FaUsers className="w-5 h-5" />,
      text: t("Customers")
    },
    {
      to: "/calendar",
      icon: <FaCalendarAlt className="w-5 h-5" />,
      text: t("Calendar")
    },
    {
      to: "/appointments/new",
      icon: <FaCalendarPlus className="w-5 h-5" />,
      text: t("Create Appointment")
    }
  ];

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setIsOpen(false); // Close menu after changing language
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-gray-800 to-gray-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-white text-2xl font-semibold flex items-center">
            Tailor
          </Link>

          {/* Mobile menu button and language switcher */}
          <div className="md:hidden flex items-center">
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
            <button
              type="button"
              className="flex items-center text-gray-300 hover:text-white focus:outline-none ml-2"
              onClick={(e) => {
                e.stopPropagation();
                handleLanguageChange(i18n.language === 'en' ? 'es' : 'en');
              }}
            >
              <FaLanguage className="mr-1" />
              {i18n.language.toUpperCase()}
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
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="flex items-center text-gray-300 hover:text-white focus:outline-none"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <FaLanguage className="mr-1" />
                  {i18n.language.toUpperCase()}
                </button>
              </div>
              <div className={`absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 transition-opacity duration-300 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600"
                  onClick={() => handleLanguageChange('en')}
                >
                  🇺🇸 English
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600"
                  onClick={() => handleLanguageChange('es')}
                >
                  🇪🇸 Español
                </button>
              </div>
            </div>
            {isAuthenticated ? (
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ml-4"
              >
                {t('Log Out')}
              </button>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ml-4"
              >
                {t('Login / Sign Up')}
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
            <button
              type="button"
              className="flex items-center text-gray-300 hover:text-white focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                handleLanguageChange(i18n.language === 'en' ? 'es' : 'en');
              }}
            >
              <FaLanguage className="mr-1" />
              {i18n.language.toUpperCase()}
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout({ returnTo: window.location.origin });
                }}
                className="w-full text-left bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-4"
              >
                {t('Log Out')}
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  loginWithRedirect();
                }}
                className="w-full text-left bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-4"
              >
                {t('Login / Sign Up')}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;