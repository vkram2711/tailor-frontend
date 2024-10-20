// src/components/PendingAppointments.js
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../axiosInstance';
import { useTheme } from '../context/ThemeContext';
import PendingAppointmentsModal from '../components/PendingAppointmentsModal';

const PendingAppointments = ({ onConfirm }) => {
    const { getAccessTokenSilently } = useAuth0();
    const { isDarkMode } = useTheme();
    const [pendingAppointments, setPendingAppointments] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

    useEffect(() => {
        fetchPendingAppointments();
    }, []);

    const fetchPendingAppointments = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await axiosInstance.get(`/api/tailor/pending-appointments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPendingAppointments(response.data);

            const customersResponse = await axiosInstance.get('/api/customers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCustomers(customersResponse.data);
        } catch (error) {
            console.error('Error fetching pending appointments:', error);
            setError('Failed to load pending appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (appointmentId) => {
        try {
            const token = await getAccessTokenSilently();
            await axiosInstance.put(`/api/appointments/${appointmentId}/confirm`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Remove the confirmed appointment from the list
            setPendingAppointments(pendingAppointments.filter(app => app.id !== appointmentId));
            onConfirm(); // Call onConfirm to update calendar when confirmed
        } catch (error) {
            console.error('Error confirming appointment:', error);
            setError('Failed to confirm appointment');
        }
    };

    const handleOpenModal = () => setModalVisible(true);
    const handleCloseModal = () => setModalVisible(false);

    if (loading) {
        return <div>Loading pending appointments...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const pendingEvents = pendingAppointments
        .map(appointment => {
            const customer = customers.find(c => c.id === appointment.customer_id);
            const customerName = customer ? customer.name : 'Unknown Customer';
            const customerPhone = customer ? customer.phone : 'Not found';
        
            return {
                id: appointment.id,
                appointmentData: {
                    ...appointment,
                    customerName,
                    customerPhone
                },
            };
        });

    return (
        <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">Pending Appointments</h2>
            {pendingEvents.length === 0 ? (
                <p>No pending appointments</p>
            ) : (
                <>
                    <div className="flex space-x-4">
                        {pendingEvents.slice(0, 3).map((appointment) => (
                            <div
                                key={appointment.id}
                                className={`border p-4 rounded ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} flex-1`}
                            >
                                <p>Date: {new Date(appointment.appointmentData.date).toLocaleString()}</p>
                                <p>Customer: {appointment.appointmentData.customerName}</p>
                                <p>Phone: {appointment.appointmentData.customerPhone}</p>
                                <p>Request: {appointment.appointmentData.request_work}</p>
                                <button
                                    onClick={() => handleConfirm(appointment.appointmentData.id)}
                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Confirm Appointment
                                </button>
                            </div>
                        ))}
                    </div>
                    {pendingEvents.length > 3 && (
                        <div className="mt-4">
                            <button
                                onClick={handleOpenModal}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                View All Pending Appointments
                            </button>
                        </div>
                    )}
                </>
            )}

            <PendingAppointmentsModal title="All Pending Appointments" isVisible={modalVisible} onClose={handleCloseModal}>
                {pendingEvents.map((appointment) => (
                    <div
                        key={appointment.appointmentData.id}
                        className={`border p-4 rounded mb-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
                    >
                        <p>Date: {new Date(appointment.appointmentData.date).toLocaleString()}</p>
                        <p>Customer: {appointment.appointmentData.customerName}</p>
                        <p>Phone: {appointment.appointmentData.customerPhone}</p>
                        <p>Request: {appointment.appointmentData.request_work}</p>
                        <button
                            onClick={() => handleConfirm(appointment.appointmentData.id)}
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Confirm Appointment
                        </button>
                    </div>
                ))}
            </PendingAppointmentsModal>
        </div>
    );
};

export default PendingAppointments;