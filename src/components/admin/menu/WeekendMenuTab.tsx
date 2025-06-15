
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
  useMealPlans, 
  useCreateMenuItem 
} from "@/hooks/useMenuManagement";

const WeekendMenuTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    sub_category_id: "",
    meal_type_id: "",
    meal_plan_id: "",
    specific_date: "",
    stock_limit: "100",
  });

  const { data: mainCategories } = useMainCategories();
  const weekendMenuCategory = mainCategories?.find(cat => cat.name === 'weekend_menu');
  
  const { data: subCategories } = useSubCategories(weekendMenuCategory?.id);
  const { data: mealTypes } = useMealTypes(newItem.sub_category_id || undefined);
  const { data: mealPlans } = useMealPlans();
  const createMenuItem = useCreateMenuItem();

  const handleCreateItem = () => {
    if (!newItem.name || !newItem.price || !newItem.sub_category_id || 
        !newItem.meal_type_id || !newItem.meal_plan_id || !newItem.specific_date || 
        !weekendMenuCategory) {
      return;
    }

    createMenuItem.mutate({
      name: newItem.name,
      description: newItem.description || null,
      price: parseFloat(newItem.price),
      image_url: newItem.image_url || null,
      main_category_id: weekendMenuCategory.id,
      sub_category_id: newItem.sub_category_id,
      meal_type_id: newItem.meal_type_id,
      meal_plan_id: newItem.meal_plan_id,
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
      meal_plan_id: "",
      specific_date: "",
      stock_limit: "100",
    });
    setSelectedDate(undefined);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Weekend Menu Item</CardTitle>
        <CardDescription>
          Create menu items for Office Food (Breakfast/Lunch) or School Tiffin (Breakfast) with meal plans
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="sub-category">Category *</Label>
          <Select
            value={newItem.sub_category_id}
            onValueChange={(value) => {
              setNewItem(prev => ({ 
                ...prev, 
                sub_category_id: value, 
                meal_type_id: "",
                meal_plan_id: ""
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {subCategories?.filter(cat => cat.is_enabled).map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name === 'office_food' ? 'Office Food' : 'School Tiffin'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {newItem.sub_category_id && (
          <div>
            <Label htmlFor="meal-type">Meal Type *</Label>
            <Select
              value={newItem.meal_type_id}
              onValueChange={(value) => setNewItem(prev => ({ ...prev, meal_type_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                {mealTypes?.filter(type => type.is_enabled).map((mealType) => (
                  <SelectItem key={mealType.id} value={mealType.id}>
                    {mealType.name.charAt(0).toUpperCase() + mealType.name.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {newItem.meal_type_id && (
          <div>
            <Label htmlFor="meal-plan">Meal Plan *</Label>
            <Select
              value={newItem.meal_plan_id}
              onValueChange={(value) => setNewItem(prev => ({ ...prev, meal_plan_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meal plan" />
              </SelectTrigger>
              <SelectContent>
                {mealPlans?.filter(plan => plan.is_enabled).map((mealPlan) => (
                  <SelectItem key={mealPlan.id} value={mealPlan.id}>
                    {mealPlan.name.charAt(0).toUpperCase() + mealPlan.name.slice(1)}
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
