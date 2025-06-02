
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ChefHat, CheckCircle, Package } from "lucide-react";

// Mock data for order summary
const mockOrderSummary = {
  pendingOrders: 3,
  cookingOrders: 1,
  readyOrders: 0,
  totalItems: 17
};

// Mock data for items to prepare
const mockItemsToPrepare = [
  {
    id: "1",
    name: "Chicken Biryani",
    quantity: 4,
    orders: ["ORD-1001", "ORD-1002", "ORD-1004"],
    estimatedTime: 25,
    totalEstimatedTime: 100
  },
  {
    id: "2",
    name: "Vegetable Curry",
    quantity: 2,
    orders: ["ORD-1001", "ORD-1003"],
    estimatedTime: 15,
    totalEstimatedTime: 30
  },
  {
    id: "3",
    name: "Naan Bread",
    quantity: 5,
    orders: ["ORD-1001", "ORD-1004"],
    estimatedTime: 8,
    totalEstimatedTime: 40
  }
];

const OrderSummary = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">{mockOrderSummary.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Cooking</CardTitle>
            <ChefHat className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{mockOrderSummary.cookingOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Ready</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{mockOrderSummary.readyOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Total Items</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{mockOrderSummary.totalItems}</div>
          </CardContent>
        </Card>
      </div>

      {/* Items Summary */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <ChefHat className="h-5 w-5 text-orange-600" />
            Items to Prepare - Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockItemsToPrepare.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <ChefHat className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Total quantity needed: <span className="font-medium text-orange-600">{item.quantity}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      From orders: {item.orders.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{item.estimatedTime} min each</span>
                  </div>
                  <p className="text-sm font-medium text-orange-600">
                    Est. {item.totalEstimatedTime} min total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
