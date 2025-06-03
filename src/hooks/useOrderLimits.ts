
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
  officeFoodDate: string; // Track which day the office food orders are counting for
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
    lastUpdated: new Date().toDateString(),
    officeFoodDate: getOfficeFoodTargetDate()
  });

  // Helper function to get the target date for office food orders
  function getOfficeFoodTargetDate(): string {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
    const cutoffTime = 9 * 60 + 30; // 9:30 AM in minutes
    
    if (currentTime >= cutoffTime) {
      // After 9:30 AM, orders are for next day
      const nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toDateString();
    } else {
      // Before 9:30 AM, orders are for today
      return now.toDateString();
    }
  }

  // Reset counts when needed
  useEffect(() => {
    const today = new Date().toDateString();
    const currentOfficeFoodTarget = getOfficeFoodTargetDate();
    
    // Reset school tiffin if it's a new day
    if (dailyCounts.lastUpdated !== today) {
      setDailyCounts(prev => ({
        ...prev,
        schoolTiffin: 0,
        lastUpdated: today
      }));
    }
    
    // Reset office food if the target date has changed
    if (dailyCounts.officeFoodDate !== currentOfficeFoodTarget) {
      setDailyCounts(prev => ({
        ...prev,
        officeFood: 0,
        officeFoodDate: currentOfficeFoodTarget
      }));
    }
  }, [dailyCounts.lastUpdated, dailyCounts.officeFoodDate]);

  const checkOrderAvailability = (category: 'schoolTiffin' | 'officeFood'): boolean => {
    if (!orderLimits.enableLimits) return true;

    const currentCount = dailyCounts[category];
    const limit = category === 'schoolTiffin' ? orderLimits.schoolTiffinLimit : orderLimits.officeFoodLimit;
    
    return currentCount < limit;
  };

  const incrementOrderCount = (category: 'schoolTiffin' | 'officeFood') => {
    if (category === 'officeFood') {
      // Check if we need to update the office food target date
      const currentTarget = getOfficeFoodTargetDate();
      if (dailyCounts.officeFoodDate !== currentTarget) {
        setDailyCounts(prev => ({
          ...prev,
          officeFood: 1, // Reset to 1 since this is the first order for the new target date
          officeFoodDate: currentTarget
        }));
      } else {
        setDailyCounts(prev => ({
          ...prev,
          officeFood: prev.officeFood + 1
        }));
      }
    } else {
      // School tiffin works normally (daily reset)
      setDailyCounts(prev => ({
        ...prev,
        [category]: prev[category] + 1
      }));
    }
  };

  const getRemainingOrders = (category: 'schoolTiffin' | 'officeFood'): number => {
    if (!orderLimits.enableLimits) return 999;

    const currentCount = dailyCounts[category];
    const limit = category === 'schoolTiffin' ? orderLimits.schoolTiffinLimit : orderLimits.officeFoodLimit;
    
    return Math.max(0, limit - currentCount);
  };

  const getOfficeFoodTargetDateDisplay = (): string => {
    const targetDate = new Date(dailyCounts.officeFoodDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (targetDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (targetDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return targetDate.toLocaleDateString();
    }
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
    updateOrderLimits,
    getOfficeFoodTargetDateDisplay
  };
};
