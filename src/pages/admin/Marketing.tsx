
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Mail, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Eye,
  Click,
  Target,
  Settings,
  Play,
  Pause,
  Edit
} from "lucide-react";

const EmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: "1",
      name: "Weekly Menu Promotion",
      subject: "This Week's Special Menu Available Now!",
      status: "sent",
      recipients: 1250,
      openRate: "24.5%",
      clickRate: "8.2%",
      sentDate: "2025-05-18"
    },
    {
      id: "2",
      name: "New Customer Welcome",
      subject: "Welcome to Kazi Kitchen - 20% Off First Order",
      status: "draft",
      recipients: 0,
      openRate: "0%",
      clickRate: "0%",
      sentDate: null
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Email Campaigns</h3>
          <p className="text-sm text-muted-foreground">Create and manage email marketing campaigns</p>
        </div>
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Click Rate</CardTitle>
            <Click className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2%</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{campaign.name}</CardTitle>
                  <CardDescription>{campaign.subject}</CardDescription>
                </div>
                <Badge variant={campaign.status === "sent" ? "default" : "secondary"}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Recipients:</span>
                  <p className="font-medium">{campaign.recipients}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Open Rate:</span>
                  <p className="font-medium">{campaign.openRate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Click Rate:</span>
                  <p className="font-medium">{campaign.clickRate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sent Date:</span>
                  <p className="font-medium">{campaign.sentDate || "Not sent"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                {campaign.status === "draft" && (
                  <Button size="sm">
                    <Mail className="mr-1 h-4 w-4" />
                    Send
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const GoogleAdsManager = () => {
  const [adCampaigns, setAdCampaigns] = useState([
    {
      id: "1",
      name: "Weekend Special Menu",
      status: "active",
      budget: 500,
      spent: 247.50,
      impressions: 12450,
      clicks: 186,
      conversions: 23,
      ctr: "1.49%",
      cpc: 1.33,
      startDate: "2025-05-15",
      endDate: "2025-05-21"
    },
    {
      id: "2",
      name: "New Customer Acquisition",
      status: "paused",
      budget: 300,
      spent: 89.20,
      impressions: 5670,
      clicks: 94,
      conversions: 8,
      ctr: "1.66%",
      cpc: 0.95,
      startDate: "2025-05-10",
      endDate: "2025-05-24"
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    budget: "",
    targetAudience: "",
    keywords: "",
    adText: "",
    landingUrl: ""
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.budget) {
      toast({
        title: "Error",
        description: "Campaign name and budget are required",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Campaign Created",
      description: `Google Ads campaign "${newCampaign.name}" has been created and submitted for review.`
    });

    setNewCampaign({
      name: "",
      budget: "",
      targetAudience: "",
      keywords: "",
      adText: "",
      landingUrl: ""
    });
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setAdCampaigns(adCampaigns.map(campaign =>
      campaign.id === campaignId
        ? { ...campaign, status: campaign.status === "active" ? "paused" : "active" }
        : campaign
    ));

    const campaign = adCampaigns.find(c => c.id === campaignId);
    toast({
      title: "Campaign Updated",
      description: `Campaign "${campaign?.name}" has been ${campaign?.status === "active" ? "paused" : "activated"}.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Google Ads Management</h3>
        <p className="text-sm text-muted-foreground">Create and manage Google Ads campaigns to boost your posts</p>
      </div>

      {/* Google Ads API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Google Ads API Configuration
          </CardTitle>
          <CardDescription>Configure your Google Ads API credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Google Ads Customer ID</label>
              <Input placeholder="Enter your Google Ads Customer ID" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Developer Token</label>
              <Input type="password" placeholder="Enter your developer token" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client ID</label>
              <Input placeholder="Enter OAuth2 Client ID" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Secret</label>
              <Input type="password" placeholder="Enter OAuth2 Client Secret" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Refresh Token</label>
            <Input type="password" placeholder="Enter OAuth2 Refresh Token" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => toast({ title: "Success", description: "Google Ads API configuration saved!" })}>
            Save Configuration
          </Button>
        </CardFooter>
      </Card>

      {/* Campaign Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{adCampaigns.reduce((acc, camp) => acc + camp.spent, 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adCampaigns.reduce((acc, camp) => acc + camp.impressions, 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <Click className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adCampaigns.reduce((acc, camp) => acc + camp.clicks, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adCampaigns.reduce((acc, camp) => acc + camp.conversions, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Manage your Google Ads campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adCampaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{campaign.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {campaign.startDate} - {campaign.endDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                      {campaign.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleCampaignStatus(campaign.id)}
                    >
                      {campaign.status === "active" ? (
                        <><Pause className="h-4 w-4 mr-1" /> Pause</>
                      ) : (
                        <><Play className="h-4 w-4 mr-1" /> Resume</>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <p className="font-medium">৳{campaign.budget}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Spent:</span>
                    <p className="font-medium">৳{campaign.spent}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Impressions:</span>
                    <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Clicks:</span>
                    <p className="font-medium">{campaign.clicks}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CTR:</span>
                    <p className="font-medium">{campaign.ctr}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CPC:</span>
                    <p className="font-medium">৳{campaign.cpc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create New Campaign */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Google Ads Campaign</CardTitle>
          <CardDescription>Set up a new advertising campaign to boost your posts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Name</label>
              <Input
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                placeholder="Enter campaign name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Daily Budget (৳)</label>
              <Input
                type="number"
                value={newCampaign.budget}
                onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
                placeholder="Enter daily budget"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Audience</label>
            <Select onValueChange={(value) => setNewCampaign({...newCampaign, targetAudience: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food-lovers">Food Lovers</SelectItem>
                <SelectItem value="office-workers">Office Workers</SelectItem>
                <SelectItem value="families">Families</SelectItem>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="health-conscious">Health Conscious</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Keywords</label>
            <Input
              value={newCampaign.keywords}
              onChange={(e) => setNewCampaign({...newCampaign, keywords: e.target.value})}
              placeholder="Enter keywords separated by commas"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ad Text</label>
            <Textarea
              value={newCampaign.adText}
              onChange={(e) => setNewCampaign({...newCampaign, adText: e.target.value})}
              placeholder="Write your ad copy"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Landing Page URL</label>
            <Input
              value={newCampaign.landingUrl}
              onChange={(e) => setNewCampaign({...newCampaign, landingUrl: e.target.value})}
              placeholder="https://yoursite.com/landing-page"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateCampaign}>
            <Target className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const SocialMediaManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Social Media Management</h3>
        <p className="text-sm text-muted-foreground">Manage your social media presence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Facebook Integration</CardTitle>
            <CardDescription>Connect and manage your Facebook page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto-post new products</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Share daily menu</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Boost popular posts</span>
              <Switch />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Connect Facebook
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instagram Integration</CardTitle>
            <CardDescription>Connect and manage your Instagram account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto-post food photos</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Story highlights</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hashtag optimization</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Connect Instagram
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

const Marketing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Marketing Management</h2>
        <p className="text-muted-foreground">Manage your marketing campaigns, social media, and advertising</p>
      </div>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">Email Campaigns</TabsTrigger>
          <TabsTrigger value="google-ads">Google Ads</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <EmailCampaigns />
        </TabsContent>

        <TabsContent value="google-ads">
          <GoogleAdsManager />
        </TabsContent>

        <TabsContent value="social">
          <SocialMediaManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
