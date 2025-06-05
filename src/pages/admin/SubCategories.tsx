
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useMainCategories,
  useSubCategories,
  useMealTypes,
  getFoodPlans,
} from "@/hooks/useWeeklyMenu";

const SubCategories = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    description: "",
    main_category_id: "",
    food_plan: "",
  });
  
  const { toast } = useToast();
  const { data: mainCategories } = useMainCategories();
  const { data: subCategories } = useSubCategories(selectedMainCategory);
  const { data: mealTypes } = useMealTypes();

  const handleCreateSubCategory = () => {
    if (!newSubCategory.name || !newSubCategory.main_category_id) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to create the subcategory
    console.log("Creating subcategory:", newSubCategory);
    
    toast({
      title: "Success",
      description: "Subcategory created successfully",
    });

    // Reset form
    setNewSubCategory({
      name: "",
      description: "",
      main_category_id: "",
      food_plan: "",
    });
  };

  const getFoodPlanColor = (plan: string) => {
    switch (plan) {
      case 'Regular': return 'bg-blue-100 text-blue-800';
      case 'Diet': return 'bg-green-100 text-green-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFoodPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Premium': return <Crown className="h-3 w-3" />;
      default: return null;
    }
  };

  // Check if selected main category is School Tiffin
  const isSchoolTiffin = () => {
    const selectedCategory = mainCategories?.find(cat => cat.id === newSubCategory.main_category_id);
    return selectedCategory?.name.toLowerCase().includes('school') || selectedCategory?.name.toLowerCase().includes('tiffin');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sub Categories Management</h1>
        <p className="text-gray-600">
          Manage subcategories for Office Food (Breakfast/Lunch) and School Tiffin (Regular/Diet/Premium) meal types
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Subcategory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Subcategory
            </CardTitle>
            <CardDescription>
              Add new subcategories with food plans for meal planning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="main-category">Main Category *</Label>
              <Select
                value={newSubCategory.main_category_id}
                onValueChange={(value) =>
                  setNewSubCategory(prev => ({ ...prev, main_category_id: value, food_plan: "" }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select main category" />
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
              <Label htmlFor="name">Subcategory Name *</Label>
              <Input
                id="name"
                value={newSubCategory.name}
                onChange={(e) =>
                  setNewSubCategory(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Regular, Diet, Premium"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newSubCategory.description}
                onChange={(e) =>
                  setNewSubCategory(prev => ({ ...prev, description: e.target.value }))
                }
                placeholder="Brief description of this subcategory"
                rows={3}
              />
            </div>

            {isSchoolTiffin() && (
              <div>
                <Label htmlFor="food-plan">Food Plan (for School Tiffin) *</Label>
                <Select
                  value={newSubCategory.food_plan}
                  onValueChange={(value) =>
                    setNewSubCategory(prev => ({ ...prev, food_plan: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select food plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {getFoodPlans().map((plan) => (
                      <SelectItem key={plan} value={plan}>
                        <div className="flex items-center gap-2">
                          {getFoodPlanIcon(plan)}
                          {plan}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={handleCreateSubCategory} className="w-full">
              Create Subcategory
            </Button>
          </CardContent>
        </Card>

        {/* View Existing Subcategories */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Subcategories</CardTitle>
            <CardDescription>
              View and manage current subcategories with food plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="filter-category">Filter by Main Category</Label>
              <Select
                value={selectedMainCategory}
                onValueChange={setSelectedMainCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {mainCategories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {subCategories?.map((subCategory) => (
                <div
                  key={subCategory.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{subCategory.name}</h4>
                      {subCategory.food_plan && (
                        <Badge className={getFoodPlanColor(subCategory.food_plan)}>
                          <div className="flex items-center gap-1">
                            {getFoodPlanIcon(subCategory.food_plan)}
                            {subCategory.food_plan}
                          </div>
                        </Badge>
                      )}
                    </div>
                    {subCategory.description && (
                      <p className="text-sm text-gray-600">{subCategory.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {subCategories?.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No subcategories found for the selected main category
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meal Types Section */}
      <Card>
        <CardHeader>
          <CardTitle>Meal Types</CardTitle>
          <CardDescription>
            Available meal types: Breakfast and Lunch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealTypes?.map((mealType) => (
              <div
                key={mealType.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{mealType.name}</h4>
                  {mealType.description && (
                    <p className="text-sm text-gray-600">{mealType.description}</p>
                  )}
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Food Plans Information */}
      <Card>
        <CardHeader>
          <CardTitle>Food Plans Overview</CardTitle>
          <CardDescription>
            Available food plans for School Tiffin categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getFoodPlans().map((plan) => (
              <div
                key={plan}
                className={`p-4 rounded-lg border-2 ${getFoodPlanColor(plan).replace('bg-', 'border-').replace('text-', 'bg-').replace('-800', '-200').replace('-100', '-50')}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getFoodPlanIcon(plan)}
                  <h4 className="font-semibold">{plan}</h4>
                </div>
                <p className="text-sm">
                  {plan === 'Regular' && 'Standard nutritious meals for everyday school lunch'}
                  {plan === 'Diet' && 'Healthy, low-calorie options for health-conscious students'}
                  {plan === 'Premium' && 'Premium quality meals with extra variety and special ingredients'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubCategories;
