import React from 'react';
import { useTranslation } from 'react-i18next';

const AppointmentModal = ({ appointment, onClose }) => {
    const { t } = useTranslation();

    if (!appointment) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6 rounded-2xl shadow-2xl w-96 mx-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t("Appointment Details")}</h2>
                
                <div className="border-l-4 border-blue-300 pl-4 mb-4">
                    <p className="font-semibold text-gray-700">
                        <strong>{t("Request Work")}:</strong> {appointment.request_work}
                    </p>
                </div>
                
                <div className="border-l-4 border-red-300 pl-4 mb-4">
                    <p className="font-semibold text-gray-700">
                        <strong>{t("Customer Name")}:</strong> {appointment.customerName}
                    </p>
                </div>
                
                <div className="border-l-4 border-green-300 pl-4 mb-4">
                    <p className="font-semibold text-gray-700">
                        <strong>{t("Phone")}:</strong> {appointment.customerPhone}
                    </p>
                </div>
                
                <div className="border-l-4 border-yellow-300 pl-4 mb-4">
                    <p className="font-semibold text-gray-700">
                        <strong>{t("Date")}:</strong> {new Date(appointment.date).toLocaleString()}
                    </p>
                </div>
                
                <div className="border-l-4 border-purple-300 pl-4 mb-4">
                    <p className="font-semibold text-gray-700">
                        <strong>{t("Additional Notes")}:</strong> {appointment.additional_notes || t("No notes")}
                    </p>
                </div>
                
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        {t("Close")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;