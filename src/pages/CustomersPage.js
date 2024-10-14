import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../axiosInstance';
import CustomerList from '../components/CustomerList';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const { getAccessTokenSilently } = useAuth0();
    const { isDarkMode } = useTheme(); // Get dark mode state

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axiosInstance.get('/api/customers', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, [getAccessTokenSilently]);

    return (
        <div className={`container mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Customer List</h1>
            <Link
                to="/customers/new"
                className={`mb-4 inline-block ${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} hover:bg-gray-500 text-white font-bold py-2 px-4 rounded`}
            >
                Add Customer
            </Link>
            <CustomerList customers={customers} />
        </div>
    );
};

export default CustomersPage;