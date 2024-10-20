import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { useTheme } from '../context/ThemeContext';

const CustomerBookAppointment = () => {
    const { tailorId } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [requestWork, setRequestWork] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await axiosInstance.get(`/api/tailors/${tailorId}/customers/check`, { params: { email } });
            if (response.data.exists) {
                setCustomerId(response.data.id);
                setStep('booking');
                setMessage("Welcome back! We've found your information. You can now book your appointment.");
            } else {
                setStep('registration');
                setMessage("We couldn't find your email in our system. Please provide some additional information to register.");
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await axiosInstance.post('/api/customers', {
                name,
                email,
                phone,
                gender,
                tailor_id: tailorId
            });
            setCustomerId(response.data.id);
            setStep('booking');
            setMessage("Thank you for registering! You can now book your appointment.");
        } catch (error) {
            setError('Error creating customer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAppointmentBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await axiosInstance.post(`/api/tailors/${tailorId}/appointments/book`, {
                customer_id: customerId,
                date: `${appointmentDate}T${appointmentTime}`,
                request_work: requestWork,
                additional_notes: additionalNotes
            });
            navigate('/thank-you');
        } catch (error) {
            setError('Error booking appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep('email');
        setError('');
        setMessage('');
    };

    const renderStep = () => {
        switch (step) {
            case 'email':
                return (
                    <>
                        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Enter Your Email</h2>
                        <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Please enter your email address to begin the booking process.</p>
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                                />
                            </div>
                            <button type="submit" className={`w-full py-2 ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-700'} text-white rounded-lg hover:${isDarkMode ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                                Next
                            </button>
                        </form>
                    </>
                );
            case 'registration':
                return (
                    <>
                        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Complete Your Registration</h2>
                        <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Please provide the following information to complete your registration.</p>
                        <form onSubmit={handleRegistration} className="space-y-4">
                            <div>
                                <label className={`block text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className={`block text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone:</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className={`block text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gender:</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <button type="submit" className={`w-full py-2 ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-700'} text-white rounded-lg hover:${isDarkMode ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                                Register
                            </button>
                        </form>
                    </>
                );
            case 'booking':
                return (
                    <>
                        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Book Your Appointment</h2>
                        <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Please select your preferred date and time, and provide details about the service you need.</p>
                        <form onSubmit={handleAppointmentBooking} className="space-y-4">
                            <div>
                                <label className={`block text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Appointment Date:</label>
                                <input
                                    type="date"
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className={`block text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Appointment Time:</label>
                                <input
                                    type="time"
                                    value={appointmentTime}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className={`block text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Request Work:</label>
                                <textarea
                                    value={requestWork}
                                    onChange={(e) => setRequestWork(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className={`block text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Additional Notes:</label>
                                <textarea
                                    value={additionalNotes}
                                    onChange={(e) => setAdditionalNotes(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500"
                                />
                            </div>
                            <button type="submit" className={`w-full py-2 ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-700'} text-white rounded-lg hover:${isDarkMode ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                                Book Appointment
                            </button>
                        </form>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`max-w-md mx-auto p-6 shadow-lg rounded-lg mt-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Book Appointment</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {message && <p className={`${isDarkMode ? 'text-green-300' : 'text-green-600'} mb-4`}>{message}</p>}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {renderStep()}
                    {step !== 'email' && (
                        <button 
                            onClick={handleBack} 
                            className={`mt-4 px-4 py-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} text-${isDarkMode ? 'white' : 'gray-800'} rounded-lg hover:bg-${isDarkMode ? 'gray-500' : 'gray-400'}`}
                        >
                            Back to Email
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default CustomerBookAppointment;