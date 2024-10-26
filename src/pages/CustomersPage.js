import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../axiosInstance';
import CustomerList from '../components/CustomerList';
import { FaUserPlus, FaUsers } from 'react-icons/fa';
import Spinner from '../components/Spinner';

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();

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
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [getAccessTokenSilently]);

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center mb-4 sm:mb-0">
                    <FaUsers className="text-4xl text-gray-800 mr-4" />
                    <h1 className="text-3xl font-semibold text-gray-800">Customers</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <Link
                        to="/customers/new"
                        className="inline-flex items-center bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <FaUserPlus className="mr-2" />
                        Add Customer
                    </Link>
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            ) : (
                <CustomerList customers={customers} />
            )}
        </div>
    );
};

export default CustomersPage;