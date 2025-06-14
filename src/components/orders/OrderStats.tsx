
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";

interface OrderStatsProps {
  orders: Order[];
  filteredCount: number;
}

const OrderStats: React.FC<OrderStatsProps> = ({ orders, filteredCount }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Order Management</h2>
      <div className="text-sm text-gray-500">
        Total Orders: {filteredCount}
      </div>
    </div>
  );
};

export default OrderStats;
