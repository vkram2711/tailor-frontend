import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const CustomerCard = ({ customer }) => {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-gray-50 shadow-lg transition-transform transform-gpu duration-300 ease-in-out">
      <div className="flex flex-col sm:flex-row items-center mb-4">
        <div className="h-16 w-16 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-2xl">
          {customer.name.charAt(0)}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-gray-800">{customer.name}</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2">
            <p className="text-gray-600 flex items-center">
              <FaEnvelope className="mr-2" /> {customer.email}
            </p>
            <p className="text-gray-600 flex items-center mt-2 sm:mt-0">
              <FaPhone className="mr-2" /> {customer.phone || 'N/A'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link 
          to={`/customers/${customer.id}`} 
          className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
        >
          View Details
        </Link>
        <Link
          to={`/appointments/new?customerId=${customer.id}`}
          className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
        >
          New Appointment
        </Link>
      </div>
    </div>
  );
};

export default CustomerCard;