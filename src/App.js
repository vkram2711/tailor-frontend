import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginButton from './components/LoginButton';
import SignupButton from './components/SignUpButton';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CreateCustomerPage from './pages/CreateCustomerPage';
import CreateAppointmentPage from './pages/CreateAppointmentPage';
import CalendarPage from './pages/CalendarPage';
import Menu from './components/Menu'

const App = () => {
  return (
    <Router>
      <div className="w-full">
        <div className="">
          <Menu /> 
          <div className="text-center bg-white p-8 shadow-md rounded-lg">
            <Routes>
              <Route path="/customers/new" element={<CreateCustomerPage />} />
              <Route path="/customers/:customerId" element={<CustomerDetailPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/appointments/new" element={<CreateAppointmentPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/" exact element={<CustomersPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;