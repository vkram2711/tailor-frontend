import React, { useEffect, useState, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axiosInstance from '../axiosInstance';
import AppointmentModal from '../components/AppointmentModal';
import PendingAppointmentsModal from '../components/PendingAppointmentsModal'; // Import the new modal component
import { FaCalendar, FaClock, FaUserClock } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { useTranslation } from 'react-i18next';
import {useAuth} from "../AuthProvider";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const { t } = useTranslation();
    const { getAccessTokenSilently } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
    const [pendingModalVisible, setPendingModalVisible] = useState(false);
    const modalRef = useRef([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = await getAccessTokenSilently();
            const [appointmentsResponse, customersResponse] = await Promise.all([
                axiosInstance.get('/api/appointments', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axiosInstance.get('/api/customers', {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ]);

            setAppointments(appointmentsResponse.data);
            setCustomers(customersResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage(t('Error fetching data: ') + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAppointment = async (appointmentId) => {
        try {
            const token = await getAccessTokenSilently();
            await axiosInstance.put(`/api/appointments/${appointmentId}/confirm`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchData(); // Refresh the data
        } catch (error) {
            console.error('Error confirming appointment:', error);
            setErrorMessage(t('Failed to confirm appointment'));
        }
    };

    const handleSelectEvent = (event) => {
        setSelectedAppointment(event.appointmentData);
        setAppointmentModalVisible(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="container mx-auto px-6 py-10">
                <div className="rounded-xl bg-red-50 p-6 text-red-500 text-center">
                    {errorMessage}
                </div>
            </div>
        );
    }

    const events = appointments
        .filter(appointment => appointment.confirmed)
        .map(appointment => {
            const customer = customers.find(c => c.id === appointment.customer_id);
            const customerName = customer ? customer.name : t('Unknown Customer');
            const customerPhone = customer ? customer.phone : t('Not found');
        
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

    const pendingEvents = appointments.filter(appointment => !appointment.confirmed).map(appointment => {
        const customer = customers.find(c => c.id === appointment.customer_id);
        return {
            ...appointment,
            customerName: customer ? customer.name : t('Unknown Customer'),
            customerPhone: customer ? customer.phone : t('Not found')
        };
    });

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-gray-50 shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="h-20 w-20 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-3xl mx-auto shadow-md">
                        <FaCalendar />
                    </div>
                    <h1 className="text-4xl font-semibold text-gray-800 mt-4">
                        {t('Appointment Calendar')}
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center space-x-4 border-l-4 border-blue-300 pl-4 py-2">
                        <FaClock className="text-blue-400 text-xl" />
                        <div>
                            <h3 className="font-semibold text-gray-700">{t('Total Appointments')}</h3>
                            <p className="text-gray-500">{events.length} {t('Scheduled')}</p>
                        </div>
                    </div>
                    <div 
                        className="flex items-center space-x-4 border-l-4 border-green-300 pl-4 py-2 cursor-pointer hover:bg-green-50 transition-colors"
                        onClick={() => setPendingModalVisible(true)}
                    >
                        <FaUserClock className="text-green-400 text-xl" />
                        <div>
                            <h3 className="font-semibold text-gray-700">{t('Pending Appointments')}</h3>
                            <p className="text-gray-500">{pendingEvents.length} {t('Pending')}</p>
                        </div>
                    </div>
                </div>

                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    onSelectEvent={handleSelectEvent}
                />
            </div>

            {/* Render Pending Appointments Modal */}
            {pendingModalVisible && (
                <PendingAppointmentsModal
                    appointments={pendingEvents}
                    onConfirm={handleConfirmAppointment}
                    onClose={() => setPendingModalVisible(false)}
                />
            )}

            {/* Render Appointment Modal */}
            {appointmentModalVisible && (
                <AppointmentModal
                    appointment={selectedAppointment}
                    onClose={() => setAppointmentModalVisible(false)}
                />
            )}
        </div>
    );
};

export default CalendarPage;