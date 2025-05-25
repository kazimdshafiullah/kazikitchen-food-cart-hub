import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Image, Palette, Upload, LayoutDashboard, Save, Trash2, Edit, Plus, Move, RotateCcw, Crop, Filter } from "lucide-react";

// Mock banner data
const initialBanners = [
  {
    id: 1,
    title: "Special Discount",
    subtitle: "20% off on selected items",
    image: "/placeholder.svg",
    active: true,
  },
  {
    id: 2,
    title: "New Menu Items",
    subtitle: "Try our latest recipes",
    image: "/placeholder.svg",
    active: false,
  },
  {
    id: 3,
    title: "Free Delivery",
    subtitle: "On orders over $35",
    image: "/placeholder.svg",
    active: true,
  }
];

const colorOptions = [
  { name: "Green", primary: "#10B981", accent: "#D1FAE5" },
  { name: "Blue", primary: "#3B82F6", accent: "#DBEAFE" },
  { name: "Purple", primary: "#8B5CF6", accent: "#EDE9FE" },
  { name: "Red", primary: "#EF4444", accent: "#FEE2E2" },
  { name: "Orange", primary: "#F97316", accent: "#FFEDD5" },
  { name: "Amber", primary: "#F59E0B", accent: "#FEF3C7" },
  { name: "Teal", primary: "#14B8A6", accent: "#CCFBF1" },
];

