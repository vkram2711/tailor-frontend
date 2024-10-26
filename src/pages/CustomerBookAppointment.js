import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { FaUser, FaEnvelope, FaPhone, FaRuler, FaNotesMedical, FaHeart, FaPlus, FaTrash, FaClock, FaCalendar } from 'react-icons/fa';

const CustomerBookAppointment = () => {
    const { tailorId } = useParams();
    const navigate = useNavigate();

    // Step state
    const [step, setStep] = useState('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [customerId, setCustomerId] = useState(null);

    // Customer information state
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [measurementEntries, setMeasurementEntries] = useState([{ type: '', value: 0 }]);
    const [notes, setNotes] = useState('');
    const [preferences, setPreferences] = useState('');

    // Appointment state
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [requestWork, setRequestWork] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');

    // Measurement handlers
    const handleMeasurementChange = (index, field, value) => {
        const newEntries = [...measurementEntries];
        newEntries[index] = {
            ...newEntries[index],
            [field]: field === 'value' ? parseFloat(value) : value
        };
        setMeasurementEntries(newEntries);
    };

    const addMeasurementEntry = () => {
        setMeasurementEntries([...measurementEntries, { type: '', value: 0 }]);
    };

    const removeMeasurementEntry = (index) => {
        setMeasurementEntries(measurementEntries.filter((_, i) => i !== index));
    };

    // Form submission handlers
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
            const measurements = [{
                entries: measurementEntries,
                date: new Date().toISOString(),
            }];

            const customerData = {
                name,
                email,
                phone,
                gender,
                measurements,
                additional_info: {
                    notes,
                    preferences
                },
                tailor_id: tailorId
            };

            const response = await axiosInstance.post('/api/public/customers', customerData);
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

    const renderEmailStep = () => (
        <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl shadow-lg p-4 sm:p-8">
            <div className="flex items-center mb-8">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-4">Book Appointment</h1>
            </div>
            <p className="mb-4 text-gray-600">Please enter your email address to begin the booking process.</p>
            <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="relative">
                    <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                    Continue
                </button>
            </form>
        </div>
    );

    const renderRegistrationStep = () => (
        <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl shadow-lg p-4 sm:p-8">
            <div className="flex items-center mb-8">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                    <FaUser className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-4">Complete Your Profile</h1>
            </div>

            <form onSubmit={handleRegistration} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information Section */}
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block text-gray-700 font-semibold mb-2">Name</label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Full Name"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Phone Number"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Measurements Section */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                <FaRuler className="inline mr-2" />
                                Measurements
                            </label>
                            <div className="space-y-3">
                                {measurementEntries.map((entry, index) => (
                                    <div key={index} className="flex flex-wrap gap-2">
                                        <input
                                            type="text"
                                            placeholder="Type (e.g., chest, waist)"
                                            value={entry.type}
                                            onChange={(e) => handleMeasurementChange(index, 'type', e.target.value)}
                                            className="flex-1 min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Value"
                                            value={entry.value}
                                            onChange={(e) => handleMeasurementChange(index, 'value', e.target.value)}
                                            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeMeasurementEntry(index)}
                                            className="p-2 text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addMeasurementEntry}
                                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                                >
                                    <FaPlus className="mr-2" /> Add Measurement
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                <FaNotesMedical className="inline mr-2" />
                                Notes
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                placeholder="Additional notes about your preferences"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                <FaHeart className="inline mr-2" />
                                Style Preferences
                            </label>
                            <textarea
                                value={preferences}
                                onChange={(e) => setPreferences(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                placeholder="Your style preferences"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Continue to Booking
                    </button>
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );

    const renderBookingStep = () => (
        <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl shadow-lg p-4 sm:p-8">
            <div className="flex items-center mb-8">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                    <FaClock className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-4">Book Your Appointment</h1>
            </div>

            <form onSubmit={handleAppointmentBooking} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                                <FaCalendar className="inline mr-2" />
                                Appointment Date
                            </label>
                            <input
                                type="date"
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                <FaClock className="inline mr-2" />
                                Appointment Time
                            </label>
                            <input
                                type="time"
                                value={appointmentTime}
                                onChange={(e) => setAppointmentTime(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                <FaNotesMedical className="inline mr-2" />
                                Service Details
                            </label>
                            <textarea
                                value={requestWork}
                                onChange={(e) => setRequestWork(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                placeholder="Describe the service you need (e.g., suit alteration, dress fitting)"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                <FaHeart className="inline mr-2" />
                                Additional Notes
                            </label>
                            <textarea
                                value={additionalNotes}
                                onChange={(e) => setAdditionalNotes(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                placeholder="Any additional information or special requests"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Confirm Booking
                    </button>
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );

    const renderStep = () => {
        switch (step) {
            case 'email':
                return renderEmailStep();
            case 'registration':
                return renderRegistrationStep();
            case 'booking':
                return renderBookingStep();
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}
            {message && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600">{message}</p>
                </div>
            )}
            {loading ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            ) : (
                renderStep()
            )}
        </div>
    );
};

export default CustomerBookAppointment;