const AppointmentModal = ({ appointment, onClose, visible }) => {
    if (!appointment) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 ${visible ? 'block' : 'hidden'} z-50`}>
            <div className="bg-white rounded p-4 w-96 shadow-lg"> {/* Shadow for better visibility */}
                <h2 className="text-xl font-bold mb-2">Appointment Details</h2>
                <p><strong>Request Work:</strong> {appointment.request_work}</p>
                <p><strong>Customer Name:</strong> {appointment.customerName}</p> {/* Display customer name */}
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleString()}</p> {/* Format date */}
                <p><strong>Additional Notes:</strong> {appointment.additional_notes}</p>
                <button onClick={onClose} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

export default AppointmentModal