import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../axiosInstance';
import { useTheme } from '../context/ThemeContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AppointmentModal from '../components/AppointmentModal';
import PendingAppointments from '../components/PendingAppointments';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { isDarkMode } = useTheme();
    const [appointments, setAppointments] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
    const [pendingAppointmentsModalVisible, setPendingAppointmentsModalVisible] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = await getAccessTokenSilently();
            
            // Fetch appointments
            const appointmentsResponse = await axiosInstance.get('/api/appointments', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(appointmentsResponse.data);
            
            // Fetch customers
            const customersResponse = await axiosInstance.get('/api/customers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCustomers(customersResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('Error fetching data: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEvent = (event) => {
        setSelectedAppointment(event.appointmentData);
        setAppointmentModalVisible(true);
    };

    const handleCloseAppointmentModal = () => {
        setAppointmentModalVisible(false);
        setSelectedAppointment(null);
    };

    const handleConfirmAppointment = () => {
        fetchAppointments(); // Refresh appointments after confirming
        setPendingAppointmentsModalVisible(false); // Close the pending appointments modal if needed
    };

    const handleShowPendingAppointments = () => {
        setPendingAppointmentsModalVisible(true); // Show pending appointments modal
    };

    if (loading) return <div>Loading...</div>;
    if (errorMessage) return <div className="text-red-500">{errorMessage}</div>;

    // Filter and map confirmed appointments
    const events = appointments
        .filter(appointment => appointment.confirmed)
        .map(appointment => {
            const customer = customers.find(c => c.id === appointment.customer_id);
            const customerName = customer ? customer.name : 'Unknown Customer';
            const customerPhone = customer ? customer.phone : 'Not found';
        
            return {
                id: appointment.id,
                title: `${customerName} - ${appointment.request_work}`,
                start: new Date(appointment.date),
                end: new Date(new Date(appointment.date).getTime() + 60 * 60 * 1000),
                allDay: false,
                appointmentData: {
                    ...appointment,
                    customerName,
                    customerPhone
                },
            };
        });

    return (
        <>
            <PendingAppointments 
                onConfirm={handleConfirmAppointment} 
                onShowMore={handleShowPendingAppointments} // Pass a function to show pending appointments
            />
            <div className={`max-w-5xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                    Appointment Calendar
                </h1>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    onSelectEvent={handleSelectEvent}
                />
            </div>
            {appointmentModalVisible && selectedAppointment && (
                <AppointmentModal
                    appointment={selectedAppointment}
                    onClose={handleCloseAppointmentModal}
                />
            )}
            {pendingAppointmentsModalVisible && (
                <PendingAppointments
                    onConfirm={handleConfirmAppointment} // Use the same confirm handler
                    onClose={() => setPendingAppointmentsModalVisible(false)} // Close the modal
                />
            )}
        </>
    );
};

export default CalendarPage;