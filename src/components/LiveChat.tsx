
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "admin";
  timestamp: Date;
}

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "admin",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate admin response
    setTimeout(() => {
      const adminResponse: Message = {
        id: messages.length + 2,
        text: "Thank you for your message! Our team will get back to you shortly.",
        sender: "admin",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, adminResponse]);
    }, 1000);
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
                <CardTitle className="text-lg">Live Chat</CardTitle>
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
                      {message.text}
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
                  <Button onClick={sendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default LiveChat;
