
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit2, Trash2, Upload, ImageIcon, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMainCategories, useSubCategories, useMealTypes } from "@/hooks/useWeeklyMenu";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const MenuManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all-categories");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all-subcategories");
  const [selectedMealType, setSelectedMealType] = useState<string>("all-mealtypes");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    sub_category: "",
    meal_type: "",
    specific_date: "",
    stock_limit: "",
  });
  
  const { toast } = useToast();
  const { data: mainCategories } = useMainCategories();
  const { data: subCategories } = useSubCategories(newMenuItem.category);
  const { data: allSubCategories } = useSubCategories();
  const { data: mealTypes } = useMealTypes();

  // Check if selected category is School Tiffin (doesn't need meal type)
  const isSchoolTiffin = newMenuItem.category && mainCategories?.find(cat => 
    cat.id === newMenuItem.category && (cat.name.toLowerCase().includes('school') || cat.name.toLowerCase().includes('tiffin'))
  );

  // Get available dates (exclude weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      
      // Only include Sunday (0) to Thursday (4)
      if (dayOfWeek >= 0 && dayOfWeek <= 4) {
        dates.push(date);
      }
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const handleCreateMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price || !newMenuItem.category || !newMenuItem.specific_date) {
      toast({
        title: "Error",
        description: "Please fill in required fields (Name, Price, Category, Date)",
        variant: "destructive",
      });
      return;
    }

    if (!isSchoolTiffin && !newMenuItem.meal_type) {
      toast({
        title: "Error",
        description: "Meal type is required for Office Food",
        variant: "destructive",
      });
      return;
    }

    console.log("Creating menu item:", {
      ...newMenuItem,
      meal_type: isSchoolTiffin ? null : newMenuItem.meal_type
    });
    
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
      specific_date: "",
      stock_limit: "",
    });
    setSelectedDate(undefined);
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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setNewMenuItem(prev => ({ 
        ...prev, 
        specific_date: date.toISOString().split('T')[0] 
      }));
    } else {
      setNewMenuItem(prev => ({ ...prev, specific_date: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
        <p className="text-gray-600">
          Manage menu items with date-based scheduling for School Tiffin and Office Food
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
              Create menu items with specific dates and pricing
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

            <div>
              <Label htmlFor="specific-date">Specific Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      const dayOfWeek = date.getDay();
                      return dayOfWeek === 5 || dayOfWeek === 6; // Disable Friday and Saturday
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500 mt-1">
                Only Sunday to Thursday available (weekends excluded)
              </p>
            </div>

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
              View and manage current menu items by date
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
              {/* Sample menu item with date display */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Sample Menu Item</h4>
                    <p className="text-sm text-gray-600">৳120 - {format(new Date(), "MMM dd, yyyy")}</p>
                    <p className="text-xs text-gray-500">School Tiffin Regular</p>
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
