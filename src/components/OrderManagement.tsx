
import React, { useState } from "react";
import { Order } from "@/types/order";
import { mockOrders } from "@/data/mockOrders";
import OrderFilters from "@/components/orders/OrderFilters";
import OrderTable from "@/components/orders/OrderTable";
import OrderDetailsModal from "@/components/orders/OrderDetailsModal";
import OrderStats from "@/components/orders/OrderStats";

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    // Update selected order if it's the one being modified
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || order.status === statusFilter;
    const matchesLocation = locationFilter === "All Locations" || order.deliveryLocation === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <OrderStats orders={orders} filteredCount={filteredOrders.length} />

      <OrderFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
      />

      <OrderTable
        orders={filteredOrders}
        onViewOrder={handleViewOrder}
        onUpdateOrderStatus={updateOrderStatus}
      />

      <OrderDetailsModal
        selectedOrder={selectedOrder}
        onClose={handleCloseModal}
        onUpdateOrderStatus={updateOrderStatus}
      />
    </div>
  );
};

export default OrderManagement;
