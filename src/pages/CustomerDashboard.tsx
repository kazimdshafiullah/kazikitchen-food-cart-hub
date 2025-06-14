
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerDashboard from '@/components/customer/CustomerDashboard';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { customer, loading } = useCustomerAuth();

  useEffect(() => {
    if (!loading && !customer) {
      navigate('/customer-login');
    }
  }, [customer, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return <CustomerDashboard />;
};

export default CustomerDashboardPage;
