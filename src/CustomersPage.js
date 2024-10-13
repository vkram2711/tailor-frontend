// src/CustomersPage.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from './axiosInstance';
import authConfig from './auth_config.json';

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = await getAccessTokenSilently({audience: authConfig.audience});
                console.log(token)

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
        <div>
            <h1>Customers</h1>
            <Link to="/customers/new">Create New Customer</Link>
            <ul>
                {customers.map((customer) => (
                    <li key={customer.id}>
                        <h2>{customer.name}</h2>
                        <p>Email: {customer.email}</p>
                        <p>Phone: {customer.phone}</p>
                        <Link to={`/customers/${customer.id}`}>View Details</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomersPage;