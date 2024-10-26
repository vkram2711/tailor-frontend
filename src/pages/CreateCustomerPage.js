import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaRuler, FaNotesMedical, FaHeart, FaPlus, FaTrash } from 'react-icons/fa';

const CreateCustomerPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [measurementEntries, setMeasurementEntries] = useState([{ type: '', value: 0 }]);
    const [notes, setNotes] = useState('');
    const [preferences, setPreferences] = useState('');
    const { getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getAccessTokenSilently();
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
                }
            };

            await axiosInstance.post('/api/customers', customerData, {
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
        <div className="max-w-2xl mx-auto p-4 sm:p-8">
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl shadow-lg p-4 sm:p-8">
                <div className="flex items-center mb-8">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                        <FaUser className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-4">Create New Customer</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Email Address"
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
                                    placeholder="Additional notes about the customer"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    <FaHeart className="inline mr-2" />
                                    Preferences
                                </label>
                                <textarea
                                    value={preferences}
                                    onChange={(e) => setPreferences(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Customer preferences"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Create Customer
                        </button>
                        <Link
                            to="/customers"
                            className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCustomerPage;