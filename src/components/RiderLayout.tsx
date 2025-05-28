
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, Package, MapPin, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";

const RiderLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if rider is logged in
    const riderUser = localStorage.getItem('rider_user');
    if (!riderUser) {
      navigate('/rider/login');
    } else {
      setUser(JSON.parse(riderUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('rider_user');
    navigate('/rider/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Rider Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-4">
            <Truck className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Rider Portal</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Rider Navigation */}
      <nav className="bg-blue-600 text-white">
        <div className="px-6 py-3">
          <div className="flex space-x-6">
            <Link 
              to="/rider/dashboard" 
              className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              <Package className="h-4 w-4" />
              <span>My Deliveries</span>
            </Link>
            <Link 
              to="/rider/map" 
              className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span>Delivery Map</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default RiderLayout;
