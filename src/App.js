import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginButton from './components/LoginButton';
import SignupButton from './components/SignUpButton';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CreateCustomerPage from './pages/CreateCustomerPage';
import CreateAppointmentPage from './pages/CreateAppointmentPage';
import CalendarPage from './pages/CalendarPage';
import CustomerBookAppointment from './pages/CustomerBookAppointment';
import ThankYouPage from './pages/ThankYouPage';
import Menu from './components/Menu';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Menu />
        <main className="flex-grow bg-gradient-to-br from-blue-50 to-gray-50">
          <div className="container mx-auto px-4 pt-16 pb-8 min-h-[calc(100vh-64px)]">
            <Routes>
              <Route path="/customers/new" element={<CreateCustomerPage />} />
              <Route path="/customers/:customerId" element={<CustomerDetailPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/appointments/new" element={<CreateAppointmentPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/" exact element={<CustomersPage />} />
              <Route path="/book-appointment/:tailorId" element={<CustomerBookAppointment />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;