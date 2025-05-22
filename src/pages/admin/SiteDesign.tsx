
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { Image, Palette, Upload, LayoutDashboard, Save } from "lucide-react";

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

const MediaLibraryTab = () => {
  const [mediaItems, setMediaItems] = useState([
    { id: 1, name: "hero-image.jpg", type: "image", url: "/placeholder.svg", size: "1.2 MB", date: "2025-05-10" },
    { id: 2, name: "menu-background.jpg", type: "image", url: "/placeholder.svg", size: "0.8 MB", date: "2025-05-12" },
    { id: 3, name: "logo.svg", type: "image", url: "/placeholder.svg", size: "0.2 MB", date: "2025-05-01" },
    { id: 4, name: "product-showcase.jpg", type: "image", url: "/placeholder.svg", size: "1.5 MB", date: "2025-05-15" },
  ]);
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would upload the file to a server
      const file = e.target.files[0];
      const newItem = {
        id: mediaItems.length + 1,
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "file",
        url: "/placeholder.svg", // In reality, this would be the uploaded file URL
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toISOString().split('T')[0]
      };
      
      setMediaItems([newItem, ...mediaItems]);
      toast.success("File uploaded successfully");
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
          <CardDescription>
            Upload and manage images for your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input 
              type="file" 
              id="media-upload" 
              className="hidden" 
              onChange={handleUpload}
              accept="image/*"
              multiple
            />
            <label htmlFor="media-upload">
              <Button className="w-full py-8 h-auto flex flex-col" variant="outline">
                <Upload className="h-6 w-6 mb-2" />
                <span>Drop files here or click to upload</span>
                <span className="text-xs text-muted-foreground mt-1">Supports: JPG, PNG, GIF up to 5MB</span>
              </Button>
            </label>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaItems.map(item => (
              <div key={item.id} className="border rounded-md overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button size="icon" variant="outline" className="h-6 w-6 rounded-full bg-white">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.size}</p>
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
        <p className="text-muted-foreground">Customize the look and feel of your website</p>
      </div>
      
      <Tabs defaultValue="banners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="banners">
          <BannersTab />
        </TabsContent>
        
        <TabsContent value="theme">
          <ThemeTab />
        </TabsContent>
        
        <TabsContent value="media">
          <MediaLibraryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDesign;
