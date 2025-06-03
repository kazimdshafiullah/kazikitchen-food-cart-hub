
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Package, Tag, AlertTriangle, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for categories
const mockCategories = [
  { id: "1", name: "Frozen Food", description: "Frozen meals and ingredients", itemCount: 45 },
  { id: "2", name: "Tiffin Services", description: "Daily meal subscription", itemCount: 12 },
  { id: "3", name: "Office Food", description: "Bulk catering for offices", itemCount: 8 },
  { id: "4", name: "Fresh Vegetables", description: "Daily fresh produce", itemCount: 23 },
  { id: "5", name: "Beverages", description: "Drinks and refreshments", itemCount: 15 }
];

// Mock data for inventory items
const mockInventoryItems = [
  {
    id: "1",
    name: "Chicken Biryani",
    category: "Frozen Food",
    stock: 45,
    minStock: 10,
    price: 350,
    supplier: "ABC Foods",
    lastRestocked: "2025-05-18"
  },
  {
    id: "2",
    name: "Vegetable Curry",
    category: "Tiffin Services",
    stock: 8,
    minStock: 15,
    price: 180,
    supplier: "Fresh Kitchen",
    lastRestocked: "2025-05-17"
  },
  {
    id: "3",
    name: "Office Lunch Box",
    category: "Office Food",
    stock: 25,
    minStock: 20,
    price: 450,
    supplier: "Bulk Catering Co",
    lastRestocked: "2025-05-19"
  },
  {
    id: "4",
    name: "Fresh Tomatoes",
    category: "Fresh Vegetables",
    stock: 2,
    minStock: 10,
    price: 80,
    supplier: "Local Farm",
    lastRestocked: "2025-05-20"
  }
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    const category = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      itemCount: 0
    };

    setCategories([...categories, category]);
    setNewCategory({ name: "", description: "" });
    setIsCreateCategoryOpen(false);
    
    toast({
      title: "Success",
      description: "Category created successfully"
    });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory?.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
    
    toast({
      title: "Success",
      description: "Category updated successfully"
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast({
      title: "Success",
      description: "Category deleted successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Category Management</h3>
          <p className="text-sm text-muted-foreground">Manage product categories</p>
        </div>
        <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>Add a new product category to organize your inventory</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category Name</label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCategory}>Create Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Items Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{category.itemCount} items</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteCategory(category.id)}
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

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category Name</label>
                <Input
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InventoryItems = () => {
  const [items, setItems] = useState(mockInventoryItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isReleaseOpen, setIsReleaseOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [releaseItem, setReleaseItem] = useState<any>(null);
  const [releaseQuantity, setReleaseQuantity] = useState(0);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    stock: 0,
    minStock: 0,
    price: 0,
    supplier: ""
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = items.filter(item => item.stock <= item.minStock);

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      toast({
        title: "Error",
        description: "Item name is required",
        variant: "destructive"
      });
      return;
    }

    const item = {
      id: Date.now().toString(),
      ...newItem,
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    setItems([...items, item]);
    setNewItem({
      name: "",
      category: "",
      stock: 0,
      minStock: 0,
      price: 0,
      supplier: ""
    });
    setIsAddItemOpen(false);

    toast({
      title: "Success",
      description: "Item added successfully"
    });
  };

  const handleEditItem = () => {
    if (!editingItem?.name.trim()) {
      toast({
        title: "Error",
        description: "Item name is required",
        variant: "destructive"
      });
      return;
    }

    setItems(items.map(item => 
      item.id === editingItem.id ? editingItem : item
    ));
    setEditingItem(null);
    setIsEditItemOpen(false);

    toast({
      title: "Success",
      description: "Item updated successfully"
    });
  };

  const handleReleaseStock = () => {
    if (releaseQuantity <= 0 || releaseQuantity > releaseItem.stock) {
      toast({
        title: "Error",
        description: "Invalid release quantity",
        variant: "destructive"
      });
      return;
    }

    setItems(items.map(item => 
      item.id === releaseItem.id 
        ? { ...item, stock: item.stock - releaseQuantity }
        : item
    ));
    
    setReleaseItem(null);
    setReleaseQuantity(0);
    setIsReleaseOpen(false);

    toast({
      title: "Success",
      description: "Stock released successfully"
    });
  };

  const openReleaseDialog = (item: any) => {
    setReleaseItem(item);
    setReleaseQuantity(0);
    setIsReleaseOpen(true);
  };

  const openEditDialog = (item: any) => {
    setEditingItem({ ...item });
    setIsEditItemOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCategories.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddItemOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Min Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Last Restocked</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Badge variant={item.stock <= item.minStock ? "destructive" : "secondary"}>
                    {item.stock}
                  </Badge>
                </TableCell>
                <TableCell>{item.minStock}</TableCell>
                <TableCell>৳{item.price}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell>{item.lastRestocked}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openReleaseDialog(item)}>
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>Add a new inventory item</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Item Name</label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Stock</label>
                <Input
                  type="number"
                  value={newItem.stock}
                  onChange={(e) => setNewItem({...newItem, stock: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Min Stock</label>
                <Input
                  type="number"
                  value={newItem.minStock}
                  onChange={(e) => setNewItem({...newItem, minStock: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Price (৳)</label>
              <Input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: parseInt(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Supplier</label>
              <Input
                value={newItem.supplier}
                onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                placeholder="Enter supplier name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update item information</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Item Name</label>
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={editingItem.category} onValueChange={(value) => setEditingItem({...editingItem, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Stock</label>
                  <Input
                    type="number"
                    value={editingItem.stock}
                    onChange={(e) => setEditingItem({...editingItem, stock: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Min Stock</label>
                  <Input
                    type="number"
                    value={editingItem.minStock}
                    onChange={(e) => setEditingItem({...editingItem, minStock: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Price (৳)</label>
                <Input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Supplier</label>
                <Input
                  value={editingItem.supplier}
                  onChange={(e) => setEditingItem({...editingItem, supplier: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditItemOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditItem}>Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Release Stock Dialog */}
      <Dialog open={isReleaseOpen} onOpenChange={setIsReleaseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Release Stock</DialogTitle>
            <DialogDescription>Release stock for {releaseItem?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Stock: {releaseItem?.stock}</label>
            </div>
            <div>
              <label className="text-sm font-medium">Release Quantity</label>
              <Input
                type="number"
                min="1"
                max={releaseItem?.stock || 0}
                value={releaseQuantity}
                onChange={(e) => setReleaseQuantity(parseInt(e.target.value) || 0)}
                placeholder="Enter quantity to release"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReleaseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReleaseStock}>Release Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Inventory = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
        <p className="text-muted-foreground">Manage your products, categories, and stock levels</p>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Inventory Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <InventoryItems />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
