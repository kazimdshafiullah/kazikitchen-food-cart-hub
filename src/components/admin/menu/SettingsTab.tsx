
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  useMainCategories, 
  useSubCategories, 
  useMealTypes, 
  useMealPlans,
  useUpdateCategorySettings 
} from "@/hooks/useMenuManagement";

const SettingsTab = () => {
  const { data: mainCategories } = useMainCategories();
  const { data: subCategories } = useSubCategories();
  const { data: mealTypes } = useMealTypes();
  const { data: mealPlans } = useMealPlans();
  const updateSettings = useUpdateCategorySettings();

  const handleToggle = (id: string, is_enabled: boolean, table: string) => {
    updateSettings.mutate({ id, is_enabled, table });
  };

  return (
    <div className="space-y-6">
      {/* Main Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Main Categories</CardTitle>
          <CardDescription>Enable or disable main food categories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mainCategories?.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <Label htmlFor={`main-${category.id}`} className="text-sm font-medium">
                {category.name === 'frozen_food' ? 'Frozen Food' : 'Weekend Menu'}
              </Label>
              <Switch
                id={`main-${category.id}`}
                checked={category.is_enabled}
                onCheckedChange={(checked) => 
                  handleToggle(category.id, checked, 'main_categories')
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sub Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Sub Categories</CardTitle>
          <CardDescription>Enable or disable sub categories for weekend menu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subCategories?.map((subCategory) => (
            <div key={subCategory.id} className="flex items-center justify-between">
              <Label htmlFor={`sub-${subCategory.id}`} className="text-sm font-medium">
                {subCategory.name === 'office_food' ? 'Office Food' : 'School Tiffin'}
              </Label>
              <Switch
                id={`sub-${subCategory.id}`}
                checked={subCategory.is_enabled}
                onCheckedChange={(checked) => 
                  handleToggle(subCategory.id, checked, 'sub_categories')
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Meal Types */}
      <Card>
        <CardHeader>
          <CardTitle>Meal Types</CardTitle>
          <CardDescription>Enable or disable meal types (breakfast/lunch)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mealTypes?.map((mealType) => (
            <div key={mealType.id} className="flex items-center justify-between">
              <Label htmlFor={`meal-${mealType.id}`} className="text-sm font-medium">
                {mealType.name.charAt(0).toUpperCase() + mealType.name.slice(1)}
              </Label>
              <Switch
                id={`meal-${mealType.id}`}
                checked={mealType.is_enabled}
                onCheckedChange={(checked) => 
                  handleToggle(mealType.id, checked, 'meal_types')
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Meal Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Meal Plans</CardTitle>
          <CardDescription>Enable or disable meal plans (Regular/Diet/Premium)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mealPlans?.map((mealPlan) => (
            <div key={mealPlan.id} className="flex items-center justify-between">
              <Label htmlFor={`plan-${mealPlan.id}`} className="text-sm font-medium">
                {mealPlan.name.charAt(0).toUpperCase() + mealPlan.name.slice(1)}
              </Label>
              <Switch
                id={`plan-${mealPlan.id}`}
                checked={mealPlan.is_enabled}
                onCheckedChange={(checked) => 
                  handleToggle(mealPlan.id, checked, 'meal_plans')
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
