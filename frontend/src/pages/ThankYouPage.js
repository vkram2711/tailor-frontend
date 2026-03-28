import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ThankYouPage = () => {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto p-6 text-gray-800">
            <div className="rounded-lg p-6 text-center">
                <FaCheckCircle className="text-green-500 text-6xl mb-4 mx-auto" />
                <h1 className="text-3xl font-bold mb-4">{t('Thank You!')}</h1>
                <p className="text-lg mb-4">{t('Your appointment has been successfully booked.')}</p>
                <p className="text-md text-gray-600">{t('Please note that this is not the final booking. You will receive a confirmation email once the tailor confirms your appointment.')}</p>
            </div>
        </div>
    );
};

export default ThankYouPage;