// src/components/PendingAppointmentsModal.js
import React, { useEffect, useRef } from 'react';

const PendingAppointmentsModal = ({ title, children, isVisible, onClose }) => {
    const modalRef = useRef();

    useEffect(() => {
        if (isVisible) {
            modalRef.current.focus(); // Set focus to the modal when it opens
            document.body.style.overflow = 'hidden'; // Disable scrolling on body
        } else {
            document.body.style.overflow = 'auto'; // Enable scrolling on body
        }

        return () => {
            document.body.style.overflow = 'auto'; // Cleanup on unmount
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div
                ref={modalRef}
                tabIndex={-1}
                className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full z-10"
            >
                <h3 className="text-2xl font-bold mb-4">{title}</h3>
                <div className="overflow-y-auto max-h-96">{children}</div>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PendingAppointmentsModal;