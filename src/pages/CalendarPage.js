import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axiosInstance from '../axiosInstance';
import { useTheme } from '../context/ThemeContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AppointmentModal from '../components/AppointmentModal';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { isDarkMode } = useTheme();
    const [appointments, setAppointments] = useState([]);
    const [customers, setCustomers] = useState([]); // State for customers
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
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

        fetchData();
    }, [getAccessTokenSilently]);

    const handleSelectEvent = (event) => {
        setSelectedAppointment(event.appointmentData); // Store full appointment data
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedAppointment(null);
    };

    if (loading) return <div>Loading...</div>;
    if (errorMessage) return <div className="text-red-500">{errorMessage}</div>;

    // Combine appointments with customer names
    const events = appointments.map(appointment => {
        const customer = customers.find(c => c.id === appointment.customer_id); // Find customer by ID
        const customerName = customer ? customer.name : 'Unknown Customer';
    
        return {
            id: appointment.id,
            title: `${customerName} - ${appointment.request_work}`,
            start: new Date(appointment.date),
            end: new Date(new Date(appointment.date).getTime() + 60 * 60 * 1000),
            allDay: false,
            appointmentData: {
                ...appointment,
                customerName, // Pass the customer name instead of ID
            },
        };
    });

    return (
        <div className={`max-w-5xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Appointments Calendar</h1>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                views={['month']}
                step={60}
                selectable
                popup
                onSelectEvent={handleSelectEvent}
                className={isDarkMode ? 'bg-gray-800' : 'bg-white'}
            />
            <AppointmentModal 
                appointment={selectedAppointment} 
                onClose={handleCloseModal} 
                visible={modalVisible}
            />
        </div>
    );
};

export default CalendarPage;