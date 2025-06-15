import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { useMainCategories, useCreateMenuItem } from "@/hooks/useMenuManagement";
import { toast } from "@/hooks/use-toast";
import { initializeDatabase } from "@/utils/initializeDatabase";

const FrozenFoodTab = () => {
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    stock_limit: "100",
  });

  const { data: mainCategories, isLoading: categoriesLoading, error: categoriesError, refetch } = useMainCategories();
  const createMenuItem = useCreateMenuItem();

  useEffect(() => {
    const initDb = async () => {
      await initializeDatabase();
      refetch(); // Refetch categories after initialization
    };
    
    if (!categoriesLoading && (!mainCategories || mainCategories.length === 0)) {
      initDb();
    }
  }, [categoriesLoading, mainCategories, refetch]);

  console.log('Main categories data:', mainCategories);
  console.log('Categories loading:', categoriesLoading);
  console.log('Categories error:', categoriesError);

  const frozenFoodCategory = mainCategories?.find(cat => cat.name === 'frozen_food');
  console.log('Frozen food category found:', frozenFoodCategory);

  const handleCreateItem = () => {
    console.log('Handle create item called with:', newItem);
    
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in the required fields (name and price)",
        variant: "destructive",
      });
      return;
    }

    if (!frozenFoodCategory) {
      console.error('Frozen food category not found');
      toast({
        title: "Error",
        description: "Frozen food category not found. Initializing database...",
        variant: "destructive",
      });
      
      // Try to initialize database
      initializeDatabase().then(() => {
        refetch();
      });
      return;
    }

    console.log('Creating menu item...');
    createMenuItem.mutate({
      name: newItem.name,
      description: newItem.description || null,
      price: parseFloat(newItem.price),
      image_url: newItem.image_url || null,
      main_category_id: frozenFoodCategory.id,
      sub_category_id: null,
      meal_type_id: null,
      specific_date: null,
      stock_limit: parseInt(newItem.stock_limit) || 100,
      is_active: true,
    });

    // Reset form
    setNewItem({
      name: "",
      description: "",
      price: "",
      image_url: "",
      stock_limit: "100",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewItem(prev => ({ ...prev, image_url: imageUrl }));
    }
  };

  if (categoriesLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading categories...</div>
        </CardContent>
      </Card>
    );
  }

  if (categoriesError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading categories: {categoriesError.message}
            <Button 
              onClick={() => initializeDatabase().then(() => refetch())} 
              className="mt-2 block mx-auto"
            >
              Initialize Database
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!frozenFoodCategory) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-yellow-600">
            <p className="mb-4">Frozen food category not found. Click below to initialize the database with required categories.</p>
            <Button 
              onClick={() => initializeDatabase().then(() => refetch())}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Initialize Database
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Frozen Food Item</CardTitle>
        <CardDescription>
          Create frozen food items without subcategories or meal plans
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Item Name *</Label>
          <Input
            id="name"
            value={newItem.name}
            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Chicken Biryani, Beef Curry"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newItem.description}
            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of the frozen food item"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (৳) *</Label>
            <Input
              id="price"
              type="number"
              value={newItem.price}
              onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock Limit</Label>
            <Input
              id="stock"
              type="number"
              value={newItem.stock_limit}
              onChange={(e) => setNewItem(prev => ({ ...prev, stock_limit: e.target.value }))}
              placeholder="100"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="image">Upload Image</Label>
          <div className="mt-2">
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('image')?.click()}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            {newItem.image_url && (
              <div className="mt-2">
                <img
                  src={newItem.image_url}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={handleCreateItem} 
          className="w-full"
          disabled={createMenuItem.isPending}
        >
          {createMenuItem.isPending ? "Creating..." : "Create Frozen Food Item"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FrozenFoodTab;
