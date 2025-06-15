
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { Minus, Plus, ShoppingCart, MapPin } from "lucide-react";
import {
  MainCategory,
  SubCategory,
  MealType,
  WeeklyMenuItem,
  useCreateWeeklyOrder,
  useLocationPricing,
  getAvailableLocations
} from "@/hooks/useWeeklyMenu";

const orderFormSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  customer_email: z.string().email("Please enter a valid email"),
  customer_phone: z.string().min(10, "Please enter a valid phone number"),
  delivery_address: z.string().min(10, "Please enter a complete address"),
  delivery_location: z.enum(['Dhanmondi', 'Farmgate', 'Panthapath', 'Karwanbazar', 'New Market', 'Banglamotor', 'Shahbag', 'Science Lab', 'Elephant Road', 'Mirpur Road', 'Zigatola', 'Lalmatia'], {
    required_error: "Please select a delivery location"
  }),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface WeeklyOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  mainCategory: MainCategory;
  subCategory: SubCategory;
  mealType: MealType;
  weeklyMenu: WeeklyMenuItem[];
  weekStartDate: string;
}

const WeeklyOrderForm = ({
  isOpen,
  onClose,
  mainCategory,
  subCategory,
  mealType,
  weeklyMenu,
  weekStartDate,
}: WeeklyOrderFormProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const createWeeklyOrder = useCreateWeeklyOrder();
  const { data: locationPricing } = useLocationPricing();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      delivery_address: "",
      delivery_location: undefined,
    },
  });

  const updateQuantity = (menuId: string, change: number) => {
    const currentQty = quantities[menuId] || 0;
    const newQty = Math.max(0, Math.min(currentQty + change, 5)); // Max 5 per day
    setQuantities(prev => ({
      ...prev,
      [menuId]: newQty
    }));
  };

  const calculateSubtotal = () => {
    return weeklyMenu.reduce((total, item) => {
      const qty = quantities[item.id] || 0;
      return total + (Number(item.price) * qty);
    }, 0);
  };

  const getDeliveryFee = () => {
    const selectedLocation = form.watch('delivery_location');
    if (!selectedLocation || !locationPricing) return 0;
    
    const pricing = locationPricing.find(p => p.location === selectedLocation);
    return pricing ? pricing.base_delivery_fee : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getDeliveryFee();
  };

  const getSelectedItems = () => {
    return weeklyMenu.filter(item => (quantities[item.id] || 0) > 0);
  };

  const onSubmit = async (data: OrderFormData) => {
    const selectedItems = getSelectedItems();
    
    if (selectedItems.length === 0) {
      toast.error("Please select at least one meal");
      return;
    }

    const orderData = {
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      delivery_address: data.delivery_address,
      delivery_location: data.delivery_location,
      main_category_id: mainCategory.id,
      sub_category_id: subCategory.id,
      meal_type_id: mealType.id,
      total_amount: calculateTotal(),
      items: selectedItems.map(item => ({
        weekly_menu_id: item.id,
        quantity: quantities[item.id],
        price: Number(item.price),
      })),
    };

    try {
      await createWeeklyOrder.mutateAsync(orderData);
      toast.success("Order placed successfully! You will receive a confirmation soon.");
      onClose();
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = calculateTotal();
  const selectedItemsCount = getSelectedItems().length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Order Weekly {mealType.name} - {subCategory.name}
          </DialogTitle>
          <DialogDescription>
            {mainCategory.name} for week starting {weekStartDate}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Menu Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Your Meals</h3>
            
            {weeklyMenu.map((item) => (
              <Card key={item.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {new Date(item.specific_date).toLocaleDateString('en-BD', { weekday: 'long' })}
                    </CardTitle>
                    <Badge variant={item.current_stock > 0 ? "default" : "destructive"}>
                      {item.current_stock} left
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <h4 className="font-semibold mb-2">{item.item_name}</h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-kazi-red">
                      ৳{Number(item.price).toFixed(2)}
                    </span>
                    
                    {item.current_stock > 0 ? (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={!quantities[item.id]}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {quantities[item.id] || 0}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={(quantities[item.id] || 0) >= 5}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="destructive">Sold Out</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Delivery Details</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Location *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select delivery area">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {field.value || "Select delivery area"}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAvailableLocations().map((location) => {
                            const pricing = locationPricing?.find(p => p.location === location);
                            return (
                              <SelectItem key={location} value={location}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{location}</span>
                                  {pricing && pricing.base_delivery_fee > 0 && (
                                    <span className="ml-2 text-sm text-gray-500">
                                      +৳{pricing.base_delivery_fee}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your complete delivery address"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Order Summary */}
                {selectedItemsCount > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-base">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {getSelectedItems().map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {new Date(item.specific_date).toLocaleDateString('en-BD', { weekday: 'long' })} - {item.item_name} x{quantities[item.id]}
                          </span>
                          <span>৳{(Number(item.price) * quantities[item.id]).toFixed(2)}</span>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>৳{subtotal.toFixed(2)}</span>
                      </div>
                      {deliveryFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Delivery Fee</span>
                          <span>৳{deliveryFee.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span className="text-kazi-red">৳{total.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={selectedItemsCount === 0 || createWeeklyOrder.isPending}
                    className="flex-1 bg-kazi-green hover:bg-kazi-light-green"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {createWeeklyOrder.isPending ? "Placing Order..." : `Order Now (৳${total.toFixed(2)})`}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklyOrderForm;
