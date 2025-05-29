
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, AlertCircle, ShoppingCart } from "lucide-react";
import {
  useMainCategories,
  useSubCategories,
  useMealTypes,
  useWeeklyMenu,
  getCurrentWeekStart,
  isOrderingAllowed,
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
  const [showOrderForm, setShowOrderForm] = useState(false);

  const { data: mainCategories, isLoading: mainCategoriesLoading } = useMainCategories();
  const { data: subCategories } = useSubCategories(selectedMainCategory?.id);
  const { data: mealTypes } = useMealTypes();
  const { data: weeklyMenu } = useWeeklyMenu(
    selectedMainCategory?.id,
    selectedSubCategory?.id,
    selectedMealType?.id,
    getCurrentWeekStart()
  );

  const canOrder = selectedMainCategory ? isOrderingAllowed(selectedMainCategory) : false;

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

  if (mainCategoriesLoading) {
    return (
      <section className="py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
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
    <section className="py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Weekly Tiffin Service
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Order your weekly meals in advance. Fresh, homemade food delivered daily for 5 days (Sunday to Thursday).
          </p>
        </div>

        {/* Main Category Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {mainCategories?.map((category) => {
            const orderingAllowed = isOrderingAllowed(category);
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedMainCategory?.id === category.id 
                    ? 'ring-2 ring-kazi-orange shadow-lg' 
                    : ''
                } ${!orderingAllowed ? 'opacity-60' : ''}`}
                onClick={() => orderingAllowed && handleCategorySelect(category)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    {!orderingAllowed && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Order Closed
                      </Badge>
                    )}
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
                  {!orderingAllowed && (
                    <div className="mt-3 p-2 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>
                          Ordering time has passed. Order by {category.order_cutoff_time.slice(0, 5)} 
                          {category.advance_days === 1 ? ' (day before)' : ' (same day)'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedMainCategory && canOrder && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Your Plan - {selectedMainCategory.name}</CardTitle>
              <CardDescription>
                Choose your meal type and subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="meal-type" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="meal-type">Meal Type</TabsTrigger>
                  <TabsTrigger value="plan-type">Plan Type</TabsTrigger>
                </TabsList>
                
                <TabsContent value="meal-type" className="mt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {mealTypes?.map((mealType) => (
                      <Card 
                        key={mealType.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedMealType?.id === mealType.id 
                            ? 'ring-2 ring-kazi-green shadow-md' 
                            : ''
                        }`}
                        onClick={() => setSelectedMealType(mealType)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{mealType.name}</CardTitle>
                          <CardDescription>{mealType.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="plan-type" className="mt-6">
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
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Weekly Menu Display */}
        {selectedMainCategory && selectedSubCategory && selectedMealType && weeklyMenu && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                This Week's Menu - {selectedMealType.name} ({selectedSubCategory.name})
              </CardTitle>
              <CardDescription>
                Week starting {getCurrentWeekStart()}
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
                            {getDayName(item.day_of_week)}
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
            weekStartDate={getCurrentWeekStart()}
          />
        )}
      </div>
    </section>
  );
};

export default WeeklyMenuSection;
