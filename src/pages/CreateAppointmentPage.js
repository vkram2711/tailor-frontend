import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useTheme } from '../context/ThemeContext';

const CreateAppointmentPage = () => {
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const location = useLocation();

    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [requestWork, setRequestWork] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [customersLoading, setCustomersLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const preSelectedCustomerId = queryParams.get('customerId');

    // Fetch customers and handle pre-selected customer
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await axiosInstance.get('/api/customers', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCustomers(response.data);
                if (preSelectedCustomerId) {
                    setSelectedCustomer(preSelectedCustomerId);
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
                setErrorMessage('Failed to load customers');
            } finally {
                setCustomersLoading(false); // Once data is fetched, turn off loading
            }
        };

        fetchCustomers();
    }, [getAccessTokenSilently, preSelectedCustomerId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        try {
            const token = await getAccessTokenSilently();
            const tailorId = "123"; // Replace with actual retrieval logic

            await axiosInstance.post('/api/appointments', {
                customer_id: selectedCustomer,
                tailor_id: tailorId,
                date: appointmentDate,
                time: appointmentTime,
                request_work: requestWork,
                additional_notes: additionalNotes,
                confirmed: true
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSelectedCustomer('');
            setAppointmentDate('');
            setAppointmentTime('');
            setRequestWork('');
            setAdditionalNotes('');
            navigate('/calendar');
        } catch (error) {
            console.error('Error creating appointment:', error);
            setErrorMessage('Error creating appointment: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`max-w-md mx-auto p-6 shadow-lg rounded-lg mt-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Create New Appointment</h1>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            
            {customersLoading ? (
                <div className="flex justify-center items-center h-64">
                    {/* Tailwind Spinner */}
                    <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-left text-gray-700">Select Customer:</label>
                        <select
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">-- Select a customer --</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name} ({customer.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-left text-gray-700">Appointment Date:</label>
                        <input
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-left text-gray-700">Appointment Time:</label>
                        <input
                            type="time"
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-left text-gray-700">Request Work:</label>
                        <textarea
                            value={requestWork}
                            onChange={(e) => setRequestWork(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-left text-gray-700">Additional Notes:</label>
                        <textarea
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows={3}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Appointment'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default CreateAppointmentPage;