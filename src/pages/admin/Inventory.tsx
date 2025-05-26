import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Search, Edit, Trash2, Plus, Package, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Mock inventory data
type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  lastRestocked: string;
  minLevel: number;
};

const initialInventory: InventoryItem[] = [
  { 
    id: "INV-001", 
    name: "Flour", 
    category: "Baking", 
    quantity: 50, 
    unit: "kg", 
    lastRestocked: "2025-05-15", 
    minLevel: 10 
  },
  { 
    id: "INV-002", 
    name: "Rice", 
    category: "Grains", 
    quantity: 75, 
    unit: "kg", 
    lastRestocked: "2025-05-10", 
    minLevel: 15 
  },
  { 
    id: "INV-003", 
    name: "Tomatoes", 
    category: "Vegetables", 
    quantity: 20, 
    unit: "kg", 
    lastRestocked: "2025-05-20", 
    minLevel: 5 
  },
  { 
    id: "INV-004", 
    name: "Chicken", 
    category: "Meat", 
    quantity: 30, 
    unit: "kg", 
    lastRestocked: "2025-05-18", 
    minLevel: 8 
  },
  { 
    id: "INV-005", 
    name: "Milk", 
    category: "Dairy", 
    quantity: 45, 
    unit: "liter", 
    lastRestocked: "2025-05-19", 
    minLevel: 12 
  }
];

const inventoryCategories = [
  "Baking", "Grains", "Vegetables", "Fruits", "Meat", "Seafood", 
  "Dairy", "Spices", "Beverages", "Oils", "Sauces", "Other"
];

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [removeQuantity, setRemoveQuantity] = useState(0);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    id: "",
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    lastRestocked: new Date().toISOString().split('T')[0],
    minLevel: 0
  });

  // Filter inventory based on search term
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const itemId = `INV-${(inventory.length + 1).toString().padStart(3, '0')}`;
    
    const itemToAdd = {
      ...newItem,
      id: itemId,
      lastRestocked: newItem.lastRestocked || new Date().toISOString().split('T')[0]
    } as InventoryItem;
    
    setInventory([...inventory, itemToAdd]);
    toast.success("Inventory item added successfully");
    setIsAddDialogOpen(false);
    setNewItem({
      id: "",
      name: "",
      category: "",
      quantity: 0,
      unit: "",
      lastRestocked: new Date().toISOString().split('T')[0],
      minLevel: 0
    });
  };

  const handleEditItem = () => {
    if (!selectedItem) return;
    
    const updatedInventory = inventory.map(item => 
      item.id === selectedItem.id ? selectedItem : item
    );
    
    setInventory(updatedInventory);
    toast.success("Inventory item updated successfully");
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = () => {
    if (!selectedItem) return;
    
    const updatedInventory = inventory.filter(item => 
      item.id !== selectedItem.id
    );
    
    setInventory(updatedInventory);
    toast.success("Inventory item deleted successfully");
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleRemoveQuantity = () => {
    if (!selectedItem || removeQuantity <= 0) {
      toast.error("Please enter a valid quantity to remove");
      return;
    }
    
    if (removeQuantity > selectedItem.quantity) {
      toast.error("Cannot remove more than available quantity");
      return;
    }
    
    const updatedInventory = inventory.map(item => 
      item.id === selectedItem.id 
        ? { ...item, quantity: item.quantity - removeQuantity }
        : item
    );
    
    setInventory(updatedInventory);
    toast.success(`Removed ${removeQuantity} ${selectedItem.unit} of ${selectedItem.name}`);
    setIsRemoveDialogOpen(false);
    setSelectedItem(null);
    setRemoveQuantity(0);
  };

  const openEditDialog = (item: InventoryItem) => {
    setSelectedItem({...item});
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const openRemoveDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsRemoveDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <p className="text-muted-foreground">Manage your kitchen inventory and supplies</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          className="w-full sm:w-auto"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>
      
      {/* Inventory Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Stock</p>
                <p className="text-2xl font-bold">{inventory.filter(item => item.quantity > item.minLevel).length} items</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Package className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">{inventory.filter(item => item.quantity <= item.minLevel && item.quantity > 0).length} items</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Package className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{inventory.filter(item => item.quantity === 0).length} items</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <Package className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <div className={`capitalize inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      item.quantity === 0 ? "bg-red-100 text-red-800" :
                      item.quantity <= item.minLevel ? "bg-yellow-100 text-yellow-800" : 
                      "bg-green-100 text-green-800"
                    }`}>
                      {item.quantity === 0 ? "Out of stock" : 
                       item.quantity <= item.minLevel ? "Low stock" : 
                       "In stock"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openRemoveDialog(item)}
                        className="text-orange-500 hover:text-orange-600"
                        title="Remove quantity"
                      >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Remove quantity</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit item</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => openDeleteDialog(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete item</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No inventory items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Inventory Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new item to your inventory
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Item Name</label>
              <Input 
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Category</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              >
                <option value="">Select Category</option>
                {inventoryCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input 
                  type="number"
                  min="0"
                  value={newItem.quantity?.toString()}
                  onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Unit</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                >
                  <option value="">Select Unit</option>
                  <option value="kg">kg</option>
                  <option value="liter">liter</option>
                  <option value="piece">piece</option>
                  <option value="dozen">dozen</option>
                  <option value="box">box</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Last Restocked Date</label>
              <Input 
                type="date"
                value={newItem.lastRestocked}
                onChange={(e) => setNewItem({...newItem, lastRestocked: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Minimum Level (for alerts)</label>
              <Input 
                type="number"
                min="0"
                value={newItem.minLevel?.toString()}
                onChange={(e) => setNewItem({...newItem, minLevel: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Inventory Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update inventory item information
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Item Name</label>
                <Input 
                  value={selectedItem.name}
                  onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={selectedItem.category}
                  onChange={(e) => setSelectedItem({...selectedItem, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {inventoryCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <Input 
                    type="number"
                    min="0"
                    value={selectedItem.quantity.toString()}
                    onChange={(e) => setSelectedItem({...selectedItem, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Unit</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={selectedItem.unit}
                    onChange={(e) => setSelectedItem({...selectedItem, unit: e.target.value})}
                  >
                    <option value="">Select Unit</option>
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                    <option value="box">box</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Last Restocked Date</label>
                <Input 
                  type="date"
                  value={selectedItem.lastRestocked}
                  onChange={(e) => setSelectedItem({...selectedItem, lastRestocked: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Minimum Level (for alerts)</label>
                <Input 
                  type="number"
                  min="0"
                  value={selectedItem.minLevel.toString()}
                  onChange={(e) => setSelectedItem({...selectedItem, minLevel: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditItem}>
              Update Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Remove Quantity Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Inventory Quantity</DialogTitle>
            <DialogDescription>
              Remove quantity from inventory (e.g., items used, damaged, or expired)
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div>
                <p className="font-medium">{selectedItem.name}</p>
                <p className="text-sm text-muted-foreground">Current quantity: {selectedItem.quantity} {selectedItem.unit}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Quantity to Remove</label>
                <Input 
                  type="number"
                  min="1"
                  max={selectedItem.quantity}
                  value={removeQuantity.toString()}
                  onChange={(e) => setRemoveQuantity(parseInt(e.target.value) || 0)}
                  placeholder="Enter quantity to remove"
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                Remaining after removal: {selectedItem.quantity - removeQuantity} {selectedItem.unit}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRemoveQuantity} variant="destructive">
              Remove Quantity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Inventory Item Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Inventory Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this inventory item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="py-4">
              <p className="font-medium">{selectedItem.name}</p>
              <p className="text-sm text-muted-foreground">ID: {selectedItem.id}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
