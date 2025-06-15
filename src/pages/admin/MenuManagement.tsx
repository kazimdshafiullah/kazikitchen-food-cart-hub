
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FrozenFoodTab from "@/components/admin/menu/FrozenFoodTab";
import WeekendMenuTab from "@/components/admin/menu/WeekendMenuTab";
import SettingsTab from "@/components/admin/menu/SettingsTab";
import ViewMenuTab from "@/components/admin/menu/ViewMenuTab";

const MenuManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
        <p className="text-gray-600">
          Manage your food categories: Frozen Food and Weekend Menu (Office Food & School Tiffin)
        </p>
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>System Overview:</strong> This system supports two main categories - Frozen Food (no subcategories) 
            and Weekend Menu (Office Food with breakfast/lunch, School Tiffin with breakfast only). 
            All weekend menu items support Regular, Diet, and Premium meal plans.
          </p>
        </div>
      </div>

      <Tabs defaultValue="frozen-food" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="frozen-food">Frozen Food</TabsTrigger>
          <TabsTrigger value="weekend-menu">Weekend Menu</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="view-menu">View Menu</TabsTrigger>
        </TabsList>

        <TabsContent value="frozen-food">
          <FrozenFoodTab />
        </TabsContent>

        <TabsContent value="weekend-menu">
          <WeekendMenuTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>

        <TabsContent value="view-menu">
          <ViewMenuTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuManagement;
