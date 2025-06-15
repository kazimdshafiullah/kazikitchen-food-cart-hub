import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Plus, X, Trash2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useComboOffers, useCreateComboOffer, useDeleteComboOffer } from "@/hooks/useComboOffers";

const ComboOffersTab = () => {
  const [newCombo, setNewCombo] = useState({
    name: "",
    description: "",
    original_price: "",
    combo_price: "",
    stock_limit: "100",
    image_url: "",
  });

  const [selectedItems, setSelectedItems] = useState<{ product_id: string; quantity: number; name: string; price: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("1");

  const { data: products = [] } = useProducts();
  const { data: comboOffers = [] } = useComboOffers();
  const createComboOffer = useCreateComboOffer();
  const deleteComboOffer = useDeleteComboOffer();

  const frozenProducts = products.filter(product => product.is_frozen_food);

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const product = frozenProducts.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingItem = selectedItems.find(item => item.product_id === selectedProduct);
    if (existingItem) {
      setSelectedItems(prev => 
        prev.map(item => 
          item.product_id === selectedProduct 
            ? { ...item, quantity: item.quantity + parseInt(selectedQuantity) }
            : item
        )
      );
    } else {
      setSelectedItems(prev => [...prev, {
        product_id: selectedProduct,
        quantity: parseInt(selectedQuantity),
        name: product.name,
        price: Number(product.price)
      }]);
    }

    setSelectedProduct("");
    setSelectedQuantity("1");
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedItems(prev => prev.filter(item => item.product_id !== productId));
  };

  const handleCreateCombo = () => {
    if (!newCombo.name || !newCombo.original_price || !newCombo.combo_price || selectedItems.length === 0) {
      return;
    }

    createComboOffer.mutate({
      name: newCombo.name,
      description: newCombo.description || undefined,
      image_url: newCombo.image_url || undefined,
      original_price: parseFloat(newCombo.original_price),
      combo_price: parseFloat(newCombo.combo_price),
      stock_limit: parseInt(newCombo.stock_limit) || 100,
      items: selectedItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    });

    // Reset form
    setNewCombo({
      name: "",
      description: "",
      original_price: "",
      combo_price: "",
      stock_limit: "100",
      image_url: "",
    });
    setSelectedItems([]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewCombo(prev => ({ ...prev, image_url: imageUrl }));
    }
  };

  const calculateOriginalPrice = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="space-y-6">
      {/* Create New Combo Offer */}
      <Card>
        <CardHeader>
          <CardTitle>Create Combo Offer</CardTitle>
          <CardDescription>
            Create combo offers for frozen food items with discounted pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="combo-name">Combo Name *</Label>
              <Input
                id="combo-name"
                value={newCombo.name}
                onChange={(e) => setNewCombo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Family Combo, Lunch Special"
              />
            </div>
            <div>
              <Label htmlFor="stock-limit">Stock Limit</Label>
              <Input
                id="stock-limit"
                type="number"
                value={newCombo.stock_limit}
                onChange={(e) => setNewCombo(prev => ({ ...prev, stock_limit: e.target.value }))}
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="combo-description">Description</Label>
            <Textarea
              id="combo-description"
              value={newCombo.description}
              onChange={(e) => setNewCombo(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the combo offer"
              rows={3}
            />
          </div>

          {/* Add Products Section */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Add Products to Combo</h4>
            <div className="flex gap-2">
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a frozen food item" />
                </SelectTrigger>
                <SelectContent>
                  {frozenProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (৳{Number(product.price) * 110})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(e.target.value)}
                placeholder="Qty"
                className="w-20"
                min="1"
              />
              <Button type="button" onClick={handleAddProduct} disabled={!selectedProduct}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Selected Items:</h5>
                {selectedItems.map((item) => (
                  <div key={item.product_id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">
                      {item.quantity}x {item.name} (৳{item.price * 110} each)
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProduct(item.product_id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="text-sm font-medium">
                  Total Original Price: ৳{calculateOriginalPrice() * 110}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="original-price">Original Price (৳) *</Label>
              <Input
                id="original-price"
                type="number"
                value={newCombo.original_price}
                onChange={(e) => setNewCombo(prev => ({ ...prev, original_price: e.target.value }))}
                placeholder={calculateOriginalPrice().toString()}
              />
            </div>
            <div>
              <Label htmlFor="combo-price">Combo Price (৳) *</Label>
              <Input
                id="combo-price"
                type="number"
                value={newCombo.combo_price}
                onChange={(e) => setNewCombo(prev => ({ ...prev, combo_price: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="combo-image">Upload Image</Label>
            <div className="mt-2">
              <input
                id="combo-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('combo-image')?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              {newCombo.image_url && (
                <div className="mt-2">
                  <img
                    src={newCombo.image_url}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>

          <Button 
            onClick={handleCreateCombo} 
            className="w-full"
            disabled={createComboOffer.isPending || !newCombo.name || !newCombo.original_price || !newCombo.combo_price || selectedItems.length === 0}
          >
            {createComboOffer.isPending ? "Creating..." : "Create Combo Offer"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Combo Offers */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Combo Offers</CardTitle>
          <CardDescription>
            Manage your existing combo offers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {comboOffers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No combo offers created yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comboOffers.map((combo) => (
                <Card key={combo.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{combo.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteComboOffer.mutate(combo.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {combo.description && (
                      <p className="text-sm text-gray-600">{combo.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {combo.image_url && (
                      <img
                        src={combo.image_url}
                        alt={combo.name}
                        className="w-full h-24 object-cover rounded"
                      />
                    )}
                    
                    <div className="space-y-1">
                      <h5 className="text-sm font-medium">Items:</h5>
                      {combo.combo_offer_items.map((item) => (
                        <div key={item.id} className="text-xs text-gray-600">
                          {item.quantity}x {item.products.name}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-orange-600">৳{combo.combo_price}</span>
                          <span className="text-sm text-gray-400 line-through">৳{combo.original_price}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Save ৳{combo.original_price - combo.combo_price}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComboOffersTab;
