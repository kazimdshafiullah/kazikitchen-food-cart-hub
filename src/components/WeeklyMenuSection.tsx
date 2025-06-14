
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, AlertCircle, ShoppingCart, Crown, Heart, Utensils } from "lucide-react";
import {
  useMainCategories,
  useSubCategories,
  useMealTypes,
  useWeeklyMenuByDateRange,
  getDayName,
  MainCategory,
  SubCategory,
  MealType,
  WeeklyMenuItem
} from "@/hooks/useWeeklyMenu";
import WeeklyOrderForm from "./WeeklyOrderForm";

const WeeklyMenuSection = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const { data: mainCategories, isLoading: mainCategoriesLoading } = useMainCategories();
  const { data: subCategories } = useSubCategories(selectedMainCategory?.id);
  const { data: mealTypes } = useMealTypes();
  
  // Calculate date range for the selected week (next 7 days from selected date)
  const startDate = selectedWeek;
  const endDate = new Date(selectedWeek);
  endDate.setDate(endDate.getDate() + 6);
  const endDateString = endDate.toISOString().split('T')[0];

  const { data: weeklyMenu } = useWeeklyMenuByDateRange(
    selectedMainCategory?.id,
    selectedSubCategory?.id,
    selectedMealType?.id,
    startDate,
    endDateString
  );

  const handleCategorySelect = (category: MainCategory) => {
    setSelectedMainCategory(category);
    setSelectedSubCategory(null);
    setSelectedMealType(null);
  };

  const handleOrderClick = () => {
    if (selectedMainCategory && selectedSubCategory && selectedMealType && weeklyMenu) {
      setShowOrderForm(true);
    }
  };

  const getAvailableWeeks = () => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 0; i < 4; i++) { // Show next 4 weeks
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + (i * 7));
      const weekStartString = weekStart.toISOString().split('T')[0];
      
      weeks.push({ 
        value: weekStartString, 
        label: `Week ${i + 1} (${weekStartString})` 
      });
    }
    
    return weeks;
  };

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
      case 'Regular': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Diet': return 'bg-green-100 text-green-800 border-green-200';
      case 'Premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMealTypeDescription = (mealType: string) => {
    switch (mealType) {
      case 'Regular': return 'Balanced and nutritious meals for everyday needs';
      case 'Diet': return 'Health-conscious options with calorie control';
      case 'Premium': return 'Gourmet meals with premium ingredients and extra variety';
      default: return '';
    }
  };

  if (mainCategoriesLoading) {
    return (
      <section id="weekend-order-menu" className="py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="weekend-order-menu" className="py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Weekend Order Menu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Order your weekly meals in advance. Fresh, homemade food delivered daily for 5 days (Sunday to Thursday).
          </p>
        </div>

        {/* Main Category Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {mainCategories?.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedMainCategory?.id === category.id 
                  ? 'ring-2 ring-kazi-orange shadow-lg' 
                  : ''
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <Badge variant="default">Available</Badge>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Order by {category.order_cutoff_time.slice(0, 5)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {category.advance_days === 1 ? 'Next day delivery' : 'Same day delivery'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedMainCategory && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Your Plan - {selectedMainCategory.name}</CardTitle>
              <CardDescription>
                Choose your subcategory, meal type, and week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Week Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Week</label>
                <div className="flex flex-wrap gap-2">
                  {getAvailableWeeks().map((week) => (
                    <Button
                      key={week.value}
                      variant={selectedWeek === week.value ? "default" : "outline"}
                      onClick={() => setSelectedWeek(week.value)}
                      className="text-sm"
                    >
                      {week.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Tabs defaultValue="sub-category" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sub-category">Sub Category</TabsTrigger>
                  <TabsTrigger value="meal-type">Meal Type</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sub-category" className="mt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {subCategories?.map((subCategory) => (
                      <Card 
                        key={subCategory.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedSubCategory?.id === subCategory.id 
                            ? 'ring-2 ring-kazi-green shadow-md' 
                            : ''
                        }`}
                        onClick={() => setSelectedSubCategory(subCategory)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{subCategory.name}</CardTitle>
                          <CardDescription>{subCategory.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="meal-type" className="mt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {mealTypes?.map((mealType) => (
                      <Card 
                        key={mealType.id}
                        className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                          selectedMealType?.id === mealType.id 
                            ? 'ring-2 ring-kazi-green shadow-md' 
                            : ''
                        } ${getMealTypeColor(mealType.name)}`}
                        onClick={() => setSelectedMealType(mealType)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              {getMealTypeIcon(mealType.name)}
                              {mealType.name}
                            </CardTitle>
                            <Badge variant="outline" className={getMealTypeColor(mealType.name)}>
                              {mealType.name}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm">
                            {mealType.description || getMealTypeDescription(mealType.name)}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Weekly Menu Display */}
        {selectedMainCategory && selectedSubCategory && selectedMealType && weeklyMenu && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                Menu - {selectedSubCategory.name} ({selectedMealType.name})
              </CardTitle>
              <CardDescription>
                Week starting {selectedWeek}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyMenu.length > 0 ? (
                <div className="grid md:grid-cols-5 gap-4 mb-6">
                  {weeklyMenu.map((item) => (
                    <Card key={item.id} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">
                            {new Date(item.specific_date).toLocaleDateString('en-BD', { weekday: 'long' })}
                          </CardTitle>
                          <Badge variant={item.current_stock > 0 ? "default" : "destructive"}>
                            {item.current_stock}/{item.stock_limit}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <h4 className="font-semibold text-base mb-2">{item.item_name}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-kazi-red">৳{Number(item.price).toFixed(2)}</span>
                          {item.current_stock === 0 && (
                            <Badge variant="destructive">Sold Out</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No menu items available for this week.</p>
                </div>
              )}

              {weeklyMenu.length > 0 && (
                <div className="flex justify-center">
                  <Button 
                    size="lg"
                    onClick={handleOrderClick}
                    className="bg-kazi-green hover:bg-kazi-light-green"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Order This Week's Menu
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Order Form Modal */}
        {showOrderForm && selectedMainCategory && selectedSubCategory && selectedMealType && weeklyMenu && (
          <WeeklyOrderForm
            isOpen={showOrderForm}
            onClose={() => setShowOrderForm(false)}
            mainCategory={selectedMainCategory}
            subCategory={selectedSubCategory}
            mealType={selectedMealType}
            weeklyMenu={weeklyMenu}
            weekStartDate={selectedWeek}
          />
        )}
      </div>
    </section>
  );
};

export default WeeklyMenuSection;
