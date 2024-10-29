import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Callback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // Store the token securely, e.g., in memory or in state management
            sessionStorage.setItem("authToken", token);

            // Remove the token from the URL for cleaner navigation
            navigate("/", { replace: true });
        }
    }, [location, navigate]);

    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            {/* Rest of your dashboard component */}
        </div>
    );
}

export default Callback;