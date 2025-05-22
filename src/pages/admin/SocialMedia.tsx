
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

const SocialMedia = () => {
  const [facebookSettings, setFacebookSettings] = useState({
    pixelId: "",
    enabled: false,
    accessToken: "",
    pageId: ""
  });
  
  const [instagramSettings, setInstagramSettings] = useState({
    enabled: false,
    accessToken: "",
    businessAccountId: ""
  });
  
  const [twitterSettings, setTwitterSettings] = useState({
    enabled: false,
    apiKey: "",
    apiSecretKey: "",
    accessToken: "",
    accessTokenSecret: ""
  });
  
  const [tiktokSettings, setTiktokSettings] = useState({
    enabled: false,
    pixelId: "",
    accessToken: ""
  });
  
  // Generic handler for any social media settings
  const handleSaveSettings = (platform: string) => {
    toast.success(`${platform} settings saved successfully`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Social Media Integration</h2>
        <p className="text-muted-foreground">Connect your social media accounts for marketing and analytics</p>
      </div>
      
      <Tabs defaultValue="facebook" className="space-y-4">
        <TabsList className="w-full flex overflow-auto">
          <TabsTrigger value="facebook" className="flex-1">Facebook</TabsTrigger>
          <TabsTrigger value="instagram" className="flex-1">Instagram</TabsTrigger>
          <TabsTrigger value="twitter" className="flex-1">Twitter</TabsTrigger>
          <TabsTrigger value="tiktok" className="flex-1">TikTok</TabsTrigger>
        </TabsList>
        
        {/* Facebook Tab */}
        <TabsContent value="facebook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Facebook Integration</CardTitle>
              <CardDescription>
                Connect Facebook for advertising, pixel tracking and customer engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="facebook-enabled" className="flex flex-col space-y-1">
                  <span>Enable Facebook Integration</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Turn on/off all Facebook features
                  </span>
                </Label>
                <Switch 
                  id="facebook-enabled" 
                  checked={facebookSettings.enabled}
                  onCheckedChange={(checked) => setFacebookSettings({...facebookSettings, enabled: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pixel-id">Facebook Pixel ID</Label>
                <Input
                  id="pixel-id"
                  placeholder="Enter your Facebook Pixel ID"
                  value={facebookSettings.pixelId}
                  onChange={(e) => setFacebookSettings({...facebookSettings, pixelId: e.target.value})}
                />
                <p className="text-sm text-muted-foreground">
                  The Pixel ID is used for tracking conversions and retargeting ads
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fb-access-token">Access Token</Label>
                <Input
                  id="fb-access-token"
                  type="password"
                  placeholder="Enter your access token"
                  value={facebookSettings.accessToken}
                  onChange={(e) => setFacebookSettings({...facebookSettings, accessToken: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fb-page-id">Facebook Page ID</Label>
                <Input
                  id="fb-page-id"
                  placeholder="Enter your Facebook Page ID"
                  value={facebookSettings.pageId}
                  onChange={(e) => setFacebookSettings({...facebookSettings, pageId: e.target.value})}
                />
              </div>
              
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Pixel Events Configuration</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  These events will be automatically tracked on your website
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="event-purchase" defaultChecked />
                    <Label htmlFor="event-purchase" className="font-normal">Order Completed (Purchase)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="event-add-to-cart" defaultChecked />
                    <Label htmlFor="event-add-to-cart" className="font-normal">Add to Cart</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="event-view-content" defaultChecked />
                    <Label htmlFor="event-view-content" className="font-normal">View Content (Product View)</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="event-initiate-checkout" defaultChecked />
                    <Label htmlFor="event-initiate-checkout" className="font-normal">Initiate Checkout</Label>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Facebook Catalog Integration</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your product catalog to Facebook for dynamic product ads
                </p>
                
                <Button variant="outline" size="sm">
                  Connect Product Catalog
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("Facebook")}>Save Facebook Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Facebook Pixel Code Preview</CardTitle>
              <CardDescription>
                Copy this code to manually add to your website if needed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                className="font-mono text-xs"
                rows={10}
                readOnly
                value={`<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${facebookSettings.pixelId || "YOUR_PIXEL_ID"}');
  fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none" 
       src="https://www.facebook.com/tr?id=${facebookSettings.pixelId || "YOUR_PIXEL_ID"}&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->`}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Instagram Tab */}
        <TabsContent value="instagram" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Instagram Integration</CardTitle>
              <CardDescription>
                Connect Instagram for product tagging and marketing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="instagram-enabled">
                  Enable Instagram Integration
                </Label>
                <Switch 
                  id="instagram-enabled" 
                  checked={instagramSettings.enabled}
                  onCheckedChange={(checked) => setInstagramSettings({...instagramSettings, enabled: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ig-access-token">Instagram Access Token</Label>
                <Input
                  id="ig-access-token"
                  type="password"
                  placeholder="Enter your Instagram access token"
                  value={instagramSettings.accessToken}
                  onChange={(e) => setInstagramSettings({...instagramSettings, accessToken: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ig-business-id">Business Account ID</Label>
                <Input
                  id="ig-business-id"
                  placeholder="Enter your Instagram Business Account ID"
                  value={instagramSettings.businessAccountId}
                  onChange={(e) => setInstagramSettings({...instagramSettings, businessAccountId: e.target.value})}
                />
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Note: Instagram integration requires a Facebook Business account to be connected first.
                </p>
                <Button variant="outline" className="mt-2">
                  Connect with Instagram
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("Instagram")}>Save Instagram Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Twitter Tab */}
        <TabsContent value="twitter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Twitter Integration</CardTitle>
              <CardDescription>
                Connect Twitter for social engagement and advertising
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="twitter-enabled">
                  Enable Twitter Integration
                </Label>
                <Switch 
                  id="twitter-enabled" 
                  checked={twitterSettings.enabled}
                  onCheckedChange={(checked) => setTwitterSettings({...twitterSettings, enabled: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter-api-key">API Key</Label>
                <Input
                  id="twitter-api-key"
                  placeholder="Enter your Twitter API Key"
                  value={twitterSettings.apiKey}
                  onChange={(e) => setTwitterSettings({...twitterSettings, apiKey: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter-api-secret">API Secret Key</Label>
                <Input
                  id="twitter-api-secret"
                  type="password"
                  placeholder="Enter your Twitter API Secret Key"
                  value={twitterSettings.apiSecretKey}
                  onChange={(e) => setTwitterSettings({...twitterSettings, apiSecretKey: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter-access-token">Access Token</Label>
                <Input
                  id="twitter-access-token"
                  placeholder="Enter your access token"
                  value={twitterSettings.accessToken}
                  onChange={(e) => setTwitterSettings({...twitterSettings, accessToken: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter-access-token-secret">Access Token Secret</Label>
                <Input
                  id="twitter-access-token-secret"
                  type="password"
                  placeholder="Enter your access token secret"
                  value={twitterSettings.accessTokenSecret}
                  onChange={(e) => setTwitterSettings({...twitterSettings, accessTokenSecret: e.target.value})}
                />
              </div>
              
              <div className="pt-4">
                <Button variant="outline">
                  Connect with Twitter
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("Twitter")}>Save Twitter Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* TikTok Tab */}
        <TabsContent value="tiktok" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TikTok Integration</CardTitle>
              <CardDescription>
                Connect TikTok for social marketing and pixel tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="tiktok-enabled">
                  Enable TikTok Integration
                </Label>
                <Switch 
                  id="tiktok-enabled" 
                  checked={tiktokSettings.enabled}
                  onCheckedChange={(checked) => setTiktokSettings({...tiktokSettings, enabled: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tiktok-pixel-id">TikTok Pixel ID</Label>
                <Input
                  id="tiktok-pixel-id"
                  placeholder="Enter your TikTok Pixel ID"
                  value={tiktokSettings.pixelId}
                  onChange={(e) => setTiktokSettings({...tiktokSettings, pixelId: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tiktok-access-token">Access Token</Label>
                <Input
                  id="tiktok-access-token"
                  type="password"
                  placeholder="Enter your TikTok access token"
                  value={tiktokSettings.accessToken}
                  onChange={(e) => setTiktokSettings({...tiktokSettings, accessToken: e.target.value})}
                />
              </div>
              
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">TikTok Event Configuration</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  These events will be automatically tracked with the TikTok pixel
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="tiktok-event-purchase" defaultChecked />
                    <Label htmlFor="tiktok-event-purchase" className="font-normal">Complete Payment</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="tiktok-event-add-to-cart" defaultChecked />
                    <Label htmlFor="tiktok-event-add-to-cart" className="font-normal">Add to Cart</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="tiktok-event-view-content" defaultChecked />
                    <Label htmlFor="tiktok-event-view-content" className="font-normal">View Content</Label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline">
                  Connect with TikTok
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("TikTok")}>Save TikTok Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>TikTok Pixel Code Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                className="font-mono text-xs"
                rows={10}
                readOnly
                value={`<!-- TikTok Pixel Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;
  var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
  ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${tiktokSettings.pixelId || "YOUR_PIXEL_ID"}');
  ttq.page();
}(window, document, 'ttq');
</script>
<!-- End TikTok Pixel Code -->`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialMedia;
