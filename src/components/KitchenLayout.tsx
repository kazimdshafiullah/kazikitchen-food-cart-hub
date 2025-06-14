
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, Package, Clock, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const KitchenLayout = () => {
  const { profile, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!profile || profile.role !== 'kitchen') {
    return <Navigate to="/kitchen/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Kitchen Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-4">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">Kitchen Portal</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{profile.username}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Kitchen Navigation */}
      <nav className="bg-orange-600 text-white">
        <div className="px-6 py-3">
          <div className="flex space-x-6">
            <Link 
              to="/kitchen/dashboard" 
              className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-orange-700 transition-colors"
            >
              <Package className="h-4 w-4" />
              <span>Active Orders</span>
            </Link>
            <Link 
              to="/kitchen/preparation" 
              className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-orange-700 transition-colors"
            >
              <Clock className="h-4 w-4" />
              <span>Preparation Queue</span>
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

export default KitchenLayout;
