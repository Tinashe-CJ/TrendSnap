'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useVideo } from '@/lib/video-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Archive, 
  Search, 
  Filter,
  Download,
  Share2,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Video,
  Play,
  MoreHorizontal,
  Calendar,
  Grid,
  List
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LockerPage() {
  const { user } = useAuth();
  const { videos, deleteVideo, exportVideo } = useVideo();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const filteredVideos = videos
    .filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.script.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || video.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'views':
          return (b.analytics?.views || 0) - (a.analytics?.views || 0);
        case 'likes':
          return (b.analytics?.likes || 0) - (a.analytics?.likes || 0);
        default:
          return 0;
      }
    });

  const handleDelete = async (videoId: string) => {
    if (confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      deleteVideo(videoId);
      toast.success('Video deleted successfully');
    }
  };

  const handleExport = async (videoId: string) => {
    const result = await exportVideo(videoId);
    if (result.success) {
      toast.success('Video exported successfully');
    } else {
      toast.error(result.error || 'Failed to export video');
    }
  };

  const handleShare = (video: any) => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Check out my video: ${video.title}`,
        url: video.fileUrl,
      });
    } else {
      navigator.clipboard.writeText(video.fileUrl || '');
      toast.success('Video link copied to clipboard');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const VideoCard = ({ video }: { video: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-video bg-gray-100">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Video className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Overlay with play button */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <Button
              size="sm"
              className="opacity-0 hover:opacity-100 transition-opacity duration-300"
              onClick={() => window.open(video.fileUrl, '_blank')}
            >
              <Play className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>

          {/* Status badge */}
          <div className="absolute top-2 left-2">
            <Badge className={getStatusColor(video.status)}>
              {video.status}
            </Badge>
          </div>

          {/* Watermark indicator */}
          {video.watermarked && (
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-white/90">
                Watermarked
              </Badge>
            </div>
          )}

          {/* Actions dropdown */}
          <div className="absolute bottom-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport(video.id)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare(video)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleDelete(video.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{video.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.script}</p>
          
          {/* Analytics */}
          {video.analytics && (
            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {video.analytics.views.toLocaleString()}
              </span>
              <span className="flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                {video.analytics.likes.toLocaleString()}
              </span>
              <span className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                {video.analytics.comments.toLocaleString()}
              </span>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {video.template}
              </Badge>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(video.createdAt).toLocaleDateString()}
              </span>
            </div>
            {video.expiresAt && (
              <span className="text-orange-600">
                Expires {new Date(video.expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const VideoListItem = ({ video }: { video: any }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Thumbnail */}
            <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg truncate pr-4">{video.title}</h3>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(video.status)}>
                    {video.status}
                  </Badge>
                  {video.watermarked && (
                    <Badge variant="outline">Watermarked</Badge>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-1">{video.script}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  {video.analytics && (
                    <>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {video.analytics.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {video.analytics.likes.toLocaleString()}
                      </span>
                    </>
                  )}
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {video.template}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(video.fileUrl, '_blank')}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExport(video.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleShare(video)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(video.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Video Locker</h1>
            <p className="text-gray-600 mt-1">
              Manage and organize your created videos
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="views">Most Views</option>
                  <option value="likes">Most Likes</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Videos Grid/List */}
        {filteredVideos.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredVideos.map((video) => (
              viewMode === 'grid' ? (
                <VideoCard key={video.id} video={video} />
              ) : (
                <VideoListItem key={video.id} video={video} />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Archive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchQuery || filterStatus !== 'all' ? 'No videos found' : 'No videos yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first video to get started'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Button onClick={() => router.push('/create')}>
                Create Your First Video
              </Button>
            )}
          </div>
        )}

        {/* Storage Info for Free Users */}
        {user.tier === 'free' && videos.length > 0 && (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-orange-800 mb-1">
                    Free Tier Storage Limit
                  </h3>
                  <p className="text-sm text-orange-700">
                    Your videos are stored for 48 hours. Upgrade to Pro for 30-day storage.
                  </p>
                </div>
                <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}