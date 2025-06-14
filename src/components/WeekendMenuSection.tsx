
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

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-800 mb-4">Weekend Order Menu</h2>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Plan your weekly meals with our School Tiffin and Office Food options
          </p>
        </div>

        {/* Category Selection */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Choose Category
              </label>
              <Select value={selectedMainCategory} onValueChange={setSelectedMainCategory}>
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
                onValueChange={setSelectedSubCategory}
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
                disabled={!selectedSubCategory}
              >
                <SelectTrigger className="border-amber-300">
                  <SelectValue placeholder="Select meal type" />
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

          {/* Order Button */}
          {selectedMainCategory && selectedSubCategory && selectedMealType && (
            <div className="text-center">
              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Link to={`/weekend-order/${selectedMainCategory}/${getCurrentWeekStart()}/${selectedMealType}/${selectedSubCategory}`}>
                  <Clock className="w-5 h-5 mr-2" />
                  Plan This Week's Menu
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
