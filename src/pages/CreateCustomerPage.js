import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const CreateCustomerPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme(); // Get dark mode state

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getAccessTokenSilently();
            await axiosInstance.post('/api/customers', {
                name,
                email,
                phone,
                gender
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/customers');
        } catch (error) {
            console.error('Error creating customer:', error);
        }
    };

    return (
        <div className={`max-w-md mx-auto p-6 shadow-lg rounded-lg mt-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Create New Customer</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-left text-gray-700">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-left text-gray-700">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-left text-gray-700">Phone:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-left text-gray-700">Gender:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button type="submit" className={`w-full py-2 ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-700'} text-white rounded-lg hover:${isDarkMode ? 'bg-indigo-500' : 'bg-gray-600'}`}>
              Create
            </button>
          </form>
          <Link to="/customers/" className={`mb-4 inline-block ${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} hover:bg-gray-600 text-white font-bold py-2 px-4 rounded`}>
              All Customers
          </Link>
        </div>
    );
};

export default CreateCustomerPage;