import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const CustomerCard = ({ customer }) => {
  const { isDarkMode, themes } = useTheme();

  return (
    <div className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${isDarkMode ? themes.dark.backgroundColor : themes.light.backgroundColor}`}>
      <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? themes.dark.textColor : themes.light.textColor}`}>{customer.name}</h2>
      <p className={`text-secondary ${isDarkMode ? themes.dark.textColor : themes.light.textColor}`}>{customer.email}</p>
      <p className={`text-secondary ${isDarkMode ? themes.dark.textColor : themes.light.textColor}`}>{customer.phone}</p>
      <Link to={`/customers/${customer.id}`} className={`bg-${isDarkMode ? themes.dark.primaryColor : themes.light.primaryColor} text-white font-bold py-2 px-4 rounded`}>View Details</Link>
    </div>
  );
};

export default CustomerCard;