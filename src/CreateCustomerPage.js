// src/CreateCustomerPage.js

import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';

const CreateCustomerPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getAccessTokenSilently();
            await axiosInstance.post('/api/customers', {
                name,
                email,
                phone
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
        <div>
            <h1>Create New Customer</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateCustomerPage;