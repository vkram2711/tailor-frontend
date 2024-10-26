import React, { useState } from 'react';
import { FaClipboardList, FaClock, FaPhone } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; 

const PendingAppointmentsModal = ({ appointments, onConfirm, onClose }) => {
    const [loadingId, setLoadingId] = useState(null);

    if (!appointments.length) {
        return <p className="text-center text-gray-500">No pending appointments</p>;
    }

    const handleConfirm = async (appointmentId) => {
        setLoadingId(appointmentId); 
        await onConfirm(appointmentId);
        setLoadingId(null);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-8 rounded-2xl shadow-2xl max-w-4xl w-full mx-4">
                <div className="text-center mb-8">
                    <div className="h-16 w-16 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md">
                        <FaClipboardList />
                    </div>
                    <h3 className="text-3xl font-semibold text-gray-800 mt-4">Pending Appointments</h3>
                </div>

                <div className="overflow-y-auto max-h-[60vh]">
                    {appointments.map((appointment) => (
                        <div key={appointment.id} className="bg-white p-6 rounded-xl shadow-md mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 border-l-4 border-blue-300 pl-4">
                                    <FaClock className="text-blue-400" />
                                    <div>
                                        <p className="font-semibold text-gray-700">Date</p>
                                        <p className="text-gray-600">
                                            {new Date(appointment.date).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 border-l-4 border-green-300 pl-4">
                                    <FaPhone className="text-green-400" />
                                    <div>
                                        <p className="font-semibold text-gray-700">{appointment.customerName}</p>
                                        <p className="text-gray-600">{appointment.customerPhone}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 border-l-4 border-purple-300 pl-4">
                                <p className="font-semibold text-gray-700">Request</p>
                                <p className="text-gray-600">{appointment.request_work}</p>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => handleConfirm(appointment.id)}
                                    className={`px-6 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${loadingId === appointment.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loadingId === appointment.id} // Disable button if loading
                                >
                                    {loadingId === appointment.id ? (
                                        <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 inline-block" />
                                    ) : (
                                        'Confirm Appointment'
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingAppointmentsModal;