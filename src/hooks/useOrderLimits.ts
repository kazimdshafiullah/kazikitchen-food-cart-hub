
import { useState, useEffect } from 'react';

interface OrderLimits {
  schoolTiffinLimit: number;
  officeFoodLimit: number;
  enableLimits: boolean;
}

interface DailyOrderCounts {
  schoolTiffin: number;
  officeFood: number;
  lastUpdated: string;
}

export const useOrderLimits = () => {
  const [orderLimits, setOrderLimits] = useState<OrderLimits>({
    schoolTiffinLimit: 50,
    officeFoodLimit: 30,
    enableLimits: true
  });

  const [dailyCounts, setDailyCounts] = useState<DailyOrderCounts>({
    schoolTiffin: 0,
    officeFood: 0,
    lastUpdated: new Date().toDateString()
  });

  // Reset counts at midnight or if it's a new day
  useEffect(() => {
    const today = new Date().toDateString();
    if (dailyCounts.lastUpdated !== today) {
      setDailyCounts({
        schoolTiffin: 0,
        officeFood: 0,
        lastUpdated: today
      });
    }
  }, [dailyCounts.lastUpdated]);

  const checkOrderAvailability = (category: 'schoolTiffin' | 'officeFood'): boolean => {
    if (!orderLimits.enableLimits) return true;

    const currentCount = dailyCounts[category];
    const limit = category === 'schoolTiffin' ? orderLimits.schoolTiffinLimit : orderLimits.officeFoodLimit;
    
    return currentCount < limit;
  };

  const incrementOrderCount = (category: 'schoolTiffin' | 'officeFood') => {
    setDailyCounts(prev => ({
      ...prev,
      [category]: prev[category] + 1
    }));
  };

  const getRemainingOrders = (category: 'schoolTiffin' | 'officeFood'): number => {
    if (!orderLimits.enableLimits) return 999;

    const currentCount = dailyCounts[category];
    const limit = category === 'schoolTiffin' ? orderLimits.schoolTiffinLimit : orderLimits.officeFoodLimit;
    
    return Math.max(0, limit - currentCount);
  };

  const updateOrderLimits = (newLimits: OrderLimits) => {
    setOrderLimits(newLimits);
    // In a real app, this would save to backend/localStorage
    localStorage.setItem('orderLimits', JSON.stringify(newLimits));
  };

  // Load limits from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('orderLimits');
    if (saved) {
      setOrderLimits(JSON.parse(saved));
    }
  }, []);

  return {
    orderLimits,
    dailyCounts,
    checkOrderAvailability,
    incrementOrderCount,
    getRemainingOrders,
    updateOrderLimits
  };
};
