
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Send, Bell, User, Clock, Mail } from "lucide-react";

interface ChatMessage {
  id: number;
  chatId: string;
  text: string;
  sender: "customer" | "admin";
  senderName: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatConversation {
  id: string;
  customerName: string;
  customerEmail: string;
  status: "active" | "closed" | "pending";
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  assignedTo?: string;
  messages: ChatMessage[];
}

const ChatManagement = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([
    {
      id: "chat-1",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      status: "active",
      lastMessage: "Hello! I have a question about my order",
      lastMessageTime: new Date(Date.now() - 5 * 60000),
      unreadCount: 2,
      assignedTo: "admin",
      messages: [
        {
          id: 1,
          chatId: "chat-1",
          text: "Hello! I have a question about my order",
          sender: "customer",
          senderName: "John Doe",
          timestamp: new Date(Date.now() - 10 * 60000),
          isRead: true
        },
        {
          id: 2,
          chatId: "chat-1",
          text: "I ordered chicken biryani but received vegetable curry",
          sender: "customer",
          senderName: "John Doe",
          timestamp: new Date(Date.now() - 5 * 60000),
          isRead: false
        }
      ]
    },
    {
      id: "chat-2",
      customerName: "Sarah Smith",
      customerEmail: "sarah@example.com",
      status: "pending",
      lastMessage: "What are your delivery charges?",
      lastMessageTime: new Date(Date.now() - 15 * 60000),
      unreadCount: 1,
      messages: [
        {
          id: 3,
          chatId: "chat-2",
          text: "What are your delivery charges?",
          sender: "customer",
          senderName: "Sarah Smith",
          timestamp: new Date(Date.now() - 15 * 60000),
          isRead: false
        }
      ]
    }
  ]);

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentAdmin] = useState("admin"); // This would come from auth context

  const unreadTotal = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const filteredConversations = conversations.filter(conv => 
    filterStatus === "all" || conv.status === filterStatus
  );

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: ChatMessage = {
      id: Date.now(),
      chatId: selectedChat,
      text: newMessage,
      sender: "admin",
      senderName: currentAdmin,
      timestamp: new Date(),
      isRead: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedChat) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: newMessage,
          lastMessageTime: new Date(),
          status: "active"
        };
      }
      return conv;
    }));

    setNewMessage("");
    
    toast({
      title: "Message sent",
      description: "Your message has been sent to the customer"
    });
  };

  const handleAssignChat = (chatId: string, assignTo: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === chatId ? { ...conv, assignedTo: assignTo } : conv
    ));
    
    toast({
      title: "Chat assigned",
      description: `Chat assigned to ${assignTo}`
    });
  };

  const handleCloseChat = (chatId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === chatId ? { ...conv, status: "closed" } : conv
    ));
    
    toast({
      title: "Chat closed",
      description: "The chat conversation has been closed"
    });
  };

  const markAsRead = (chatId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === chatId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, isRead: true }))
        };
      }
      return conv;
    }));
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    markAsRead(chatId);
  };

  const sendEmailNotification = (chatId: string) => {
    toast({
      title: "Email sent",
      description: "Email notification sent to admin team"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Chat Management</h2>
          <p className="text-muted-foreground">Manage customer chat conversations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            {unreadTotal} Unread
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedChat === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => handleSelectChat(conversation.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium text-sm">{conversation.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={conversation.status === "active" ? "default" : 
                                conversation.status === "pending" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {conversation.status}
                      </Badge>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {conversation.lastMessage}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {conversation.lastMessageTime.toLocaleTimeString()}
                    {conversation.assignedTo && (
                      <span className="ml-2">• Assigned to {conversation.assignedTo}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Details */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {selectedConversation.customerName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedConversation.customerEmail}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={selectedConversation.assignedTo || ""}
                      onValueChange={(value) => handleAssignChat(selectedConversation.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Assign to" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendEmailNotification(selectedConversation.id)}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Notify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCloseChat(selectedConversation.id)}
                      disabled={selectedConversation.status === "closed"}
                    >
                      Close Chat
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-[400px]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-4 border rounded-lg">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.sender === "admin"
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
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your response..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    className="flex-1"
                    rows={2}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a conversation to start chatting</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                const pendingChats = conversations.filter(c => c.status === "pending").length;
                toast({
                  title: "Pending Chats",
                  description: `You have ${pendingChats} pending chat(s)`
                });
              }}
            >
              <Bell className="h-4 w-4 mr-2" />
              Check Pending Chats
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Email sent",
                  description: "Summary email sent to all admins"
                });
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Summary Email
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const activeChats = conversations.filter(c => c.status === "active").length;
                toast({
                  title: "Active Chats",
                  description: `Currently ${activeChats} active chat(s)`
                });
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              View Statistics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatManagement;
