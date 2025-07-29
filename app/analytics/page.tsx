'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useVideo } from '@/lib/video-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle,
  Calendar,
  Target,
  Users,
  Clock,
  Award,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { mockDB } from '@/lib/mock-backend';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { videos } = useVideo();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Load analytics data
    const userAnalytics = mockDB.getUserAnalytics(user.id);
    setAnalytics(userAnalytics);
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const topVideos = videos
    .sort((a, b) => (b.analytics?.views || 0) - (a.analytics?.views || 0))
    .slice(0, 5);

  const engagementTrend = [
    { period: 'Week 1', views: 12000, likes: 850, shares: 120 },
    { period: 'Week 2', views: 18500, likes: 1200, shares: 180 },
    { period: 'Week 3', views: 25000, likes: 1800, shares: 250 },
    { period: 'Week 4', views: 32000, likes: 2400, shares: 320 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Track your content performance and growth
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 days
            </Button>
            <Button variant="outline" size="sm">
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +12.5% from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalLikes.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +8.2% from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.engagementRate}%</div>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  -2.1% from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Views/Video</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.avgViewsPerVideo.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +15.3% from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts and Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Engagement Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Trend</CardTitle>
                  <CardDescription>Views, likes, and shares over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {engagementTrend.map((week, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{week.period}</span>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center text-blue-600">
                            <Eye className="h-3 w-3 mr-1" />
                            {week.views.toLocaleString()}
                          </span>
                          <span className="flex items-center text-red-600">
                            <Heart className="h-3 w-3 mr-1" />
                            {week.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center text-green-600">
                            <Share2 className="h-3 w-3 mr-1" />
                            {week.shares}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Videos */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Videos</CardTitle>
                  <CardDescription>Your most viewed content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topVideos.map((video, index) => (
                      <div key={video.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{video.title}</h4>
                          <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {video.analytics?.views.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {video.analytics?.likes.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {video.template}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-yellow-500" />
                    Best Performing Template
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">Dynamic Energy</div>
                    <p className="text-sm text-gray-600 mb-4">
                      Average 45K views per video
                    </p>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      +23% above average
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    Peak Posting Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">2:00 PM</div>
                    <p className="text-sm text-gray-600 mb-4">
                      Weekdays get 2.3x more engagement
                    </p>
                    <Badge className="bg-blue-100 text-blue-800">
                      Optimal timing
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-500" />
                    Audience Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">+1,247</div>
                    <p className="text-sm text-gray-600 mb-4">
                      New followers this month
                    </p>
                    <Badge className="bg-green-100 text-green-800">
                      +18% growth rate
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                  <CardDescription>Who's watching your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>18-24 years</span>
                        <span>35%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>25-34 years</span>
                        <span>42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>35-44 years</span>
                        <span>18%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>45+ years</span>
                        <span>5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Locations</CardTitle>
                  <CardDescription>Where your audience is located</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { country: 'United States', percentage: 45, flag: '🇺🇸' },
                      { country: 'United Kingdom', percentage: 18, flag: '🇬🇧' },
                      { country: 'Canada', percentage: 12, flag: '🇨🇦' },
                      { country: 'Australia', percentage: 8, flag: '🇦🇺' },
                      { country: 'Germany', percentage: 7, flag: '🇩🇪' },
                      { country: 'Others', percentage: 10, flag: '🌍' },
                    ].map((location, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{location.flag}</span>
                          <span className="text-sm font-medium">{location.country}</span>
                        </div>
                        <span className="text-sm text-gray-600">{location.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Content Trends Analysis
                </CardTitle>
                <CardDescription>
                  Insights based on your content performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-600">What's Working</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Videos with trending music get 2.3x more views
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Educational content has 85% higher engagement
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Videos under 30 seconds perform best
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Dynamic templates increase shares by 40%
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-orange-600">Areas for Improvement</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Try posting during peak hours (2-4 PM)
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Experiment with more lifestyle content
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Add more call-to-actions in videos
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Consider using trending hashtags
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upgrade CTA for Free Users */}
        {user.tier === 'free' && (
          <Card className="bg-gradient-to-r from-purple-50 to-orange-50 border-purple-200">
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Unlock Advanced Analytics
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get detailed insights, competitor analysis, and AI-powered recommendations 
                to grow your audience faster.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}