import { useState } from "react";
import { products, Product } from "@/data/products";
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
import { Edit, Trash2, Search, Plus, Filter, FolderPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Clone products for local management
const initialProducts = [...products];

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

const Products = () => {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    id: "",
    name: "",
    price: 0,
    image: "/placeholder.svg",
    category: "",
    description: "",
  });

  // Category management states
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    description: "",
    image_url: "",
  });

  const queryClient = useQueryClient();

  // Fetch categories from Supabase
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Category[];
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string; image_url?: string }) => {
      const { error } = await supabase
        .from("categories")
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
      setIsCategoryDialogOpen(false);
      setNewCategory({ name: "", description: "", image_url: "" });
    },
    onError: (error) => {
      toast.error("Failed to create category: " + error.message);
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; description?: string; image_url?: string }) => {
      const { error } = await supabase
        .from("categories")
        .update({
          name: data.name,
          description: data.description,
          image_url: data.image_url,
        })
        .eq("id", data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
      setIsEditCategoryDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (error) => {
      toast.error("Failed to update category: " + error.message);
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
      setIsDeleteCategoryDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (error) => {
      toast.error("Failed to delete category: " + error.message);
    },
  });

  // Filter products based on search term and category
  const filteredProducts = productList.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" ? true : product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const productId = `${productList.length + 1}`;
    
    const productToAdd = {
      ...newProduct,
      id: productId,
    } as Product;
    
    setProductList([...productList, productToAdd]);
    toast.success("Product added successfully");
    setIsAddDialogOpen(false);
    setNewProduct({
      id: "",
      name: "",
      price: 0,
      image: "/placeholder.svg",
      category: "",
      description: "",
    });
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;
    
    const updatedProductList = productList.map(product => 
      product.id === selectedProduct.id ? selectedProduct : product
    );
    
    setProductList(updatedProductList);
    toast.success("Product updated successfully");
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    
    const updatedProductList = productList.filter(product => 
      product.id !== selectedProduct.id
    );
    
    setProductList(updatedProductList);
    toast.success("Product deleted successfully");
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct({...product});
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Category management functions
  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast.error("Please enter a category name");
      return;
    }
    
    createCategoryMutation.mutate({
      name: newCategory.name,
      description: newCategory.description || "",
      image_url: newCategory.image_url || "",
    });
  };

  const handleEditCategory = () => {
    if (!selectedCategory) return;
    
    updateCategoryMutation.mutate({
      id: selectedCategory.id,
      name: selectedCategory.name,
      description: selectedCategory.description || "",
      image_url: selectedCategory.image_url || "",
    });
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    deleteCategoryMutation.mutate(selectedCategory.id);
  };

  const openEditCategoryDialog = (category: Category) => {
    setSelectedCategory({...category});
    setIsEditCategoryDialogOpen(true);
  };

  const openDeleteCategoryDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteCategoryDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Products & Categories</h2>
        <p className="text-muted-foreground">Manage your product catalog and categories</p>
      </div>
      
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full sm:w-auto"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Products Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price (BDT)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        {categories?.find(cat => cat.id === product.category)?.name || product.category}
                      </TableCell>
                      <TableCell>৳{(product.price * 25).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit product</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => openDeleteDialog(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete product</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No products found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Manage Categories</h3>
              <Button onClick={() => setIsCategoryDialogOpen(true)}>
                <FolderPlus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories?.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{category.description || "No description"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditCategoryDialog(category)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit category</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => openDeleteCategoryDialog(category)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete category</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!categories || categories.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6">
                          No categories found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your catalog
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Product Name</label>
              <Input 
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select 
                value={newProduct.category} 
                onValueChange={(value) => setNewProduct({...newProduct, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Price (BDT)</label>
              <Input 
                type="number"
                min="0"
                step="0.01"
                value={newProduct.price?.toString()}
                onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                placeholder="/placeholder.svg"
              />
            </div>
            
            <div className="flex space-x-2">
              <div className="flex items-center space-x-1">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={newProduct.featured || false}
                  onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                />
                <label htmlFor="featured" className="text-sm">Featured</label>
              </div>
              
              <div className="flex items-center space-x-1">
                <input 
                  type="checkbox" 
                  id="popular"
                  checked={newProduct.popular || false}
                  onChange={(e) => setNewProduct({...newProduct, popular: e.target.checked})}
                />
                <label htmlFor="popular" className="text-sm">Popular</label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Product Name</label>
                <Input 
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={selectedProduct.category} 
                  onValueChange={(value) => setSelectedProduct({...selectedProduct, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Price (BDT)</label>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={(selectedProduct.price * 25).toString()}
                  onChange={(e) => setSelectedProduct({...selectedProduct, price: (parseFloat(e.target.value) || selectedProduct.price * 25) / 25})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={selectedProduct.description}
                  onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={selectedProduct.image}
                  onChange={(e) => setSelectedProduct({...selectedProduct, image: e.target.value})}
                />
              </div>
              
              <div className="flex space-x-2">
                <div className="flex items-center space-x-1">
                  <input 
                    type="checkbox" 
                    id="edit-featured"
                    checked={selectedProduct.featured || false}
                    onChange={(e) => setSelectedProduct({...selectedProduct, featured: e.target.checked})}
                  />
                  <label htmlFor="edit-featured" className="text-sm">Featured</label>
                </div>
                
                <div className="flex items-center space-x-1">
                  <input 
                    type="checkbox" 
                    id="edit-popular"
                    checked={selectedProduct.popular || false}
                    onChange={(e) => setSelectedProduct({...selectedProduct, popular: e.target.checked})}
                  />
                  <label htmlFor="edit-popular" className="text-sm">Popular</label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="py-4">
              <p className="font-medium">{selectedProduct.name}</p>
              <p className="text-sm text-muted-foreground">ID: {selectedProduct.id}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new product category
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Category Name</label>
              <Input 
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Image URL</label>
              <Input 
                value={newCategory.image_url}
                onChange={(e) => setNewCategory({...newCategory, image_url: e.target.value})}
                placeholder="/placeholder.svg"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={createCategoryMutation.isPending}>
              {createCategoryMutation.isPending ? "Adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category information
            </DialogDescription>
          </DialogHeader>
          
          {selectedCategory && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Category Name</label>
                <Input 
                  value={selectedCategory.name}
                  onChange={(e) => setSelectedCategory({...selectedCategory, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={selectedCategory.description || ""}
                  onChange={(e) => setSelectedCategory({...selectedCategory, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input 
                  value={selectedCategory.image_url || ""}
                  onChange={(e) => setSelectedCategory({...selectedCategory, image_url: e.target.value})}
                  placeholder="/placeholder.svg"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={updateCategoryMutation.isPending}>
              {updateCategoryMutation.isPending ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Dialog */}
      <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCategory && (
            <div className="py-4">
              <p className="font-medium">{selectedCategory.name}</p>
              <p className="text-sm text-muted-foreground">ID: {selectedCategory.id}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={deleteCategoryMutation.isPending}>
              {deleteCategoryMutation.isPending ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
