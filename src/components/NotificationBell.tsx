
import { useState } from "react";
import { Bell, X, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-1006 has been placed by Jane Smith",
    timestamp: "2 minutes ago",
    read: false,
    icon: Clock,
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: "2",
    type: "kitchen",
    title: "Kitchen Status Update",
    message: "Order #ORD-1002 is ready for delivery",
    timestamp: "5 minutes ago",
    read: false,
    icon: CheckCircle,
    color: "bg-green-100 text-green-800"
  },
  {
    id: "3",
    type: "rider",
    title: "Rider Assignment Needed",
    message: "Order #ORD-1003 needs a delivery rider",
    timestamp: "10 minutes ago",
    read: true,
    icon: AlertTriangle,
    color: "bg-yellow-100 text-yellow-800"
  },
  {
    id: "4",
    type: "order",
    title: "Order Cancelled",
    message: "Order #ORD-1001 was cancelled by customer",
    timestamp: "15 minutes ago",
    read: true,
    icon: X,
    color: "bg-red-100 text-red-800"
  },
  {
    id: "5",
    type: "kitchen",
    title: "Kitchen Status Update",
    message: "Order #ORD-1004 cooking started",
    timestamp: "20 minutes ago",
    read: true,
    icon: Clock,
    color: "bg-blue-100 text-blue-800"
  }
];

const NotificationBell = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${notification.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            !notification.read ? "text-gray-900" : "text-gray-600"
                          }`}>
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 hover:bg-red-100"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
