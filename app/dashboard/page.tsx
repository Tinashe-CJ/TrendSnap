'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useVideo } from '@/lib/video-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Video, 
  Crown, 
  TrendingUp, 
  Clock, 
  Download,
  Eye,
  Heart,
  Share2,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function DashboardPage() {
  const { user } = useAuth();
  const { videos } = useVideo();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const recentVideos = videos.slice(0, 3);
  const totalViews = videos.reduce((sum, video) => sum + (video.analytics?.views || 0), 0);
  const totalLikes = videos.reduce((sum, video) => sum + (video.analytics?.likes || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.name || user.email.split('@')[0]}!
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to create your next viral video?
            </p>
          </div>
          <Link href="/create">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-5 w-5 mr-2" />
              New Video
            </Button>
          </Link>
        </div>

        {/* Credits & Status */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.credits}</div>
              <p className="text-xs text-muted-foreground">
                {user.tier === 'free' ? 'Free tier' : 'Unlimited'}
              </p>
              {user.tier === 'free' && (
                <div className="mt-2">
                  <Progress value={(user.credits / 3) * 100} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{user.tier}</div>
              <p className="text-xs text-muted-foreground">
                {user.tier === 'free' ? 'Upgrade for unlimited' : 'All features unlocked'}
              </p>
              {user.tier === 'free' && (
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="mt-2">
                    Upgrade Now
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos Created</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videos.length}</div>
              <p className="text-xs text-muted-foreground">
                {totalViews.toLocaleString()} total views
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/create">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <h3 className="font-semibold">Create Video</h3>
                <p className="text-sm text-gray-600">Start from script or trend</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/templates">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Video className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <h3 className="font-semibold">Browse Templates</h3>
                <p className="text-sm text-gray-600">Explore viral templates</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/trends">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <h3 className="font-semibold">Trending Now</h3>
                <p className="text-sm text-gray-600">Discover hot trends</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/locker">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                <h3 className="font-semibold">My Locker</h3>
                <p className="text-sm text-gray-600">Manage your videos</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Videos */}
        {recentVideos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Videos</CardTitle>
              <CardDescription>
                Your latest video creations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Video className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold truncate">{video.title}</h3>
                      <p className="text-sm text-gray-600 truncate">{video.script}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {video.analytics?.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {video.analytics?.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="h-3 w-3 mr-1" />
                          {video.analytics?.shares.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={video.status === 'completed' ? 'default' : 'secondary'}>
                        {video.status}
                      </Badge>
                      {video.watermarked && (
                        <Badge variant="outline">Watermarked</Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
              {videos.length > 3 && (
                <div className="mt-4 text-center">
                  <Link href="/locker">
                    <Button variant="outline">View All Videos</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upgrade Prompt for Free Users */}
        {user.tier === 'free' && user.credits <= 1 && (
          <Card className="bg-gradient-to-r from-purple-50 to-orange-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to create unlimited videos?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Upgrade to Pro for unlimited generations, HD quality, and no watermarks.
                  </p>
                  <Link href="/pricing">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:block">
                  <Crown className="h-16 w-16 text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}