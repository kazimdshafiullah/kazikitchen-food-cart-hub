
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

// Mock offers data
const mockOffers = [
  { id: "OFF-2001", name: "Summer Special", type: "percentage", value: 15, code: "SUMMER15", active: true, expires: "2025-07-31" },
  { id: "OFF-2002", name: "First Order", type: "fixed", value: 10, code: "WELCOME10", active: true, expires: "2025-12-31" },
  { id: "OFF-2003", name: "Family Bundle", type: "percentage", value: 20, code: "FAMILY20", active: true, expires: "2025-06-15" },
  { id: "OFF-2004", name: "Weekend Special", type: "percentage", value: 10, code: "WEEKEND10", active: false, expires: "2025-06-01" },
  { id: "OFF-2005", name: "Loyalty Discount", type: "fixed", value: 5, code: "LOYAL5", active: true, expires: "2025-09-30" },
];

const Offers = () => {
  const [offers, setOffers] = useState(mockOffers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<any>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("");
  const [code, setCode] = useState("");
  const [expires, setExpires] = useState("");
  
  const resetForm = () => {
    setName("");
    setType("percentage");
    setValue("");
    setCode("");
    setExpires("");
  };
  
  const handleAddOffer = () => {
    if (!name || !value || !code || !expires) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const newOffer = {
      id: `OFF-${2000 + offers.length + 1}`,
      name,
      type,
      value: Number(value),
      code,
      active: true,
      expires
    };
    
    setOffers([...offers, newOffer]);
    toast.success("Offer added successfully");
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  const handleEditOffer = () => {
    if (!name || !value || !code || !expires) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const updatedOffers = offers.map(offer => 
      offer.id === currentOffer.id ? 
      { 
        ...offer, 
        name, 
        type, 
        value: Number(value), 
        code, 
        expires 
      } : offer
    );
    
    setOffers(updatedOffers);
    toast.success("Offer updated successfully");
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteOffer = () => {
    const updatedOffers = offers.filter(offer => offer.id !== currentOffer.id);
    setOffers(updatedOffers);
    toast.success("Offer deleted successfully");
    setIsDeleteDialogOpen(false);
  };
  
  const handleToggleActive = (id: string) => {
    const updatedOffers = offers.map(offer => 
      offer.id === id ? { ...offer, active: !offer.active } : offer
    );
    setOffers(updatedOffers);
    
    const targetOffer = updatedOffers.find(o => o.id === id);
    toast.success(`Offer ${targetOffer?.active ? 'activated' : 'deactivated'} successfully`);
  };
  
  const openEditDialog = (offer: any) => {
    setCurrentOffer(offer);
    setName(offer.name);
    setType(offer.type);
    setValue(String(offer.value));
    setCode(offer.code);
    setExpires(offer.expires);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (offer: any) => {
    setCurrentOffer(offer);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Offers</h2>
          <p className="text-muted-foreground">Create and manage special offers and discounts</p>
        </div>
        <Button className="flex items-center" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Offer
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map(offer => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium">{offer.name}</TableCell>
                  <TableCell>
                    <code className="bg-muted px-1 py-0.5 rounded">{offer.code}</code>
                  </TableCell>
                  <TableCell className="capitalize">{offer.type}</TableCell>
                  <TableCell>
                    {offer.type === "percentage" ? `${offer.value}%` : `$${offer.value.toFixed(2)}`}
                  </TableCell>
                  <TableCell>{offer.expires}</TableCell>
                  <TableCell>
                    <Button
                      variant={offer.active ? "default" : "outline"}
                      size="sm"
                      className={offer.active ? "bg-green-600 hover:bg-green-700" : "text-muted-foreground"}
                      onClick={() => handleToggleActive(offer.id)}
                    >
                      {offer.active ? "Active" : "Inactive"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(offer)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit offer</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(offer)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete offer</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Offer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Offer</DialogTitle>
            <DialogDescription>
              Create a new discount or special offer for your customers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Offer Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Summer Special"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Discount Type</Label>
              <Select
                value={type}
                onValueChange={(value: "percentage" | "fixed") => setType(value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="value">
                {type === "percentage" ? "Discount Percentage" : "Discount Amount"}
              </Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={type === "percentage" ? "15" : "10.00"}
                type="number"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SUMMER15"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="expires">Expiry Date</Label>
              <Input
                id="expires"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                placeholder="2025-07-31"
                type="date"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOffer}>
              Save Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Offer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
            <DialogDescription>
              Update the details of this offer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Offer Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Discount Type</Label>
              <Select
                value={type}
                onValueChange={(value: "percentage" | "fixed") => setType(value)}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-value">
                {type === "percentage" ? "Discount Percentage" : "Discount Amount"}
              </Label>
              <Input
                id="edit-value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="number"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-code">Coupon Code</Label>
              <Input
                id="edit-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-expires">Expiry Date</Label>
              <Input
                id="edit-expires"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                type="date"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditOffer}>
              Update Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this offer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentOffer && (
            <div className="py-4">
              <p><strong>Offer:</strong> {currentOffer.name}</p>
              <p><strong>Code:</strong> {currentOffer.code}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteOffer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Offers;
