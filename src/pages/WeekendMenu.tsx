
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Star, Utensils, Crown, Heart } from "lucide-react";
import { 
  useMainCategories, 
  useSubCategories, 
  useMealTypes,
  useWeeklyMenuByDate,
  getDayName,
  getAvailableOrderingDates
} from "@/hooks/useWeeklyMenu";

const WeekendMenu = () => {
  const [activeTab, setActiveTab] = useState("school-tiffin");
  const [activeMealType, setActiveMealType] = useState("Regular");
  const [activeSubCategory, setActiveSubCategory] = useState("breakfast");

  const { data: mainCategories } = useMainCategories();
  const { data: mealTypes } = useMealTypes();

  // Get School Tiffin and Office Food categories
  const schoolTiffinCategory = mainCategories?.find(cat => cat.name === 'School Tiffin');
  const officeFoodCategory = mainCategories?.find(cat => cat.name === 'Office Food');

  const { data: schoolTiffinSubCategories } = useSubCategories(schoolTiffinCategory?.id);
  const { data: officeFoodSubCategories } = useSubCategories(officeFoodCategory?.id);

  // Get current meal type ID
  const currentMealType = mealTypes?.find(mt => mt.name === activeMealType);

  // Get current subcategory for School Tiffin (always Breakfast)
  const schoolBreakfastSubCategory = schoolTiffinSubCategories?.find(sub => sub.name === 'Breakfast');

  // Get available dates for School Tiffin
  const availableDates = useMemo(() => {
    if (!schoolTiffinCategory || !schoolBreakfastSubCategory) return [];
    return getAvailableOrderingDates(schoolTiffinCategory, schoolBreakfastSubCategory);
  }, [schoolTiffinCategory, schoolBreakfastSubCategory]);

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'Regular': return <Utensils className="h-4 w-4" />;
      case 'Diet': return <Heart className="h-4 w-4" />;
      case 'Premium': return <Crown className="h-4 w-4" />;
      default: return null;
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'Regular': return 'bg-blue-500';
      case 'Diet': return 'bg-green-500';
      case 'Premium': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Sample menu data generator based on date and meal type
  const getMenuItemForDate = (date: Date, mealType: string) => {
    const dayOfWeek = date.getDay();
    const dayName = getDayName(dayOfWeek);
    
    // Sample items based on meal type and day
    const menuItems: Record<string, any> = {
      'Regular': {
        0: { item: "Egg Roll", price: 45, description: "Delicious egg roll with fresh vegetables" },
        1: { item: "Alu Paratha", price: 40, description: "Traditional potato-stuffed paratha" },
        2: { item: "Chicken Keema Paratha", price: 65, description: "Spiced chicken keema with soft paratha" },
        3: { item: "Vegetable Roll", price: 35, description: "Fresh vegetable roll with herbs" },
        4: { item: "Fish Fry with Rice", price: 85, description: "Crispy fish fry served with steamed rice" }
      },
      'Diet': {
        0: { item: "Grilled Chicken Wrap", price: 55, description: "Healthy grilled chicken with vegetables" },
        1: { item: "Vegetable Salad", price: 35, description: "Fresh mixed vegetable salad" },
        2: { item: "Boiled Egg with Bread", price: 40, description: "Protein-rich boiled egg with whole wheat bread" },
        3: { item: "Fruit Bowl", price: 30, description: "Seasonal fresh fruits" },
        4: { item: "Grilled Fish with Salad", price: 70, description: "Healthy grilled fish with green salad" }
      },
      'Premium': {
        0: { item: "Chicken Biriyani", price: 95, description: "Premium chicken biriyani with spices" },
        1: { item: "Beef Tehari", price: 110, description: "Traditional beef tehari with premium ingredients" },
        2: { item: "Mutton Curry with Rice", price: 125, description: "Tender mutton curry with basmati rice" },
        3: { item: "Prawn Curry", price: 115, description: "Fresh prawn curry with rice" },
        4: { item: "Special Mixed Platter", price: 140, description: "Premium mixed items platter" }
      }
    };

    const menuItem = menuItems[mealType]?.[dayOfWeek];
    
    if (!menuItem) return null;

    return {
      day: dayName,
      dayNumber: dayOfWeek,
      date: date,
      item: menuItem.item,
      price: menuItem.price,
      description: menuItem.description,
      available: true, // Will be determined by the dates array
      mealType: mealType,
      subCategory: schoolBreakfastSubCategory,
      dateString: date.toISOString().split('T')[0]
    };
  };

  const MenuCard = ({ item, dateInfo }: { item: any, dateInfo: any }) => {
    const isAvailable = dateInfo.canOrder;
    
    return (
      <Card className={`group transition-all duration-300 border ${isAvailable ? 'border-amber-200 hover:border-amber-400 hover:shadow-lg' : 'border-gray-200 opacity-75'}`}>
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
              <div className="text-6xl">🍽️</div>
            </div>
            <Badge className={`absolute top-2 left-2 ${getMealTypeColor(item.mealType)} text-white`}>
              {item.day}
            </Badge>
            <Badge className={`absolute top-2 right-2 ${getMealTypeColor(item.mealType)} text-white flex items-center gap-1`}>
              {getMealTypeIcon(item.mealType)}
              {item.mealType}
            </Badge>
            {isAvailable ? (
              <Badge className="absolute bottom-2 right-2 bg-green-500 text-white">
                Available
              </Badge>
            ) : (
              <Badge className="absolute bottom-2 right-2 bg-red-500 text-white">
                Order Closed
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg text-amber-800 mb-2">{item.item}</CardTitle>
          <p className="text-amber-600 text-sm mb-3">{item.description}</p>
          <p className="text-xs text-amber-500 mb-3">
            {dateInfo.date.toLocaleDateString('en-BD')}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-amber-800">৳{item.price}</span>
            <Button 
              asChild
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              disabled={!isAvailable}
            >
              {isAvailable ? (
                <Link to={`/weekend-order/school/${item.dateString}/${activeMealType}/${item.subCategory?.id || 'default'}`}>
                  Order Now
                </Link>
              ) : (
                <span>Order Closed</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Generate School Tiffin menu items for available dates
  const getSchoolTiffinMenuItems = () => {
    const menuItems: any[] = [];
    
    availableDates.slice(0, 10).forEach(dateInfo => { // Show first 10 available dates
      const menuItem = getMenuItemForDate(dateInfo.date, activeMealType);
      if (menuItem) {
        menuItems.push({ menuItem, dateInfo });
      }
    });
    
    return menuItems;
  };

  const schoolTiffinMenuItems = getSchoolTiffinMenuItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Weekend Order Menu</h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Plan your daily meals with our School Tiffin and Office Food services
          </p>
          <div className="mt-4 p-4 bg-amber-100 rounded-lg">
            <p className="text-amber-800 font-medium">
              <Clock className="inline w-4 h-4 mr-2" />
              School Tiffin: Order by 10:00 PM the day before | Office Food Breakfast: Order by 10:00 PM the day before | Office Food Lunch: Order by 9:30 AM same day
            </p>
            <p className="text-amber-700 text-sm mt-2">
              Available days: Sunday to Thursday (Weekends excluded)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="school-tiffin" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              School Tiffin
            </TabsTrigger>
            <TabsTrigger value="office-food" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Office Food
            </TabsTrigger>
          </TabsList>

          <TabsContent value="school-tiffin">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-amber-800 mb-2">School Tiffin Menu</h2>
              <p className="text-amber-600">Fresh daily tiffin for students - Order by 10 PM the day before</p>
              
              {/* Meal Type Selection */}
              <div className="mt-4 flex justify-center gap-4">
                {mealTypes?.filter(mt => ['Regular', 'Diet', 'Premium'].includes(mt.name)).map(mealType => (
                  <Button
                    key={mealType.id}
                    variant={activeMealType === mealType.name ? "default" : "outline"}
                    onClick={() => setActiveMealType(mealType.name)}
                    className={`flex items-center gap-2 ${
                      activeMealType === mealType.name 
                        ? `${getMealTypeColor(mealType.name)} text-white` 
                        : `border-amber-300 text-amber-700 hover:bg-amber-50`
                    }`}
                  >
                    {getMealTypeIcon(mealType.name)}
                    {mealType.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {schoolTiffinMenuItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {schoolTiffinMenuItems.map(({ menuItem, dateInfo }, index) => (
                  <MenuCard key={`${menuItem.mealType}-${menuItem.dateString}-${index}`} item={menuItem} dateInfo={dateInfo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-amber-600">Loading School Tiffin menu items...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="office-food">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-amber-800 mb-2">Office Food Menu</h2>
              <p className="text-amber-600">Professional catering for offices</p>
              
              {/* Sub Category Selection for Office Food */}
              <div className="mt-4 flex justify-center gap-4 mb-4">
                <Button
                  variant={activeSubCategory === "breakfast" ? "default" : "outline"}
                  onClick={() => setActiveSubCategory("breakfast")}
                  className={activeSubCategory === "breakfast" ? "bg-amber-500 text-white" : "border-amber-300 text-amber-700 hover:bg-amber-50"}
                >
                  Breakfast (Order by 10 PM day before)
                </Button>
                <Button
                  variant={activeSubCategory === "lunch" ? "default" : "outline"}
                  onClick={() => setActiveSubCategory("lunch")}
                  className={activeSubCategory === "lunch" ? "bg-amber-500 text-white" : "border-amber-300 text-amber-700 hover:bg-amber-50"}
                >
                  Lunch (Order by 9:30 AM same day)
                </Button>
              </div>

              {/* Meal Type Selection */}
              <div className="flex justify-center gap-4">
                {mealTypes?.filter(mt => ['Regular', 'Diet', 'Premium'].includes(mt.name)).map(mealType => (
                  <Button
                    key={mealType.id}
                    variant={activeMealType === mealType.name ? "default" : "outline"}
                    onClick={() => setActiveMealType(mealType.name)}
                    className={`flex items-center gap-2 ${
                      activeMealType === mealType.name 
                        ? `${getMealTypeColor(mealType.name)} text-white` 
                        : `border-amber-300 text-amber-700 hover:bg-amber-50`
                    }`}
                  >
                    {getMealTypeIcon(mealType.name)}
                    {mealType.name}
                  </Button>
                ))}
              </div>
              
              <p className="text-amber-500 mt-4">Office Food menu integration coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-50">
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeekendMenu;
