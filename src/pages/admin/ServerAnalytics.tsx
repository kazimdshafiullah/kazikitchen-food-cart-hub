
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  Activity, 
  Database, 
  Users, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  HardDrive
} from "lucide-react";

const ServerAnalytics = () => {
  const [serverMetrics] = useState({
    uptime: "99.8%",
    responseTime: "120ms",
    activeUsers: 1247,
    dailyRequests: 45632,
    errorRate: "0.2%",
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    bandwidth: "2.4 GB"
  });

  const [performanceData] = useState([
    { time: "00:00", requests: 1200, errors: 2 },
    { time: "04:00", requests: 800, errors: 1 },
    { time: "08:00", requests: 2100, errors: 5 },
    { time: "12:00", requests: 3400, errors: 8 },
    { time: "16:00", requests: 2800, errors: 3 },
    { time: "20:00", requests: 1900, errors: 2 }
  ]);

  const [topPages] = useState([
    { page: "/", views: 12450, loadTime: "1.2s" },
    { page: "/products", views: 8930, loadTime: "1.8s" },
    { page: "/cart", views: 5670, loadTime: "1.5s" },
    { page: "/checkout", views: 3240, loadTime: "2.1s" },
    { page: "/admin", views: 1890, loadTime: "1.3s" }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Server Analytics</h2>
        <p className="text-muted-foreground">Monitor server performance and analyze traffic patterns</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Server Uptime</p>
                    <p className="text-2xl font-bold text-green-600">{serverMetrics.uptime}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                    <p className="text-2xl font-bold">{serverMetrics.responseTime}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{serverMetrics.activeUsers.toLocaleString()}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Daily Requests</p>
                    <p className="text-2xl font-bold">{serverMetrics.dailyRequests.toLocaleString()}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Usage</span>
                    <span>{serverMetrics.cpuUsage}%</span>
                  </div>
                  <Progress value={serverMetrics.cpuUsage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Usage</span>
                    <span>{serverMetrics.memoryUsage}%</span>
                  </div>
                  <Progress value={serverMetrics.memoryUsage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Disk Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Usage</span>
                    <span>{serverMetrics.diskUsage}%</span>
                  </div>
                  <Progress value={serverMetrics.diskUsage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Request Volume (24h)</CardTitle>
                <CardDescription>Number of requests per hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {performanceData.map((data, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{data.time}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(data.requests / 3400) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{data.requests}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages and their load times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPages.map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{page.page}</p>
                        <p className="text-sm text-muted-foreground">{page.views} views</p>
                      </div>
                      <Badge variant="outline">{page.loadTime}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Direct</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Google Search</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Social Media</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full w-1/5"></div>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Other</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full w-1/10"></div>
                    </div>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Recent Errors
              </CardTitle>
              <CardDescription>System errors and warnings from the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-red-600">Database Connection Timeout</p>
                    <p className="text-sm text-muted-foreground">2025-05-26 14:32:11</p>
                  </div>
                  <Badge variant="destructive">Error</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-600">High Memory Usage</p>
                    <p className="text-sm text-muted-foreground">2025-05-26 13:15:45</p>
                  </div>
                  <Badge variant="outline">Warning</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-red-600">API Rate Limit Exceeded</p>
                    <p className="text-sm text-muted-foreground">2025-05-26 12:08:22</p>
                  </div>
                  <Badge variant="destructive">Error</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServerAnalytics;
