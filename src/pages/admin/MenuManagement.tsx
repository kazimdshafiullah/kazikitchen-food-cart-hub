
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Upload, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMainCategories, useSubCategories, useMealTypes } from "@/hooks/useWeeklyMenu";

const MenuManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all-categories");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all-subcategories");
  const [selectedMealType, setSelectedMealType] = useState<string>("all-mealtypes");
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    sub_category: "",
    meal_type: "",
    day_of_week: "",
    stock_limit: "",
  });
  
  const { toast } = useToast();
  const { data: mainCategories } = useMainCategories();
  const { data: subCategories } = useSubCategories(newMenuItem.category);
  const { data: allSubCategories } = useSubCategories();
  const { data: mealTypes } = useMealTypes();

  const daysOfWeek = [
    { id: "0", name: "Sunday" },
    { id: "1", name: "Monday" },
    { id: "2", name: "Tuesday" },
    { id: "3", name: "Wednesday" },
    { id: "4", name: "Thursday" },
  ];

  // Check if selected category is School Tiffin (doesn't need meal type)
  const isSchoolTiffin = newMenuItem.category && mainCategories?.find(cat => 
    cat.id === newMenuItem.category && (cat.name.toLowerCase().includes('school') || cat.name.toLowerCase().includes('tiffin'))
  );

  const handleCreateMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price || !newMenuItem.category) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    console.log("Creating menu item:", newMenuItem);
    
    toast({
      title: "Success",
      description: "Menu item created successfully",
    });

    // Reset form
    setNewMenuItem({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category: "",
      sub_category: "",
      meal_type: "",
      day_of_week: "",
      stock_limit: "",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to your storage service
      const imageUrl = URL.createObjectURL(file);
      setNewMenuItem(prev => ({ ...prev, image_url: imageUrl }));
      
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
        <p className="text-gray-600">
          Manage menu items for Frozen Food, School Tiffin, and Office Food categories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Menu Item */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Menu Item
            </CardTitle>
            <CardDescription>
              Create menu items with photos and pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={newMenuItem.category}
                onValueChange={(value) => {
                  setNewMenuItem(prev => ({ ...prev, category: value, sub_category: "", meal_type: "" }));
                  setSelectedCategory(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {mainCategories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newMenuItem.category && subCategories && subCategories.length > 0 && (
              <div>
                <Label htmlFor="sub-category">Sub Category *</Label>
                <Select
                  value={newMenuItem.sub_category}
                  onValueChange={(value) => {
                    setNewMenuItem(prev => ({ ...prev, sub_category: value, meal_type: "" }));
                    setSelectedSubCategory(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub category" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((subCategory) => (
                      <SelectItem key={subCategory.id} value={subCategory.id}>
                        <div className="flex items-center gap-2">
                          {subCategory.name}
                          {subCategory.food_plan && (
                            <Badge variant="outline">
                              {subCategory.food_plan}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {newMenuItem.sub_category && !isSchoolTiffin && mealTypes && mealTypes.length > 0 && (
              <div>
                <Label htmlFor="meal-type">Meal Type *</Label>
                <Select
                  value={newMenuItem.meal_type}
                  onValueChange={(value) =>
                    setNewMenuItem(prev => ({ ...prev, meal_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypes.map((mealType) => (
                      <SelectItem key={mealType.id} value={mealType.id}>
                        {mealType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {newMenuItem.category && (
              <div>
                <Label htmlFor="day-of-week">Day of Week *</Label>
                <Select
                  value={newMenuItem.day_of_week}
                  onValueChange={(value) =>
                    setNewMenuItem(prev => ({ ...prev, day_of_week: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.id} value={day.id}>
                        {day.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={newMenuItem.name}
                onChange={(e) =>
                  setNewMenuItem(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Chicken Biriyani, Egg Roll"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newMenuItem.description}
                onChange={(e) =>
                  setNewMenuItem(prev => ({ ...prev, description: e.target.value }))
                }
                placeholder="Brief description of the menu item"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (৳) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newMenuItem.price}
                  onChange={(e) =>
                    setNewMenuItem(prev => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock Limit</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newMenuItem.stock_limit}
                  onChange={(e) =>
                    setNewMenuItem(prev => ({ ...prev, stock_limit: e.target.value }))
                  }
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
                {newMenuItem.image_url && (
                  <div className="mt-2">
                    <img
                      src={newMenuItem.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button onClick={handleCreateMenuItem} className="w-full">
              Create Menu Item
            </Button>
          </CardContent>
        </Card>

        {/* Menu Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Menu Items</CardTitle>
            <CardDescription>
              View and manage current menu items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All categories</SelectItem>
                  {mainCategories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-subcategories">All sub categories</SelectItem>
                  {allSubCategories?.map((subCategory) => (
                    <SelectItem key={subCategory.id} value={subCategory.id}>
                      <div className="flex items-center gap-2">
                        {subCategory.name}
                        {subCategory.food_plan && (
                          <Badge variant="outline" className="text-xs">
                            {subCategory.food_plan}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                <SelectTrigger>
                  <SelectValue placeholder="Meal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-mealtypes">All meal types</SelectItem>
                  {mealTypes?.map((mealType) => (
                    <SelectItem key={mealType.id} value={mealType.id}>
                      {mealType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {/* Placeholder for menu items - in real app, this would come from API */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Sample Menu Item</h4>
                    <p className="text-sm text-gray-600">৳120 - Office Food Lunch</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Active</Badge>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-center text-gray-500 py-8">
                No menu items found. Create your first menu item above.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MenuManagement;
