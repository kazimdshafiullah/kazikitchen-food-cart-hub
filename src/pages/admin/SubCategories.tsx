
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { Edit, Trash2, Search, Plus, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useMainCategories, useSubCategories } from "@/hooks/useWeeklyMenu";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface SubCategory {
  id: string;
  name: string;
  description: string | null;
  main_category_id: string;
  created_at: string;
}

const SubCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mainCategoryFilter, setMainCategoryFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [newSubCategory, setNewSubCategory] = useState<Partial<SubCategory>>({
    name: "",
    description: "",
    main_category_id: "",
  });

  const queryClient = useQueryClient();
  const { data: mainCategories } = useMainCategories();
  const { data: subCategories } = useSubCategories();

  // Create sub-category mutation
  const createSubCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string; main_category_id: string }) => {
      const { error } = await supabase
        .from("sub_categories")
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subCategories"] });
      toast.success("Sub-category created successfully");
      setIsAddDialogOpen(false);
      setNewSubCategory({ name: "", description: "", main_category_id: "" });
    },
    onError: (error) => {
      toast.error("Failed to create sub-category: " + error.message);
    },
  });

  // Update sub-category mutation
  const updateSubCategoryMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; description?: string; main_category_id: string }) => {
      const { error } = await supabase
        .from("sub_categories")
        .update({
          name: data.name,
          description: data.description,
          main_category_id: data.main_category_id,
        })
        .eq("id", data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subCategories"] });
      toast.success("Sub-category updated successfully");
      setIsEditDialogOpen(false);
      setSelectedSubCategory(null);
    },
    onError: (error) => {
      toast.error("Failed to update sub-category: " + error.message);
    },
  });

  // Delete sub-category mutation
  const deleteSubCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("sub_categories")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subCategories"] });
      toast.success("Sub-category deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedSubCategory(null);
    },
    onError: (error) => {
      toast.error("Failed to delete sub-category: " + error.message);
    },
  });

  // Filter sub-categories
  const filteredSubCategories = subCategories?.filter(subCategory => {
    const matchesSearch = 
      subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subCategory.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = mainCategoryFilter === "all" ? true : subCategory.main_category_id === mainCategoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddSubCategory = () => {
    if (!newSubCategory.name || !newSubCategory.main_category_id) {
      toast.error("Please fill all required fields");
      return;
    }
    
    createSubCategoryMutation.mutate({
      name: newSubCategory.name,
      description: newSubCategory.description || "",
      main_category_id: newSubCategory.main_category_id,
    });
  };

  const handleEditSubCategory = () => {
    if (!selectedSubCategory) return;
    
    updateSubCategoryMutation.mutate({
      id: selectedSubCategory.id,
      name: selectedSubCategory.name,
      description: selectedSubCategory.description || "",
      main_category_id: selectedSubCategory.main_category_id,
    });
  };

  const handleDeleteSubCategory = () => {
    if (!selectedSubCategory) return;
    deleteSubCategoryMutation.mutate(selectedSubCategory.id);
  };

  const openEditDialog = (subCategory: SubCategory) => {
    setSelectedSubCategory({...subCategory});
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sub Categories</h2>
        <p className="text-muted-foreground">Manage sub-categories for your main categories</p>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sub-categories..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button 
            className="w-full sm:w-auto"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Sub Category
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={mainCategoryFilter} onValueChange={setMainCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by main category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Main Categories</SelectItem>
              {mainCategories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Sub Categories Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Main Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubCategories?.map((subCategory) => (
                <TableRow key={subCategory.id}>
                  <TableCell className="font-medium">{subCategory.name}</TableCell>
                  <TableCell>
                    {mainCategories?.find(cat => cat.id === subCategory.main_category_id)?.name || "Unknown"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{subCategory.description || "No description"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(subCategory)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit sub-category</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => openDeleteDialog(subCategory)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete sub-category</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!filteredSubCategories || filteredSubCategories.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No sub-categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Sub Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Sub Category</DialogTitle>
            <DialogDescription>
              Add a new sub-category to your main categories
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Sub Category Name</label>
              <Input 
                value={newSubCategory.name}
                onChange={(e) => setNewSubCategory({...newSubCategory, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Main Category</label>
              <Select 
                value={newSubCategory.main_category_id} 
                onValueChange={(value) => setNewSubCategory({...newSubCategory, main_category_id: value})}
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
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={newSubCategory.description}
                onChange={(e) => setNewSubCategory({...newSubCategory, description: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubCategory} disabled={createSubCategoryMutation.isPending}>
              {createSubCategoryMutation.isPending ? "Adding..." : "Add Sub Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Sub Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Sub Category</DialogTitle>
            <DialogDescription>
              Update sub-category information
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubCategory && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Sub Category Name</label>
                <Input 
                  value={selectedSubCategory.name}
                  onChange={(e) => setSelectedSubCategory({...selectedSubCategory, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Main Category</label>
                <Select 
                  value={selectedSubCategory.main_category_id} 
                  onValueChange={(value) => setSelectedSubCategory({...selectedSubCategory, main_category_id: value})}
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
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={selectedSubCategory.description || ""}
                  onChange={(e) => setSelectedSubCategory({...selectedSubCategory, description: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubCategory} disabled={updateSubCategoryMutation.isPending}>
              {updateSubCategoryMutation.isPending ? "Updating..." : "Update Sub Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Sub Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sub-category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubCategory && (
            <div className="py-4">
              <p className="font-medium">{selectedSubCategory.name}</p>
              <p className="text-sm text-muted-foreground">ID: {selectedSubCategory.id}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubCategory} disabled={deleteSubCategoryMutation.isPending}>
              {deleteSubCategoryMutation.isPending ? "Deleting..." : "Delete Sub Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubCategories;
