
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Percent, 
  Tag,
  Users,
  Gift,
  Target,
  Clock
} from "lucide-react";

// Mock data for product categories
const productCategories = [
  { id: "1", name: "Frozen Food" },
  { id: "2", name: "Tiffin Services" },
  { id: "3", name: "Office Food" },
  { id: "4", name: "Fresh Vegetables" },
  { id: "5", name: "Beverages" },
  { id: "6", name: "Desserts" },
  { id: "7", name: "Snacks" }
];

// Mock offers data
const mockOffers = [
  {
    id: "1",
    title: "Weekend Special",
    description: "20% off on all tiffin services during weekends",
    discountType: "percentage",
    discountValue: 20,
    category: "Tiffin Services",
    minOrderAmount: 500,
    maxDiscount: 200,
    startDate: "2025-05-18",
    endDate: "2025-05-25",
    usageLimit: 100,
    usedCount: 23,
    status: "active",
    code: "WEEKEND20"
  },
  {
    id: "2",
    title: "New Customer Welcome",
    description: "Get ৳100 off on your first order",
    discountType: "fixed",
    discountValue: 100,
    category: "All Categories",
    minOrderAmount: 300,
    maxDiscount: 100,
    startDate: "2025-05-01",
    endDate: "2025-05-31",
    usageLimit: 500,
    usedCount: 127,
    status: "active",
    code: "WELCOME100"
  },
  {
    id: "3",
    title: "Frozen Food Flash Sale",
    description: "30% off on all frozen food items",
    discountType: "percentage",
    discountValue: 30,
    category: "Frozen Food",
    minOrderAmount: 800,
    maxDiscount: 500,
    startDate: "2025-05-15",
    endDate: "2025-05-20",
    usageLimit: 50,
    usedCount: 45,
    status: "expired",
    code: "FROZEN30"
  }
];

const CreateOfferDialog = ({ open, onClose, onCreateOffer }: {
  open: boolean;
  onClose: () => void;
  onCreateOffer: (offer: any) => void;
}) => {
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    category: "",
    minOrderAmount: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    code: "",
    targetAudience: "all",
    specificProducts: [],
    validDays: [],
    validHours: { start: "", end: "" }
  });

  const handleCreate = () => {
    if (!newOffer.title || !newOffer.discountValue || !newOffer.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const offer = {
      ...newOffer,
      id: Date.now().toString(),
      usedCount: 0,
      status: "active"
    };

    onCreateOffer(offer);
    toast({
      title: "Success",
      description: "Offer created successfully"
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Offer</DialogTitle>
          <DialogDescription>Set up a new promotional offer with advanced targeting options</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Offer Title *</label>
                <Input
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                  placeholder="Enter offer title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Promo Code</label>
                <Input
                  value={newOffer.code}
                  onChange={(e) => setNewOffer({...newOffer, code: e.target.value.toUpperCase()})}
                  placeholder="PROMO20"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newOffer.description}
                onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                placeholder="Describe your offer"
                rows={3}
              />
            </div>
          </div>

          {/* Discount Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Discount Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Type *</label>
                <Select value={newOffer.discountType} onValueChange={(value) => setNewOffer({...newOffer, discountType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                    <SelectItem value="bogo">Buy One Get One</SelectItem>
                    <SelectItem value="free_delivery">Free Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {newOffer.discountType === "percentage" ? "Discount %" : "Discount Amount *"}
                </label>
                <Input
                  type="number"
                  value={newOffer.discountValue}
                  onChange={(e) => setNewOffer({...newOffer, discountValue: e.target.value})}
                  placeholder={newOffer.discountType === "percentage" ? "20" : "100"}
                  disabled={newOffer.discountType === "bogo" || newOffer.discountType === "free_delivery"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Discount (৳)</label>
                <Input
                  type="number"
                  value={newOffer.maxDiscount}
                  onChange={(e) => setNewOffer({...newOffer, maxDiscount: e.target.value})}
                  placeholder="500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Order Amount (৳)</label>
                <Input
                  type="number"
                  value={newOffer.minOrderAmount}
                  onChange={(e) => setNewOffer({...newOffer, minOrderAmount: e.target.value})}
                  placeholder="300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Usage Limit</label>
                <Input
                  type="number"
                  value={newOffer.usageLimit}
                  onChange={(e) => setNewOffer({...newOffer, usageLimit: e.target.value})}
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Category & Product Targeting */}
          <div className="space-y-4">
            <h4 className="font-medium">Product Targeting</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Category *</label>
              <Select value={newOffer.category} onValueChange={(value) => setNewOffer({...newOffer, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  {productCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Customer Targeting */}
          <div className="space-y-4">
            <h4 className="font-medium">Customer Targeting</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Select value={newOffer.targetAudience} onValueChange={(value) => setNewOffer({...newOffer, targetAudience: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="new">New Customers Only</SelectItem>
                  <SelectItem value="returning">Returning Customers</SelectItem>
                  <SelectItem value="vip">VIP Customers</SelectItem>
                  <SelectItem value="inactive">Inactive Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Time Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={newOffer.startDate}
                  onChange={(e) => setNewOffer({...newOffer, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={newOffer.endDate}
                  onChange={(e) => setNewOffer({...newOffer, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Valid From (Time)</label>
                <Input
                  type="time"
                  value={newOffer.validHours.start}
                  onChange={(e) => setNewOffer({
                    ...newOffer, 
                    validHours: {...newOffer.validHours, start: e.target.value}
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Valid Until (Time)</label>
                <Input
                  type="time"
                  value={newOffer.validHours.end}
                  onChange={(e) => setNewOffer({
                    ...newOffer, 
                    validHours: {...newOffer.validHours, end: e.target.value}
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create Offer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Offers = () => {
  const [offers, setOffers] = useState(mockOffers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);

  const handleCreateOffer = (newOffer: any) => {
    setOffers([...offers, newOffer]);
    setIsCreateDialogOpen(false);
  };

  const handleToggleStatus = (offerId: string) => {
    setOffers(offers.map(offer => 
      offer.id === offerId 
        ? { ...offer, status: offer.status === "active" ? "inactive" : "active" }
        : offer
    ));
    
    const offer = offers.find(o => o.id === offerId);
    toast({
      title: "Offer Updated",
      description: `Offer "${offer?.title}" has been ${offer?.status === "active" ? "deactivated" : "activated"}.`
    });
  };

  const handleDeleteOffer = (offerId: string) => {
    setOffers(offers.filter(offer => offer.id !== offerId));
    toast({
      title: "Offer Deleted",
      description: "Offer has been deleted successfully."
    });
  };

  const activeOffers = offers.filter(offer => offer.status === "active").length;
  const totalUsage = offers.reduce((acc, offer) => acc + offer.usedCount, 0);
  const totalSavings = offers.reduce((acc, offer) => {
    if (offer.discountType === "percentage") {
      return acc + (offer.usedCount * offer.maxDiscount);
    } else {
      return acc + (offer.usedCount * offer.discountValue);
    }
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Offers & Promotions</h2>
          <p className="text-muted-foreground">Create and manage promotional offers with advanced targeting</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Offer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeOffers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Savings</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalSavings.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Offers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Offers</CardTitle>
          <CardDescription>Manage your promotional offers and track their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{offer.title}</p>
                      <p className="text-sm text-muted-foreground">{offer.description}</p>
                      {offer.code && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {offer.code}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{offer.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {offer.discountType === "percentage" ? (
                      <span>{offer.discountValue}% off</span>
                    ) : offer.discountType === "fixed" ? (
                      <span>৳{offer.discountValue} off</span>
                    ) : offer.discountType === "bogo" ? (
                      <span>Buy 1 Get 1</span>
                    ) : (
                      <span>Free Delivery</span>
                    )}
                    {offer.minOrderAmount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Min: ৳{offer.minOrderAmount}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{offer.usedCount} / {offer.usageLimit}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${(offer.usedCount / offer.usageLimit) * 100}%`}}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{offer.startDate}</p>
                      <p className="text-muted-foreground">to {offer.endDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      offer.status === "active" ? "default" :
                      offer.status === "expired" ? "destructive" : "secondary"
                    }>
                      {offer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={offer.status === "active" ? "secondary" : "default"}
                        onClick={() => handleToggleStatus(offer.id)}
                      >
                        {offer.status === "active" ? "Deactivate" : "Activate"}
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
        </CardContent>
      </Card>

      <CreateOfferDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateOffer={handleCreateOffer}
      />
    </div>
  );
};

export default Offers;
