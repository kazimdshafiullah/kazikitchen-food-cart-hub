
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Trash2, ImageIcon } from "lucide-react";
import { useMenuItems, useMainCategories, useSubCategories } from "@/hooks/useMenuManagement";
import { format } from "date-fns";

const ViewMenuTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");

  const { data: menuItems } = useMenuItems();
  const { data: mainCategories } = useMainCategories();
  const { data: subCategories } = useSubCategories();

  // Filter menu items based on search and selections
  const filteredItems = menuItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMainCategory = selectedMainCategory === "all" || 
                               item.main_category_id === selectedMainCategory;
    
    const matchesSubCategory = selectedSubCategory === "all" || 
                              item.sub_category_id === selectedSubCategory;

    return matchesSearch && matchesMainCategory && matchesSubCategory;
  }) || [];

  const getCategoryName = (categoryName: string) => {
    switch (categoryName) {
      case 'frozen_food': return 'Frozen Food';
      case 'weekend_menu': return 'Weekend Menu';
      case 'office_food': return 'Office Food';
      case 'school_tiffin': return 'School Tiffin';
      default: return categoryName;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>View and manage all menu items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select value={selectedMainCategory} onValueChange={setSelectedMainCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mainCategories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {getCategoryName(category.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Sub Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sub Categories</SelectItem>
                {subCategories?.map((subCategory) => (
                  <SelectItem key={subCategory.id} value={subCategory.id}>
                    {getCategoryName(subCategory.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Items Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {getCategoryName(item.main_categories.name)}
                        </div>
                        {item.sub_categories && (
                          <div className="text-xs text-gray-500">
                            {getCategoryName(item.sub_categories.name)}
                          </div>
                        )}
                        {item.meal_types && (
                          <div className="text-xs text-gray-500">
                            {item.meal_types.name.charAt(0).toUpperCase() + item.meal_types.name.slice(1)}
                          </div>
                        )}
                        {item.meal_plans && (
                          <Badge variant="outline" className="text-xs">
                            {item.meal_plans.name.charAt(0).toUpperCase() + item.meal_plans.name.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>৳{item.price}</TableCell>
                    <TableCell>
                      {item.specific_date ? format(new Date(item.specific_date), "MMM dd, yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.stock_limit > 10 ? "secondary" : "destructive"}>
                        {item.stock_limit}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.is_active ? "default" : "secondary"}>
                        {item.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No menu items found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewMenuTab;
