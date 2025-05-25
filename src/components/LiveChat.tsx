
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: number;
  text: string;
  sender: "user" | "admin";
  senderName: string;
  timestamp: Date;
}

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "admin",
      senderName: "Kazi Kitchen Support",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    isRegistered: false
  });
  const [chatId] = useState(`chat-${Date.now()}`);

  // Auto-response for outside business hours
  const isBusinessHours = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 9 && hour <= 21; // 9 AM to 9 PM
  };

  const sendToAdminNotification = (message: string) => {
    // This would integrate with your backend to notify admins
    console.log("Sending admin notification:", {
      chatId,
      customerInfo,
      message,
      timestamp: new Date()
    });
    
    // Simulate email notification to admins
    toast({
      title: "Admin Notified",
      description: "Your message has been sent to our support team"
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      senderName: customerInfo.name || "Customer",
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    
    // Send notification to admin
    sendToAdminNotification(newMessage);
    
    setNewMessage("");

    // Auto-response logic
    setTimeout(() => {
      let responseText = "";
      
      if (!isBusinessHours()) {
        responseText = "Thank you for contacting us! We're currently outside business hours (9 AM - 9 PM). Our team will get back to you shortly.";
      } else {
        responseText = "Thank you for your message! Our support team has been notified and will respond shortly.";
      }

      const adminResponse: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: "admin",
        senderName: "Kazi Kitchen Support",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, adminResponse]);
    }, 1000);
  };

  const handleStartChat = () => {
    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: "Information Required",
        description: "Please provide your name and email to start chatting",
        variant: "destructive"
      });
      return;
    }
    
    setCustomerInfo({ ...customerInfo, isRegistered: true });
    
    toast({
      title: "Chat Started",
      description: "You can now start chatting with our support team"
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-14 h-14 bg-kazi-orange hover:bg-opacity-90 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <Card className="w-80 h-96 shadow-xl">
            <CardHeader className="bg-kazi-orange text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Live Chat Support</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-80">
              {!customerInfo.isRegistered ? (
                // Customer Information Form
                <div className="flex-1 p-4 space-y-4">
                  <div className="text-center mb-4">
                    <User className="h-8 w-8 mx-auto text-kazi-orange mb-2" />
                    <h3 className="font-medium">Start a conversation</h3>
                    <p className="text-sm text-muted-foreground">Please provide your details</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Input
                      placeholder="Your name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    />
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    />
                    <Button 
                      onClick={handleStartChat} 
                      className="w-full bg-kazi-orange hover:bg-kazi-orange/90"
                      disabled={!customerInfo.name || !customerInfo.email}
                    >
                      Start Chat
                    </Button>
                  </div>
                  
                  <div className="text-xs text-center text-muted-foreground">
                    <p>Business Hours: 9 AM - 9 PM</p>
                    <p>We'll respond within 15 minutes during business hours</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.sender === "user"
                              ? "bg-kazi-orange text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">{message.senderName}</span>
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p>{message.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default LiveChat;
