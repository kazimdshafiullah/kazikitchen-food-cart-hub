
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { User, Package, Phone, Mail, Calendar } from 'lucide-react';

const CustomerDashboard: React.FC = () => {
  const { customer, user, signOut, getCustomerOrders } = useCustomerAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const customerOrders = await getCustomerOrders();
      setOrders(customerOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'out-for-delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || !customer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Account</h1>
        <Button variant="outline" onClick={signOut}>
          Sign Out
        </Button>
      </div>

      {/* Customer Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">Name:</span>
              <span>{customer.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="font-medium">Email:</span>
              <span>{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="font-medium">Phone:</span>
                <span>{customer.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="font-medium">Member since:</span>
              <span>{new Date(customer.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order History
          </CardTitle>
          <CardDescription>
            Your recent orders and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
              <p className="text-sm text-gray-400">Your order history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <p className="text-lg font-semibold mt-1">
                        ৳{order.total_amount}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>Delivery:</strong> {order.delivery_address}</p>
                    {order.delivery_location && (
                      <p><strong>Location:</strong> {order.delivery_location}</p>
                    )}
                  </div>

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-medium mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.order_items.map((item: any, index: number) => (
                          <div key={index} className="text-sm flex justify-between">
                            <span>
                              {item.products?.name || 'Unknown Item'} x{item.quantity}
                            </span>
                            <span>৳{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
