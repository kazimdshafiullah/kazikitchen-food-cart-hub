
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Twitter, Facebook, Instagram, Send } from "lucide-react";

const SocialMediaTab = () => {
  const [post, setPost] = useState("");
  const [image, setImage] = useState("");
  
  const handlePost = (platform: string) => {
    if (!post) {
      toast.error("Please enter a message to post");
      return;
    }
    
    toast.success(`Message scheduled for posting on ${platform}`);
    setPost("");
    setImage("");
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Social Media Post</CardTitle>
          <CardDescription>
            Craft and schedule posts for your social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Post Message</label>
            <Textarea 
              placeholder="What would you like to share with your customers?" 
              value={post}
              onChange={(e) => setPost(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL (optional)</label>
            <Input 
              placeholder="https://example.com/image.jpg" 
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Schedule for Later</Button>
          <div className="flex space-x-2">
            <Button 
              onClick={() => handlePost("Facebook")}
              className="flex items-center"
            >
              <Facebook className="mr-2 h-4 w-4" />
              Post to Facebook
            </Button>
            <Button 
              onClick={() => handlePost("Twitter")}
              className="flex items-center"
              variant="outline"
            >
              <Twitter className="mr-2 h-4 w-4" />
              Post to Twitter
            </Button>
            <Button 
              onClick={() => handlePost("Instagram")}
              className="flex items-center"
              variant="outline"
            >
              <Instagram className="mr-2 h-4 w-4" />
              Post to Instagram
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>
            View and manage your recent social media activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { platform: "Facebook", date: "2025-05-21", engagement: "241 likes, 32 shares" },
              { platform: "Instagram", date: "2025-05-19", engagement: "415 likes, 23 comments" },
              { platform: "Twitter", date: "2025-05-18", engagement: "87 likes, 12 retweets" }
            ].map((post, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="flex items-center">
                    {post.platform === "Facebook" && <Facebook className="mr-2 h-4 w-4 text-blue-600" />}
                    {post.platform === "Twitter" && <Twitter className="mr-2 h-4 w-4 text-blue-400" />}
                    {post.platform === "Instagram" && <Instagram className="mr-2 h-4 w-4 text-purple-600" />}
                    <span className="font-medium">{post.platform}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{post.date}</p>
                </div>
                <div>
                  <p className="text-sm">{post.engagement}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const EmailMarketingTab = () => {
  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  
  const handleSendTestEmail = () => {
    if (!subject || !emailBody) {
      toast.error("Please complete all fields");
      return;
    }
    toast.success("Test email sent!");
  };
  
  const handleSendCampaign = () => {
    if (!subject || !emailBody) {
      toast.error("Please complete all fields");
      return;
    }
    toast.success("Email campaign scheduled!");
    setSubject("");
    setEmailBody("");
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Email Campaign</CardTitle>
          <CardDescription>
            Create and send email marketing campaigns to your customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Subject</label>
            <Input 
              placeholder="Enter email subject line" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Content</label>
            <Textarea 
              placeholder="Compose your email message..." 
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={handleSendTestEmail}
          >
            Send Test Email
          </Button>
          <Button 
            onClick={handleSendCampaign}
            className="flex items-center"
          >
            <Send className="mr-2 h-4 w-4" />
            Send Campaign
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Previous Campaigns</CardTitle>
          <CardDescription>
            View performance metrics for your past email campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "May Special Offers", date: "2025-05-15", opens: "482", clicks: "167" },
              { name: "New Menu Launch", date: "2025-05-01", opens: "651", clicks: "243" },
              { name: "Customer Appreciation", date: "2025-04-22", opens: "389", clicks: "112" }
            ].map((campaign, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">Sent: {campaign.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <span className="font-medium">{campaign.opens}</span> opens
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">{campaign.clicks}</span> clicks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SocialMediaApiTab = () => {
  const [fbPixelId, setFbPixelId] = useState("");
  const [fbAccessToken, setFbAccessToken] = useState("");
  const [igAccessToken, setIgAccessToken] = useState("");
  const [twitterApiKey, setTwitterApiKey] = useState("");
  const [twitterApiSecret, setTwitterApiSecret] = useState("");
  const [tiktokPixelId, setTiktokPixelId] = useState("");
  
  const handleSaveSettings = () => {
    toast.success("Social media API settings saved");
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Social Media APIs</CardTitle>
          <CardDescription>
            Connect your social media accounts for automated marketing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Facebook</h4>
                <p className="text-sm text-muted-foreground">Facebook Marketing API and Pixel</p>
              </div>
              <Switch />
            </div>
            
            <div className="space-y-2 ml-6">
              <label className="text-sm font-medium">Facebook Pixel ID</label>
              <Input 
                placeholder="123456789012345" 
                value={fbPixelId}
                onChange={(e) => setFbPixelId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 ml-6">
              <label className="text-sm font-medium">Facebook Access Token</label>
              <Input 
                type="password" 
                placeholder="•••••••••••••••••" 
                value={fbAccessToken}
                onChange={(e) => setFbAccessToken(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Instagram</h4>
                <p className="text-sm text-muted-foreground">Instagram Business API</p>
              </div>
              <Switch />
            </div>
            
            <div className="space-y-2 ml-6">
              <label className="text-sm font-medium">Instagram Access Token</label>
              <Input 
                type="password" 
                placeholder="•••••••••••••••••" 
                value={igAccessToken}
                onChange={(e) => setIgAccessToken(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Twitter</h4>
                <p className="text-sm text-muted-foreground">Twitter API for marketing</p>
              </div>
              <Switch />
            </div>
            
            <div className="space-y-2 ml-6">
              <label className="text-sm font-medium">API Key</label>
              <Input 
                type="password" 
                placeholder="•••••••••••••••••" 
                value={twitterApiKey}
                onChange={(e) => setTwitterApiKey(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 ml-6">
              <label className="text-sm font-medium">API Secret</label>
              <Input 
                type="password" 
                placeholder="•••••••••••••••••" 
                value={twitterApiSecret}
                onChange={(e) => setTwitterApiSecret(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">TikTok</h4>
                <p className="text-sm text-muted-foreground">TikTok Pixel for ads</p>
              </div>
              <Switch />
            </div>
            
            <div className="space-y-2 ml-6">
              <label className="text-sm font-medium">TikTok Pixel ID</label>
              <Input 
                placeholder="CXXXXXXXXXXXXXXXXXX" 
                value={tiktokPixelId}
                onChange={(e) => setTiktokPixelId(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleSaveSettings}>
            Save API Settings
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
          <CardDescription>
            Current status of your social media integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: "Facebook Pixel", status: "Not connected", statusColor: "bg-red-100 text-red-800" },
              { name: "Instagram API", status: "Not connected", statusColor: "bg-red-100 text-red-800" },
              { name: "Twitter API", status: "Not connected", statusColor: "bg-red-100 text-red-800" },
              { name: "TikTok Pixel", status: "Not connected", statusColor: "bg-red-100 text-red-800" }
            ].map((integration, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="font-medium">{integration.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${integration.statusColor}`}>
                  {integration.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Marketing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Marketing</h2>
        <p className="text-muted-foreground">Manage your marketing campaigns and promotions</p>
      </div>
      
      <Tabs defaultValue="social" className="space-y-4">
        <TabsList>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="api">Social APIs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="social">
          <SocialMediaTab />
        </TabsContent>
        
        <TabsContent value="email">
          <EmailMarketingTab />
        </TabsContent>
        
        <TabsContent value="api">
          <SocialMediaApiTab />
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Analytics</CardTitle>
              <CardDescription>
                Track the performance of your marketing efforts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Marketing analytics data will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
