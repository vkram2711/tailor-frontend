import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Spinner from '../components/Spinner';
import { FaEnvelope, FaPhone, FaVenusMars, FaRuler, FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import {useAuth} from "../AuthProvider";

const CustomerDetailPage = () => {
    const { t } = useTranslation();
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const { getAccessTokenSilently } = useAuth();
    const navigate = useNavigate();
    const capitalize = (text) => text && text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

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
                <Spinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-gray-50 shadow-lg p-8">
                <div className="text-center mb-10">
                    <div className="h-24 w-24 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-4xl mx-auto shadow-md">
                        {customer.name.charAt(0)}
                    </div>
                    <h1 className="text-4xl font-semibold text-gray-800 mt-4">{customer.name}</h1>
                    <p className="text-md text-gray-500">{customer.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12 mb-8">
                    <div className="flex items-center space-x-4 border-l-4 border-blue-300 pl-4">
                        <FaEnvelope className="text-blue-400 text-xl" />
                        <p className="text-gray-500">{customer.email}</p>
                    </div>
                    <div className="flex items-center space-x-4 border-l-4 border-green-300 pl-4">
                        <FaPhone className="text-green-400 text-xl" />
                        <p className="text-gray-500">{customer.phone || 'N/A'}</p>
                    </div>
                    <div className="flex items-center space-x-4 border-l-4 border-pink-300 pl-4">
                        <FaVenusMars className="text-pink-400 text-xl" />
                        <p className="text-gray-500">{capitalize(customer.gender || 'N/A')}</p>
                    </div>
                    <div className="flex items-start space-x-4 border-l-4 border-purple-300 pl-4">
                        <FaRuler className="text-purple-400 text-xl mt-1" />
                        <ul className="mt-1 text-gray-500 text-sm list-inside list-disc">
                            {customer.measurements.map((measurement, measurementIndex) => (
                                measurement.entries.map((entry, entryIndex) => (
                                    <li key={`${measurementIndex}-${entryIndex}`}>
                                        {entry.type}: {entry.value}
                                    </li>
                                ))
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-start space-x-4 border-l-4 border-indigo-300 pl-4">
                        <FaInfoCircle className="text-indigo-400 text-xl mt-1" />
                        <div className="text-gray-500 text-sm items-start">
                            <p style={{textAlign: 'left'}}>{customer.additional_info?.notes || t('No notes')}</p>
                            <p style={{textAlign: 'left'}}className="mt-1">{customer.additional_info?.preferences || t('No preferences')}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
                    >
                        {t('Back to Customers')}
                    </button>
                    <button
                        onClick={() => navigate(`/appointments/new?customerId=${customer.id}`)}
                        className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
                    >
                        {t('New Appointment')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailPage;