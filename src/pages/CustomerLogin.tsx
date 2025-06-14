
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerAuth from '@/components/customer/CustomerAuth';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

const CustomerLogin: React.FC = () => {
  const navigate = useNavigate();
  const { customer } = useCustomerAuth();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (customer) {
      navigate('/customer-dashboard');
    }
  }, [customer, navigate]);

  const handleAuthSuccess = () => {
    navigate('/customer-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to Kazi Kitchen
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your account to track orders and manage your profile
          </p>
        </div>
        <CustomerAuth onAuthSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
};

export default CustomerLogin;
