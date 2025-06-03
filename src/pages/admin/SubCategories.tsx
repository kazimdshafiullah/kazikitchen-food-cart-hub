
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useMainCategories,
  useSubCategories,
  useMealTypes,
} from "@/hooks/useWeeklyMenu";

const SubCategories = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    description: "",
    main_category_id: "",
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
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sub Categories Management</h1>
        <p className="text-gray-600">
          Manage subcategories for Office Food (Breakfast/Lunch) and meal types
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
              Add new subcategories for meal planning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="main-category">Main Category *</Label>
              <Select
                value={newSubCategory.main_category_id}
                onValueChange={(value) =>
                  setNewSubCategory(prev => ({ ...prev, main_category_id: value }))
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
              View and manage current subcategories
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
                    <h4 className="font-medium">{subCategory.name}</h4>
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
    </div>
  );
};

export default SubCategories;
