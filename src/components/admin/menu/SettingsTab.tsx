
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  useMainCategories, 
  useSubCategories, 
  useMealTypes,
  useUpdateCategorySettings 
} from "@/hooks/useMenuManagement";

const SettingsTab = () => {
  const { data: mainCategories } = useMainCategories();
  const { data: subCategories } = useSubCategories();
  const { data: mealTypes } = useMealTypes();
  const updateSettings = useUpdateCategorySettings();

  const handleToggle = (id: string, is_enabled: boolean, table: string) => {
    updateSettings.mutate({ id, is_enabled, table });
  };

  // Filter categories for weekend menu (exclude frozen food)
  const weekendCategories = mainCategories?.filter(cat => 
    cat.name === 'School Tiffin' || cat.name === 'Office Food'
  ) || [];

  return (
    <div className="space-y-6">
      {/* Weekend Menu Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Weekend Menu Categories</CardTitle>
          <CardDescription>Enable or disable School Tiffin and Office Food categories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {weekendCategories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <Label htmlFor={`main-${category.id}`} className="text-sm font-medium">
                {category.name}
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
          <CardDescription>
            Enable or disable meal types - School Tiffin (Breakfast only), Office Food (Breakfast & Lunch)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subCategories?.map((subCategory) => {
            const mainCategory = mainCategories?.find(mc => mc.id === subCategory.main_category_id);
            return (
              <div key={subCategory.id} className="flex items-center justify-between">
                <Label htmlFor={`sub-${subCategory.id}`} className="text-sm font-medium">
                  {mainCategory?.name} - {subCategory.name}
                </Label>
                <Switch
                  id={`sub-${subCategory.id}`}
                  checked={subCategory.is_enabled}
                  onCheckedChange={(checked) => 
                    handleToggle(subCategory.id, checked, 'sub_categories')
                  }
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Meal Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Meal Plans</CardTitle>
          <CardDescription>Enable or disable meal plans (Regular, Diet, Premium) for all categories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mealTypes?.map((mealType) => (
            <div key={mealType.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor={`meal-${mealType.id}`} className="text-sm font-medium">
                  {mealType.name}
                </Label>
                <p className="text-xs text-gray-500">{mealType.description}</p>
              </div>
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
    </div>
  );
};

export default SettingsTab;
