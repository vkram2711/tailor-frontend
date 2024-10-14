import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginButton from './LoginButton';
import SignupButton from './SignUpButton';
import CustomersPage from './CustomersPage';
import CustomerDetailPage from './CustomerDetailPage';
import CreateCustomerPage from './CreateCustomerPage';
import LogoutButton from './LogoutButton';

const App = () => {
  return (
      <Router>
          <div>
              <h1>Auth0 Authentication</h1>
              <LoginButton />
              <SignupButton />
              <LogoutButton />
              <Routes>
                  <Route path="/customers/new" element={<CreateCustomerPage />} />
                  <Route path="/customers/:customerId" element={<CustomerDetailPage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/" exact element={<CustomersPage />} />
              </Routes>
          </div>
      </Router>
  );
};

export default App;