const BannersTab = () => {
  const [banners, setBanners] = useState(initialBanners);
  const [selectedBanner, setSelectedBanner] = useState(banners[0]);
  
  const handleToggleBanner = (id: number) => {
    const updatedBanners = banners.map(banner => 
      banner.id === id ? { ...banner, active: !banner.active } : banner
    );
    setBanners(updatedBanners);
    setSelectedBanner(updatedBanners.find(banner => banner.id === id) || updatedBanners[0]);
  };
  
  const handleSaveBanner = () => {
    const updatedBanners = banners.map(banner => 
      banner.id === selectedBanner.id ? selectedBanner : banner
    );
    setBanners(updatedBanners);
    toast.success("Banner updated successfully");
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would upload the file to a server
      // For now, we'll simulate by using a placeholder
      setSelectedBanner({
        ...selectedBanner,
        image: "/placeholder.svg"  // In reality, this would be the uploaded image URL
      });
      toast.success("Image uploaded successfully");
    }
  };
  
  return (
    <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Banners</CardTitle>
            <CardDescription>
              Manage promotional banners on your homepage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {banners.map(banner => (
              <div 
                key={banner.id} 
                className={`p-3 border rounded-md cursor-pointer ${selectedBanner.id === banner.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                onClick={() => setSelectedBanner(banner)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{banner.title}</span>
                  <Switch 
                    checked={banner.active} 
                    onCheckedChange={() => handleToggleBanner(banner.id)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
              </div>
            ))}
            <Button className="w-full mt-4" variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Banner
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Edit Banner</CardTitle>
            <CardDescription>
              Customize the selected banner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={selectedBanner?.title}
                onChange={(e) => setSelectedBanner({...selectedBanner, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <Input 
                value={selectedBanner?.subtitle}
                onChange={(e) => setSelectedBanner({...selectedBanner, subtitle: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Banner Image</label>
              <div className="flex items-center space-x-4">
                <div className="border rounded-md overflow-hidden w-24 h-24">
                  <img src={selectedBanner?.image} alt="Banner" className="w-full h-full object-cover" />
                </div>
                <div>
                  <Input 
                    type="file" 
                    id="banner-image" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  <label htmlFor="banner-image">
                    <Button variant="outline" className="cursor-pointer" type="button" asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" /> Upload Image
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={selectedBanner?.active} 
                id="active-status"
                onCheckedChange={() => handleToggleBanner(selectedBanner.id)}
              />
              <label htmlFor="active-status" className="text-sm font-medium">
                {selectedBanner?.active ? 'Active' : 'Inactive'}
              </label>
            </div>
            
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">Banner Preview</h4>
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="relative w-full h-32 bg-gray-200 rounded-md overflow-hidden">
                  <img src={selectedBanner?.image} alt="Banner preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex flex-col justify-center p-4 bg-black/30 text-white">
                    <h3 className="text-xl font-bold">{selectedBanner?.title}</h3>
                    <p>{selectedBanner?.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSaveBanner}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

const ThemeTab = () => {
  const [selectedColorScheme, setSelectedColorScheme] = useState(colorOptions[0]);
  const [logoUrl, setLogoUrl] = useState("/placeholder.svg");
  const [faviconUrl, setFaviconUrl] = useState("/favicon.ico");
  const [fontFamily, setFontFamily] = useState("Inter");
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would upload the file to a server
      toast.success("Logo uploaded successfully");
    }
  };
  
  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would upload the file to a server
      toast.success("Favicon uploaded successfully");
    }
  };
  
  const handleSaveTheme = () => {
    toast.success("Theme settings saved");
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Scheme</CardTitle>
          <CardDescription>
            Choose the primary colors for your site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {colorOptions.map((color, index) => (
              <div 
                key={index}
                onClick={() => setSelectedColorScheme(color)}
                className={`cursor-pointer p-3 rounded-md border ${selectedColorScheme.name === color.name ? 'border-black' : 'border-transparent'}`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex space-x-1">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color.primary }} />
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color.accent }} />
                  </div>
                  <span className="text-xs">{color.name}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-2">
            <div className="flex space-x-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Primary</label>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedColorScheme.primary }} />
                  <Input 
                    value={selectedColorScheme.primary} 
                    onChange={(e) => setSelectedColorScheme({...selectedColorScheme, primary: e.target.value})}
                    className="w-24"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Accent</label>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedColorScheme.accent }} />
                  <Input 
                    value={selectedColorScheme.accent} 
                    onChange={(e) => setSelectedColorScheme({...selectedColorScheme, accent: e.target.value})}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Typography & Branding</CardTitle>
          <CardDescription>
            Upload your logo and choose fonts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo</label>
            <div className="flex items-center space-x-4">
              <div className="border rounded-md overflow-hidden w-20 h-20">
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <Input 
                  type="file" 
                  id="logo-upload" 
                  className="hidden" 
                  onChange={handleLogoUpload}
                  accept="image/*"
                />
                <label htmlFor="logo-upload">
                  <Button variant="outline" className="cursor-pointer" type="button" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" /> Upload Logo
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Favicon</label>
            <div className="flex items-center space-x-4">
              <div className="border rounded-md overflow-hidden w-10 h-10 flex items-center justify-center">
                <img src={faviconUrl} alt="Favicon" className="max-w-full max-h-full" />
              </div>
              <div>
                <Input 
                  type="file" 
                  id="favicon-upload" 
                  className="hidden" 
                  onChange={handleFaviconUpload}
                  accept="image/x-icon,image/png"
                />
                <label htmlFor="favicon-upload">
                  <Button variant="outline" className="cursor-pointer" type="button" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" /> Upload Favicon
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Family</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Poppins">Poppins</option>
              <option value="Lato">Lato</option>
            </select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveTheme}>
            <Save className="mr-2 h-4 w-4" /> Save Theme
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const LayoutDesignTab = () => {
  const [layoutSettings, setLayoutSettings] = useState({
    headerHeight: [80],
    footerHeight: [120],
    containerMaxWidth: [1200],
    spacing: [16],
    borderRadius: [8],
    sectionPadding: [40]
  });
  
  const [headerSettings, setHeaderSettings] = useState({
    showLogo: true,
    logoPosition: "left",
    showNavigation: true,
    navPosition: "center",
    showCartIcon: true,
    headerStyle: "default",
    headerBackground: "#ffffff",
    headerTextColor: "#000000"
  });
  
  const handleSaveLayout = () => {
    toast({
      title: "Success",
      description: "Layout settings saved successfully"
    });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Layout Dimensions</CardTitle>
          <CardDescription>Adjust spacing and sizing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Header Height: {layoutSettings.headerHeight[0]}px</Label>
            <Slider
              value={layoutSettings.headerHeight}
              onValueChange={(value) => setLayoutSettings({...layoutSettings, headerHeight: value})}
              max={200}
              min={60}
              step={10}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Container Max Width: {layoutSettings.containerMaxWidth[0]}px</Label>
            <Slider
              value={layoutSettings.containerMaxWidth}
              onValueChange={(value) => setLayoutSettings({...layoutSettings, containerMaxWidth: value})}
              max={1400}
              min={800}
              step={50}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Border Radius: {layoutSettings.borderRadius[0]}px</Label>
            <Slider
              value={layoutSettings.borderRadius}
              onValueChange={(value) => setLayoutSettings({...layoutSettings, borderRadius: value})}
              max={30}
              min={0}
              step={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Section Padding: {layoutSettings.sectionPadding[0]}px</Label>
            <Slider
              value={layoutSettings.sectionPadding}
              onValueChange={(value) => setLayoutSettings({...layoutSettings, sectionPadding: value})}
              max={100}
              min={20}
              step={10}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Header Configuration</CardTitle>
          <CardDescription>Customize header appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Show Logo</Label>
            <Switch 
              checked={headerSettings.showLogo}
              onCheckedChange={(checked) => setHeaderSettings({...headerSettings, showLogo: checked})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Logo Position</Label>
            <Select 
              value={headerSettings.logoPosition} 
              onValueChange={(value) => setHeaderSettings({...headerSettings, logoPosition: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Header Style</Label>
            <Select 
              value={headerSettings.headerStyle} 
              onValueChange={(value) => setHeaderSettings({...headerSettings, headerStyle: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="transparent">Transparent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: headerSettings.headerBackground }}
                />
                <Input 
                  value={headerSettings.headerBackground}
                  onChange={(e) => setHeaderSettings({...headerSettings, headerBackground: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ backgroundColor: headerSettings.headerTextColor }}
                />
                <Input 
                  value={headerSettings.headerTextColor}
                  onChange={(e) => setHeaderSettings({...headerSettings, headerTextColor: e.target.value})}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveLayout}>
            <Save className="mr-2 h-4 w-4" />
            Save Layout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const MediaLibraryTab = () => {
  const [mediaItems, setMediaItems] = useState([
    { id: 1, name: "hero-image.jpg", type: "image", url: "/placeholder.svg", size: "1.2 MB", date: "2025-05-10", category: "hero" },
    { id: 2, name: "menu-background.jpg", type: "image", url: "/placeholder.svg", size: "0.8 MB", date: "2025-05-12", category: "background" },
    { id: 3, name: "logo.svg", type: "image", url: "/placeholder.svg", size: "0.2 MB", date: "2025-05-01", category: "logo" },
    { id: 4, name: "product-showcase.jpg", type: "image", url: "/placeholder.svg", size: "1.5 MB", date: "2025-05-15", category: "product" },
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [imageEditMode, setImageEditMode] = useState<number | null>(null);
  const [imageTransforms, setImageTransforms] = useState({
    resize: [100],
    rotate: [0],
    brightness: [100],
    contrast: [100],
    saturation: [100]
  });
  
  const categories = ["all", "logo", "hero", "background", "product", "banner"];
  
  const filteredItems = selectedCategory === "all" 
    ? mediaItems 
    : mediaItems.filter(item => item.category === selectedCategory);
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newItem = {
        id: mediaItems.length + 1,
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "file",
        url: "/placeholder.svg",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toISOString().split('T')[0],
        category: "product"
      };
      
      setMediaItems([newItem, ...mediaItems]);
      toast({
        title: "Success",
        description: "File uploaded successfully"
      });
    }
  };
  
  const handleDeleteImage = (id: number) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Image deleted successfully"
    });
  };
  
  const handleImageTransform = (id: number) => {
    toast({
      title: "Success",
      description: "Image transformations applied"
    });
    setImageEditMode(null);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Media Library & Image Editor
          </CardTitle>
          <CardDescription>
            Upload, organize and edit images for your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Input 
              type="file" 
              id="media-upload" 
              className="hidden" 
              onChange={handleUpload}
              accept="image/*"
              multiple
            />
            <label htmlFor="media-upload">
              <Button className="w-full py-8 h-auto flex flex-col" variant="outline" asChild>
                <div>
                  <Upload className="h-6 w-6 mb-2" />
                  <span>Drop files here or click to upload</span>
                  <span className="text-xs text-muted-foreground mt-1">Supports: JPG, PNG, GIF, SVG up to 10MB</span>
                </div>
              </Button>
            </label>
          </div>
          
          {imageEditMode && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Image Editor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Resize: {imageTransforms.resize[0]}%</Label>
                  <Slider
                    value={imageTransforms.resize}
                    onValueChange={(value) => setImageTransforms({...imageTransforms, resize: value})}
                    max={200}
                    min={10}
                    step={10}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Rotate: {imageTransforms.rotate[0]}°</Label>
                  <Slider
                    value={imageTransforms.rotate}
                    onValueChange={(value) => setImageTransforms({...imageTransforms, rotate: value})}
                    max={360}
                    min={0}
                    step={15}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Brightness: {imageTransforms.brightness[0]}%</Label>
                    <Slider
                      value={imageTransforms.brightness}
                      onValueChange={(value) => setImageTransforms({...imageTransforms, brightness: value})}
                      max={200}
                      min={0}
                      step={10}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Contrast: {imageTransforms.contrast[0]}%</Label>
                    <Slider
                      value={imageTransforms.contrast}
                      onValueChange={(value) => setImageTransforms({...imageTransforms, contrast: value})}
                      max={200}
                      min={0}
                      step={10}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Saturation: {imageTransforms.saturation[0]}%</Label>
                    <Slider
                      value={imageTransforms.saturation}
                      onValueChange={(value) => setImageTransforms({...imageTransforms, saturation: value})}
                      max={200}
                      min={0}
                      step={10}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => handleImageTransform(imageEditMode)}>
                    <Save className="mr-2 h-4 w-4" />
                    Apply Changes
                  </Button>
                  <Button variant="outline" onClick={() => setImageEditMode(null)}>
                    Cancel
                  </Button>
                  <Button variant="outline" onClick={() => setImageTransforms({
                    resize: [100], rotate: [0], brightness: [100], contrast: [100], saturation: [100]
                  })}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="border rounded-md overflow-hidden">
                <div className="aspect-square bg-gray-100 relative group">
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 bg-white"
                      onClick={() => setImageEditMode(item.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 bg-white"
                      onClick={() => handleDeleteImage(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.size}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// We need to import these components
const Plus = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Trash2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const SiteDesign = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Site Design</h2>
        <p className="text-muted-foreground">Customize every aspect of your website's appearance</p>
      </div>
      
      <Tabs defaultValue="banners" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="media">Media & Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="banners">
          <BannersTab />
        </TabsContent>
        
        <TabsContent value="theme">
          <ThemeTab />
        </TabsContent>
        
        <TabsContent value="layout">
          <LayoutDesignTab />
        </TabsContent>
        
        <TabsContent value="media">
          <MediaLibraryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDesign;
