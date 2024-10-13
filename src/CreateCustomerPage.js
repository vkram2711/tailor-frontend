// src/CreateCustomerPage.js

import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';

const CreateCustomerPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

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
                <div>
                    <label>Gender:</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateCustomerPage;