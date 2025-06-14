
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Users, Utensils, Crown, Heart, Zap } from "lucide-react";
import { 
  useMainCategories, 
  useSubCategories, 
  useMealTypes,
  getCurrentWeekStart,
  getNextWeekStart,
  getDayName,
  isOrderingAllowed 
} from "@/hooks/useWeeklyMenu";

const WeekendMenuSection = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<string>("");

  const { data: mainCategories } = useMainCategories();
  const { data: subCategories } = useSubCategories(selectedMainCategory);
  const { data: mealTypes } = useMealTypes();

  // Scroll to top when selections change
  useEffect(() => {
    if (selectedMainCategory) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedMainCategory, selectedSubCategory, selectedMealType]);

  const getFoodPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Regular': return <Utensils className="h-4 w-4" />;
      case 'Diet': return <Heart className="h-4 w-4" />;
      case 'Premium': return <Crown className="h-4 w-4" />;
      default: return null;
    }
  };

  const getFoodPlanColor = (plan: string) => {
    switch (plan) {
      case 'Regular': return 'bg-blue-100 text-blue-800';
      case 'Diet': return 'bg-green-100 text-green-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFoodPlanDescription = (plan: string) => {
    switch (plan) {
      case 'Regular': return 'Balanced and nutritious meals for everyday needs';
      case 'Diet': return 'Health-conscious options with calorie control';
      case 'Premium': return 'Gourmet meals with premium ingredients';
      default: return '';
    }
  };

  // Check if selected category is School Tiffin (doesn't need meal type selection)
  const isSchoolTiffin = selectedMainCategory && mainCategories ? 
    Boolean(mainCategories.find(cat => 
      cat.id === selectedMainCategory && (cat.name.toLowerCase().includes('school') || cat.name.toLowerCase().includes('tiffin'))
    )) : false;

  // Get available ordering dates (Sunday to Thursday, excluding weekends)
  const getAvailableOrderingDates = () => {
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
    const currentHour = today.getHours();
    
    // For School Tiffin: Order by 10 PM the day before
    // For Office Food: Order by 9:30 AM same day
    
    for (let i = 0; i < 14; i++) { // Check next 14 days
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dayOfWeek = checkDate.getDay();
      
      // Only include Sunday (0) to Thursday (4), skip Friday (5) and Saturday (6)
      if (dayOfWeek >= 0 && dayOfWeek <= 4) {
        let canOrder = false;
        
        if (isSchoolTiffin) {
          // School Tiffin: Can order until 10 PM the day before
          if (i === 1 && currentHour < 22) canOrder = true; // Tomorrow if before 10 PM
          if (i > 1) canOrder = true; // Future days
        } else {
          // Office Food: Can order until 9:30 AM same day
          if (i === 0 && currentHour < 9) canOrder = true; // Today if before 9:30 AM
          if (i === 0 && currentHour === 9 && today.getMinutes() < 30) canOrder = true; // Today if before 9:30 AM
          if (i > 0) canOrder = true; // Future days
        }
        
        dates.push({
          date: checkDate,
          dateString: checkDate.toISOString().split('T')[0],
          dayName: getDayName(dayOfWeek),
          canOrder,
          isToday: i === 0,
          isTomorrow: i === 1
        });
      }
    }
    
    return dates;
  };

  const availableDates = getAvailableOrderingDates();

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-800 mb-4">Weekend Order Menu</h2>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Plan your weekly meals with our School Tiffin and Office Food options
          </p>
          <div className="mt-4 p-4 bg-amber-100 rounded-lg">
            <p className="text-amber-800 font-medium">
              <Clock className="inline w-4 h-4 mr-2" />
              School Tiffin: Order by 10:00 PM the day before | Office Food: Order by 9:30 AM same day
            </p>
            <p className="text-amber-700 text-sm mt-2">
              Available days: Sunday to Thursday (Weekend excluded)
            </p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Choose Category
              </label>
              <Select value={selectedMainCategory} onValueChange={(value) => {
                setSelectedMainCategory(value);
                setSelectedSubCategory("");
                setSelectedMealType("");
              }}>
                <SelectTrigger className="border-amber-300">
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

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Food Plan
              </label>
              <Select 
                value={selectedSubCategory} 
                onValueChange={(value) => {
                  setSelectedSubCategory(value);
                  if (isSchoolTiffin) {
                    setSelectedMealType(""); // Clear meal type for school tiffin
                  }
                }}
                disabled={!selectedMainCategory}
              >
                <SelectTrigger className="border-amber-300">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories?.map((subCategory) => (
                    <SelectItem key={subCategory.id} value={subCategory.id}>
                      <div className="flex items-center gap-2">
                        {subCategory.food_plan && getFoodPlanIcon(subCategory.food_plan)}
                        {subCategory.name}
                        {subCategory.food_plan && (
                          <Badge className={`ml-2 ${getFoodPlanColor(subCategory.food_plan)}`}>
                            {subCategory.food_plan}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Meal Type
              </label>
              <Select 
                value={selectedMealType} 
                onValueChange={setSelectedMealType}
                disabled={!selectedSubCategory || isSchoolTiffin}
              >
                <SelectTrigger className="border-amber-300">
                  <SelectValue placeholder={isSchoolTiffin ? "Not required" : "Select meal type"} />
                </SelectTrigger>
                <SelectContent>
                  {mealTypes?.map((mealType) => (
                    <SelectItem key={mealType.id} value={mealType.id}>
                      {mealType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Food Plan Information */}
          {selectedSubCategory && subCategories && (
            <div className="mb-8">
              {subCategories
                .filter(sub => sub.id === selectedSubCategory)
                .map((subCategory) => (
                  <Card key={subCategory.id} className="border-2 border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {subCategory.food_plan && getFoodPlanIcon(subCategory.food_plan)}
                        {subCategory.name}
                        {subCategory.food_plan && (
                          <Badge className={getFoodPlanColor(subCategory.food_plan)}>
                            {subCategory.food_plan}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {subCategory.description || (subCategory.food_plan && getFoodPlanDescription(subCategory.food_plan))}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          )}

          {/* Available Dates Display */}
          {selectedMainCategory && selectedSubCategory && (isSchoolTiffin || selectedMealType) && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">Available Ordering Dates</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {availableDates.map((dateInfo) => (
                  <Card 
                    key={dateInfo.dateString} 
                    className={`text-center transition-all ${
                      dateInfo.canOrder 
                        ? 'border-green-300 bg-green-50 hover:border-green-500' 
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="font-medium text-sm text-amber-800">
                        {dateInfo.dayName}
                      </div>
                      <div className="text-xs text-amber-600 mb-2">
                        {dateInfo.date.toLocaleDateString('en-BD')}
                      </div>
                      <Badge 
                        className={`text-xs ${
                          dateInfo.canOrder 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {dateInfo.canOrder ? 'Available' : 'Order Closed'}
                      </Badge>
                      {dateInfo.isToday && (
                        <div className="text-xs text-blue-600 font-medium mt-1">Today</div>
                      )}
                      {dateInfo.isTomorrow && (
                        <div className="text-xs text-purple-600 font-medium mt-1">Tomorrow</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Order Button */}
          {selectedMainCategory && selectedSubCategory && (isSchoolTiffin || selectedMealType) && (
            <div className="text-center">
              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Link to={`/weekend-order/${selectedMainCategory}/${getCurrentWeekStart()}/${selectedMealType || 'default'}/${selectedSubCategory}`}>
                  <Clock className="w-5 h-5 mr-2" />
                  Proceed to Date Selection
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2 border-amber-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-amber-800">Regular Plan</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-amber-600">Balanced nutrition for everyday meals with fresh ingredients</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-amber-800">Diet Plan</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-amber-600">Health-conscious options with controlled calories and nutrients</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-amber-800">Premium Plan</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-amber-600">Gourmet meals with premium ingredients and extra variety</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WeekendMenuSection;
