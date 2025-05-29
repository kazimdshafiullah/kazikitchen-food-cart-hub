
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Phone, Clock, Package } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Mock delivery data - replace with real data from your database
const mockDeliveries = [
  {
    id: "1",
    customerName: "John Doe",
    customerPhone: "+880123456789",
    address: "123 Main Street, Dhaka 1000",
    coordinates: { lat: 23.8103, lng: 90.4125 },
    orderItems: ["Chicken Biriyani", "Beef Curry"],
    status: "assigned",
    estimatedTime: "30 mins",
    orderValue: "৳450"
  },
  {
    id: "2",
    customerName: "Jane Smith",
    customerPhone: "+880987654321",
    address: "456 Park Avenue, Dhaka 1215",
    coordinates: { lat: 23.7947, lng: 90.4035 },
    orderItems: ["Fish Curry", "Rice", "Salad"],
    status: "picked_up",
    estimatedTime: "15 mins",
    orderValue: "৳320"
  }
];

const RiderMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchAddress, setSearchAddress] = useState("");

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location. Using default location.");
          // Default to Dhaka center
          setUserLocation({ lat: 23.8103, lng: 90.4125 });
        }
      );
    } else {
      toast.error("Geolocation not supported. Using default location.");
      setUserLocation({ lat: 23.8103, lng: 90.4125 });
    }
  }, []);

  const handleStartNavigation = (delivery: any) => {
    const { coordinates } = delivery;
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleCallCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const updateDeliveryStatus = (deliveryId: string, newStatus: string) => {
    // This would update the delivery status in your database
    toast.success(`Delivery status updated to ${newStatus}`);
  };

  const searchLocation = () => {
    if (!searchAddress.trim()) {
      toast.error("Please enter an address to search");
      return;
    }
    
    // This would integrate with a geocoding service to find the location
    toast.info("Search functionality would integrate with Google Maps Geocoding API");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Delivery Map</h2>
        <p className="text-muted-foreground">Track and navigate to your assigned deliveries</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search for an address..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1"
            />
            <Button onClick={searchLocation}>
              <MapPin className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Map Placeholder */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Delivery Map</CardTitle>
            <CardDescription>Interactive map showing delivery locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              ref={mapRef}
              className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
            >
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Interactive Map Integration</p>
                <p className="text-sm text-gray-400">
                  This would display a real map with delivery locations
                </p>
                {userLocation && (
                  <p className="text-xs text-green-600 mt-2">
                    Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Today's Deliveries</CardTitle>
            <CardDescription>Your assigned delivery orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {mockDeliveries.map((delivery) => (
              <div 
                key={delivery.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedDelivery?.id === delivery.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDelivery(delivery)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{delivery.customerName}</h4>
                    <p className="text-sm text-gray-600">{delivery.address}</p>
                  </div>
                  <Badge 
                    variant={delivery.status === 'picked_up' ? 'default' : 'secondary'}
                  >
                    {delivery.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {delivery.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    {delivery.orderValue}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartNavigation(delivery);
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Navigate
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCallCustomer(delivery.customerPhone);
                    }}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  {delivery.status === 'assigned' && (
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateDeliveryStatus(delivery.id, 'picked_up');
                      }}
                    >
                      Pick Up
                    </Button>
                  )}
                  {delivery.status === 'picked_up' && (
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateDeliveryStatus(delivery.id, 'delivered');
                      }}
                    >
                      Delivered
                    </Button>
                  )}
                </div>

                {delivery.orderItems.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-gray-500">Items:</p>
                    <p className="text-sm">{delivery.orderItems.join(", ")}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Selected Delivery Details */}
      {selectedDelivery && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Details - {selectedDelivery.customerName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <p><strong>Name:</strong> {selectedDelivery.customerName}</p>
                <p><strong>Phone:</strong> {selectedDelivery.customerPhone}</p>
                <p><strong>Address:</strong> {selectedDelivery.address}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Order Information</h4>
                <p><strong>Items:</strong> {selectedDelivery.orderItems.join(", ")}</p>
                <p><strong>Value:</strong> {selectedDelivery.orderValue}</p>
                <p><strong>Estimated Time:</strong> {selectedDelivery.estimatedTime}</p>
                <p><strong>Status:</strong> 
                  <Badge className="ml-2" variant={selectedDelivery.status === 'picked_up' ? 'default' : 'secondary'}>
                    {selectedDelivery.status.replace('_', ' ')}
                  </Badge>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RiderMap;
