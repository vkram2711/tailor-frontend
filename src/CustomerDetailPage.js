// src/CustomerDetailPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from './axiosInstance';

const CustomerDetailPage = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const { getAccessTokenSilently } = useAuth0();

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
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{customer.name}</h1>
            <p>Email: {customer.email}</p>
            <p>Phone: {customer.phone}</p>
            <p>Measurements: {JSON.stringify(customer.measurements)}</p>
            <p>Additional Info: {JSON.stringify(customer.additional_info)}</p>
        </div>
    );
};

export default CustomerDetailPage;