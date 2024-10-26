import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../axiosInstance';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { FaClipboardList, FaCalendarAlt, FaClock, FaCommentDots } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const CreateAppointmentPage = () => {
    const { t } = useTranslation();
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
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
                setErrorMessage(t('Failed to load customers'));
            } finally {
                setCustomersLoading(false);
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

            // Reset the form
            setSelectedCustomer('');
            setAppointmentDate('');
            setAppointmentTime('');
            setRequestWork('');
            setAdditionalNotes('');
            navigate('/calendar');
        } catch (error) {
            console.error('Error creating appointment:', error);
            setErrorMessage(t('Error creating appointment: ') + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-8">
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl shadow-lg p-4 sm:p-8">
                <div className="flex items-center mb-8">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                        <FaClipboardList className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-4">{t('Create Appointment')}</h1>
                </div>

                {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

                {customersLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-gray-700 font-semibold mb-2">{t('Select Customer')}</label>
                                <select
                                    value={selectedCustomer}
                                    onChange={(e) => setSelectedCustomer(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">-- {t('Select a customer')} --</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name} ({customer.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative">
                                <label className="block text-gray-700 font-semibold mb-2">{t('Appointment Date')}</label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="date"
                                        value={appointmentDate}
                                        onChange={(e) => setAppointmentDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-gray-700 font-semibold mb-2">{t('Appointment Time')}</label>
                                <div className="relative">
                                    <FaClock className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="time"
                                        value={appointmentTime}
                                        onChange={(e) => setAppointmentTime(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-gray-700 font-semibold mb-2">{t('Request Work')}</label>
                                <div className="relative">
                                    <FaCommentDots className="absolute left-3 top-3 text-gray-400" />
                                    <textarea
                                        value={requestWork}
                                        onChange={(e) => setRequestWork(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-gray-700 font-semibold mb-2">{t('Additional Notes')}</label>
                                <textarea
                                    value={additionalNotes}
                                    onChange={(e) => setAdditionalNotes(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                            <button
                                type="submit"
                                className={`flex-1 py-3 px-4 rounded-lg shadow-md font-semibold transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:shadow-lg'}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <Spinner />
                                        <span className="ml-2">{t('Creating...')}</span>
                                    </div>
                                ) : (
                                    t('Create Appointment')
                                )}
                            </button>
                            <Link
                                to="/calendar"
                                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 font-semibold text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center flex items-center justify-center"
                            >
                                {t('Back to Calendar')}
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateAppointmentPage;