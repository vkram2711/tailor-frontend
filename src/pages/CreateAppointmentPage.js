import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const CreateAppointmentPage = () => {
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [requestWork, setRequestWork] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        try {
            const token = await getAccessTokenSilently();

            // Step 1: Check if the customer exists by email
            const customerResponse = await axiosInstance.get(`/api/customers?email=${email}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Filter the customer response to find the exact match
            const existingCustomer = customerResponse.data.find(customer => customer.email === email);

            let customerId;

            // Step 2: If the customer exists, use their ID, otherwise create a new customer
            if (existingCustomer) {
                customerId = existingCustomer.id;
                console.log('Found existing customer ID:', customerId);
            } else {
                console.log('No existing customer found. Creating a new customer...');
                const newCustomerResponse = await axiosInstance.post('/api/customers', {
                    name: `${firstName} ${lastName}`,
                    email,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (newCustomerResponse.status === 201) {
                    customerId = newCustomerResponse.data.id; 
                    console.log('Created new customer ID:', customerId);
                } else {
                    throw new Error('Failed to create new customer');
                }
            }

            // Step 3: Create the appointment with the correct customerId
            const tailorId = "123"; // Replace with actual retrieval logic
            console.log('Creating appointment with customer ID:', customerId);

            await axiosInstance.post('/api/appointments', {
                customer_id: customerId,
                tailor_id: tailorId,
                date: appointmentDate,
                time: appointmentTime,
                request_work: requestWork,
                additional_notes: additionalNotes,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Reset form fields after successful creation
            setFirstName('');
            setLastName('');
            setEmail('');
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
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-left text-gray-700">First Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-left text-gray-700">Last Name:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-left text-gray-700">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
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
        </div>
    );
};

export default CreateAppointmentPage;