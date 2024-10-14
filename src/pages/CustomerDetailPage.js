import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../axiosInstance';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const CustomerDetailPage = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme(); // Get dark mode state

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axiosInstance.get(`/api/customers/${customerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCustomer(response.data);
            } catch (error) {
                console.error('Error fetching customer:', error);
            }
        };

        fetchCustomer();
    }, [customerId, getAccessTokenSilently]);

    if (!customer) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                <p className={`text-${isDarkMode ? 'gray-400' : 'gray-700'}`}>Loading customer data...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
                <h1 className="text-2xl font-bold mb-4">{customer.name}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p className="text-gray-400">
                        <span className="font-semibold">Email:</span> {customer.email}
                    </p>
                    <p className="text-gray-400">
                        <span className="font-semibold">Phone:</span> {customer.phone}
                    </p>
                    <p className="text-gray-400">
                        <span className="font-semibold">Measurements:</span> {JSON.stringify(customer.measurements)}
                    </p>
                    <p className="text-gray-400">
                        <span className="font-semibold">Additional Info:</span> {JSON.stringify(customer.additional_info)}
                    </p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className={`mt-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-600'} hover:bg-gray-500 text-white font-bold py-2 px-4 rounded`}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default CustomerDetailPage;