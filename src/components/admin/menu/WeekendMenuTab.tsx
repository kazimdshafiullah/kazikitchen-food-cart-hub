
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Upload, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  useMainCategories, 
  useSubCategories, 
  useMealTypes, 
  useCreateMenuItem 
} from "@/hooks/useMenuManagement";

const WeekendMenuTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    sub_category_id: "",
    meal_type_id: "",
    specific_date: "",
    stock_limit: "100",
  });

  const { data: mainCategories } = useMainCategories();
  const { data: subCategories } = useSubCategories(selectedMainCategory);
  const { data: mealTypes } = useMealTypes();
  const createMenuItem = useCreateMenuItem();

  // Filter out frozen food categories - only show School Tiffin and Office Food
  const weekendCategories = mainCategories?.filter(cat => 
    cat.name === 'School Tiffin' || cat.name === 'Office Food'
  ) || [];

  const handleCreateItem = () => {
    if (!newItem.name || !newItem.price || !selectedMainCategory || 
        !newItem.sub_category_id || !newItem.meal_type_id || !newItem.specific_date) {
      return;
    }

    createMenuItem.mutate({
      name: newItem.name,
      description: newItem.description || null,
      price: parseFloat(newItem.price),
      image_url: newItem.image_url || null,
      main_category_id: selectedMainCategory,
      sub_category_id: newItem.sub_category_id,
      meal_type_id: newItem.meal_type_id,
      specific_date: newItem.specific_date,
      stock_limit: parseInt(newItem.stock_limit) || 100,
      is_active: true,
    });

    // Reset form
    setNewItem({
      name: "",
      description: "",
      price: "",
      image_url: "",
      sub_category_id: "",
      meal_type_id: "",
      specific_date: "",
      stock_limit: "100",
    });
    setSelectedDate(undefined);
    setSelectedMainCategory("");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewItem(prev => ({ ...prev, image_url: imageUrl }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setNewItem(prev => ({ 
        ...prev, 
        specific_date: date.toISOString().split('T')[0] 
      }));
    } else {
      setNewItem(prev => ({ ...prev, specific_date: "" }));
    }
  };

  const isDateDisabled = (date: Date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 5 || dayOfWeek === 6; // Disable Friday and Saturday
  };

  const handleMainCategoryChange = (categoryId: string) => {
    setSelectedMainCategory(categoryId);
    setNewItem(prev => ({ 
      ...prev, 
      sub_category_id: "",
      meal_type_id: ""
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Weekend Menu Item</CardTitle>
        <CardDescription>
          Create menu items for School Tiffin (Breakfast) or Office Food (Breakfast/Lunch) with meal plans (Regular, Diet, Premium)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="main-category">Main Category *</Label>
          <Select
            value={selectedMainCategory}
            onValueChange={handleMainCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {weekendCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedMainCategory && (
          <div>
            <Label htmlFor="sub-category">Sub Category *</Label>
            <Select
              value={newItem.sub_category_id}
              onValueChange={(value) => {
                setNewItem(prev => ({ 
                  ...prev, 
                  sub_category_id: value, 
                  meal_type_id: ""
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sub category" />
              </SelectTrigger>
              <SelectContent>
                {subCategories?.filter(cat => cat.is_enabled).map((subCategory) => (
                  <SelectItem key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {newItem.sub_category_id && (
          <div>
            <Label htmlFor="meal-plan">Meal Plan *</Label>
            <Select
              value={newItem.meal_type_id}
              onValueChange={(value) => setNewItem(prev => ({ ...prev, meal_type_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meal plan" />
              </SelectTrigger>
              <SelectContent>
                {mealTypes?.filter(type => type.is_enabled).map((mealType) => (
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
                {selectedDate ? format(selectedDate, "PPP") : "Select specific date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-gray-500 mt-1">
            Only Sunday to Thursday available (Weekends excluded)
          </p>
        </div>

        <div>
          <Label htmlFor="name">Item Name *</Label>
          <Input
            id="name"
            value={newItem.name}
            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Chicken Biriyani, Egg Roll"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newItem.description}
            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
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
          {createMenuItem.isPending ? "Creating..." : "Create Weekend Menu Item"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeekendMenuTab;
