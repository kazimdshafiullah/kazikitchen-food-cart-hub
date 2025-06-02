
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Users, PercentIcon, Clock, Target, Gift } from "lucide-react";

// Mock data for offers
const mockOffers = [
  {
    id: "1",
    name: "Weekend Special",
    description: "50% off on all weekend orders",
    type: "percentage",
    value: 50,
    minOrderAmount: 500,
    maxDiscount: 200,
    validFrom: "2025-05-18",
    validTo: "2025-05-25",
    usageLimit: 100,
    usedCount: 25,
    isActive: true,
    code: "WEEKEND50",
    targetCategory: "all",
    targetCustomer: "all"
  },
  {
    id: "2",
    name: "First Order Discount",
    description: "₹100 off on first order",
    type: "fixed",
    value: 100,
    minOrderAmount: 300,
    maxDiscount: 100,
    validFrom: "2025-05-01",
    validTo: "2025-06-30",
    usageLimit: 500,
    usedCount: 89,
    isActive: true,
    code: "FIRST100",
    targetCategory: "all",
    targetCustomer: "new"
  }
];

const OfferManagement = () => {
  const [offers, setOffers] = useState(mockOffers);
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [newOffer, setNewOffer] = useState({
    name: "",
    description: "",
    type: "percentage",
    value: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    validFrom: "",
    validTo: "",
    usageLimit: 0,
    code: "",
    targetCategory: "all",
    targetCustomer: "all"
  });

  const handleCreateOffer = () => {
    if (!newOffer.name.trim() || !newOffer.code.trim()) {
      toast({
        title: "Error",
        description: "Offer name and code are required",
        variant: "destructive"
      });
      return;
    }

    const offer = {
      id: Date.now().toString(),
      ...newOffer,
      usedCount: 0,
      isActive: true
    };

    setOffers([...offers, offer]);
    setNewOffer({
      name: "",
      description: "",
      type: "percentage",
      value: 0,
      minOrderAmount: 0,
      maxDiscount: 0,
      validFrom: "",
      validTo: "",
      usageLimit: 0,
      code: "",
      targetCategory: "all",
      targetCustomer: "all"
    });
    setIsCreateOfferOpen(false);
    
    toast({
      title: "Success",
      description: "Offer created successfully"
    });
  };

  const handleUpdateOffer = () => {
    if (!editingOffer?.name.trim() || !editingOffer?.code.trim()) {
      toast({
        title: "Error",
        description: "Offer name and code are required",
        variant: "destructive"
      });
      return;
    }

    setOffers(offers.map(offer => 
      offer.id === editingOffer.id ? editingOffer : offer
    ));
    setEditingOffer(null);
    
    toast({
      title: "Success",
      description: "Offer updated successfully"
    });
  };

  const handleDeleteOffer = (offerId: string) => {
    setOffers(offers.filter(offer => offer.id !== offerId));
    toast({
      title: "Success",
      description: "Offer deleted successfully"
    });
  };

  const handleToggleOffer = (offerId: string) => {
    setOffers(offers.map(offer => 
      offer.id === offerId ? { ...offer, isActive: !offer.isActive } : offer
    ));
    
    const offer = offers.find(o => o.id === offerId);
    toast({
      title: "Success",
      description: `Offer ${offer?.isActive ? 'deactivated' : 'activated'} successfully`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Offer Management</h3>
          <p className="text-sm text-muted-foreground">Create and manage promotional offers</p>
        </div>
        <Dialog open={isCreateOfferOpen} onOpenChange={setIsCreateOfferOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Offer</DialogTitle>
              <DialogDescription>Set up a new promotional offer for your customers</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Offer Name</label>
                  <Input
                    value={newOffer.name}
                    onChange={(e) => setNewOffer({...newOffer, name: e.target.value})}
                    placeholder="Enter offer name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Offer Code</label>
                  <Input
                    value={newOffer.code}
                    onChange={(e) => setNewOffer({...newOffer, code: e.target.value.toUpperCase()})}
                    placeholder="Enter offer code"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                  placeholder="Enter offer description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Discount Type</label>
                  <Select value={newOffer.type} onValueChange={(value) => setNewOffer({...newOffer, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Discount Value</label>
                  <Input
                    type="number"
                    value={newOffer.value}
                    onChange={(e) => setNewOffer({...newOffer, value: Number(e.target.value)})}
                    placeholder={newOffer.type === "percentage" ? "Enter percentage" : "Enter amount"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Min Order Amount</label>
                  <Input
                    type="number"
                    value={newOffer.minOrderAmount}
                    onChange={(e) => setNewOffer({...newOffer, minOrderAmount: Number(e.target.value)})}
                    placeholder="Minimum order amount"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Discount (₹)</label>
                  <Input
                    type="number"
                    value={newOffer.maxDiscount}
                    onChange={(e) => setNewOffer({...newOffer, maxDiscount: Number(e.target.value)})}
                    placeholder="Maximum discount amount"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Valid From</label>
                  <Input
                    type="date"
                    value={newOffer.validFrom}
                    onChange={(e) => setNewOffer({...newOffer, validFrom: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Valid To</label>
                  <Input
                    type="date"
                    value={newOffer.validTo}
                    onChange={(e) => setNewOffer({...newOffer, validTo: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Target Category</label>
                  <Select value={newOffer.targetCategory} onValueChange={(value) => setNewOffer({...newOffer, targetCategory: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="frozen">Frozen Food</SelectItem>
                      <SelectItem value="tiffin">Tiffin Services</SelectItem>
                      <SelectItem value="office">Office Food</SelectItem>
                      <SelectItem value="vegetables">Fresh Vegetables</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Target Customer</label>
                  <Select value={newOffer.targetCustomer} onValueChange={(value) => setNewOffer({...newOffer, targetCustomer: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="new">New Customers</SelectItem>
                      <SelectItem value="existing">Existing Customers</SelectItem>
                      <SelectItem value="premium">Premium Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Usage Limit</label>
                <Input
                  type="number"
                  value={newOffer.usageLimit}
                  onChange={(e) => setNewOffer({...newOffer, usageLimit: Number(e.target.value)})}
                  placeholder="Maximum number of uses"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOfferOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOffer}>Create Offer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Offer Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell className="font-medium">{offer.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{offer.code}</Badge>
                </TableCell>
                <TableCell className="capitalize">{offer.type}</TableCell>
                <TableCell>
                  {offer.type === "percentage" ? `${offer.value}%` : `₹${offer.value}`}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{offer.usedCount}/{offer.usageLimit}</span>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(offer.usedCount / offer.usageLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{offer.validTo}</TableCell>
                <TableCell>
                  <Badge variant={offer.isActive ? "default" : "secondary"}>
                    {offer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingOffer(offer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={offer.isActive ? "secondary" : "default"}
                      onClick={() => handleToggleOffer(offer.id)}
                    >
                      {offer.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteOffer(offer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Offer Dialog */}
      <Dialog open={!!editingOffer} onOpenChange={() => setEditingOffer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
            <DialogDescription>Update offer information</DialogDescription>
          </DialogHeader>
          {editingOffer && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Offer Name</label>
                  <Input
                    value={editingOffer.name}
                    onChange={(e) => setEditingOffer({...editingOffer, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Offer Code</label>
                  <Input
                    value={editingOffer.code}
                    onChange={(e) => setEditingOffer({...editingOffer, code: e.target.value.toUpperCase()})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingOffer.description}
                  onChange={(e) => setEditingOffer({...editingOffer, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Discount Type</label>
                  <Select value={editingOffer.type} onValueChange={(value) => setEditingOffer({...editingOffer, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Discount Value</label>
                  <Input
                    type="number"
                    value={editingOffer.value}
                    onChange={(e) => setEditingOffer({...editingOffer, value: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Min Order Amount</label>
                  <Input
                    type="number"
                    value={editingOffer.minOrderAmount}
                    onChange={(e) => setEditingOffer({...editingOffer, minOrderAmount: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Discount (₹)</label>
                  <Input
                    type="number"
                    value={editingOffer.maxDiscount}
                    onChange={(e) => setEditingOffer({...editingOffer, maxDiscount: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Valid From</label>
                  <Input
                    type="date"
                    value={editingOffer.validFrom}
                    onChange={(e) => setEditingOffer({...editingOffer, validFrom: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Valid To</label>
                  <Input
                    type="date"
                    value={editingOffer.validTo}
                    onChange={(e) => setEditingOffer({...editingOffer, validTo: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Target Category</label>
                  <Select value={editingOffer.targetCategory} onValueChange={(value) => setEditingOffer({...editingOffer, targetCategory: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="frozen">Frozen Food</SelectItem>
                      <SelectItem value="tiffin">Tiffin Services</SelectItem>
                      <SelectItem value="office">Office Food</SelectItem>
                      <SelectItem value="vegetables">Fresh Vegetables</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Target Customer</label>
                  <Select value={editingOffer.targetCustomer} onValueChange={(value) => setEditingOffer({...editingOffer, targetCustomer: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="new">New Customers</SelectItem>
                      <SelectItem value="existing">Existing Customers</SelectItem>
                      <SelectItem value="premium">Premium Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Usage Limit</label>
                <Input
                  type="number"
                  value={editingOffer.usageLimit}
                  onChange={(e) => setEditingOffer({...editingOffer, usageLimit: Number(e.target.value)})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingOffer(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOffer}>Update Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const OfferAnalytics = () => {
  const activeOffers = mockOffers.filter(offer => offer.isActive).length;
  const totalRedemptions = mockOffers.reduce((acc, offer) => acc + offer.usedCount, 0);
  const totalSavings = mockOffers.reduce((acc, offer) => {
    if (offer.type === "percentage") {
      return acc + (offer.usedCount * offer.maxDiscount);
    }
    return acc + (offer.usedCount * offer.value);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOffers}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRedemptions}</div>
            <p className="text-xs text-muted-foreground">Times offers used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Savings</CardTitle>
            <PercentIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSavings}</div>
            <p className="text-xs text-muted-foreground">Total discounts given</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Usage Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockOffers.length > 0 ? Math.round((totalRedemptions / mockOffers.reduce((acc, offer) => acc + offer.usageLimit, 0)) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Of total capacity</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offer Performance</CardTitle>
          <CardDescription>Detailed breakdown of offer usage and effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOffers.map((offer) => (
              <div key={offer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{offer.name}</h4>
                  <p className="text-sm text-muted-foreground">{offer.code}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">{offer.usedCount}/{offer.usageLimit}</p>
                    <p className="text-xs text-muted-foreground">Uses</p>
                  </div>
                  <div className="w-32">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(offer.usedCount / offer.usageLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <Badge variant={offer.isActive ? "default" : "secondary"}>
                    {offer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Offers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Offers & Promotions</h2>
        <p className="text-muted-foreground">Create and manage promotional offers to boost sales</p>
      </div>

      <Tabs defaultValue="offers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="offers">Manage Offers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="offers">
          <OfferManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <OfferAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Offers;
