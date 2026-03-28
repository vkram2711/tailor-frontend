import React from 'react';
import CustomerCard from './CustomerCard';

const CustomerList = ({ customers }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
            ))}
        </div>
    );
};

export default CustomerList;