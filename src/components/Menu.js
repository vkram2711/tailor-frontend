import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from '../context/ThemeContext'; 
import { IoMoon } from "react-icons/io5";
import { IoSunny } from "react-icons/io5";

const Menu = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { isDarkMode, toggleTheme } = useTheme();

  const darkModeHandler = () => {
    toggleTheme(); 
    document.body.classList.toggle("dark", !isDarkMode);
  };

  return (
    <nav className={`p-4 shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className={`text-${isDarkMode ? 'gray-100' : 'gray-800'} text-xl font-bold`}>Tailor</Link>
        <div className="flex items-center">
          <button 
            onClick={darkModeHandler} 
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-400 ${isDarkMode ? 'bg-gray-600' : 'bg-white'} transition duration-200`}
          >
            {isDarkMode ? <IoSunny className="text-yellow-500" /> : <IoMoon className="text-gray-800" />}
          </button>
          <Link to="/customers" className={`text-${isDarkMode ? 'gray-100' : 'gray-800'} mx-4`}>Customers</Link>
          <Link to="/calendar" className={`text-${isDarkMode ? 'gray-100' : 'gray-800'} mx-4`}>Calendar</Link>
          <Link to="/appointments/new" className={`text-${isDarkMode ? 'gray-100' : 'gray-800'} mx-4`}>Create Appointment</Link> {/* Link to create appointment */}
          {isAuthenticated ? (
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className={`dark:bg-blue-900 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded`}
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className={`dark:bg-blue-900 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded`}
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menu;