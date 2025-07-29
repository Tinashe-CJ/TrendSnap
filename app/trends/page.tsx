'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Search, Filter, Play, Eye, Heart, Share2, Clock, Siren as Fire, Zap, Users, Globe } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import Link from 'next/link';

const MOCK_TRENDS = [
  {
    id: 'trend1',
    title: 'AI Mind Reading Experiment',
    description: 'Scientists create AI that can read thoughts with 90% accuracy',
    category: 'Tech',
    platform: 'TikTok',
    engagement: '2.3M views',
    growth: '+245%',
    hashtags: ['#AI', '#MindReading', '#Tech', '#Science'],
    thumbnail: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
    trending_score: 95,
    duration: '15-30s',
    difficulty: 'Easy'
  },
  {
    id: 'trend2',
    title: 'Life Hacks That Actually Work',
    description: '5 simple tricks that will change your daily routine forever',
    category: 'Lifestyle',
    platform: 'Instagram',
    engagement: '1.8M views',
    growth: '+180%',
    hashtags: ['#LifeHacks', '#Productivity', '#Tips', '#Viral'],
    thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    trending_score: 88,
    duration: '30-60s',
    difficulty: 'Easy'
  },
  {
    id: 'trend3',
    title: 'Millionaire Morning Routine',
    description: 'The exact morning routine that made me a millionaire',
    category: 'Business',
    platform: 'YouTube',
    engagement: '3.1M views',
    growth: '+320%',
    hashtags: ['#Millionaire', '#MorningRoutine', '#Success', '#Motivation'],
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    trending_score: 92,
    duration: '60-90s',
    difficulty: 'Medium'
  },
  {
    id: 'trend4',
    title: 'Secret Menu Items Revealed',
    description: 'Hidden menu items at popular restaurants you never knew existed',
    category: 'Food',
    platform: 'TikTok',
    engagement: '4.2M views',
    growth: '+410%',
    hashtags: ['#SecretMenu', '#Food', '#Restaurant', '#Hidden'],
    thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
    trending_score: 97,
    duration: '15-30s',
    difficulty: 'Easy'
  },
  {
    id: 'trend5',
    title: 'Workout in 5 Minutes',
    description: 'Full body workout that takes only 5 minutes but burns 200 calories',
    category: 'Fitness',
    platform: 'Instagram',
    engagement: '2.7M views',
    growth: '+290%',
    hashtags: ['#Workout', '#Fitness', '#5Minutes', '#QuickFit'],
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    trending_score: 85,
    duration: '30-60s',
    difficulty: 'Medium'
  },
  {
    id: 'trend6',
    title: 'Phone Photography Secrets',
    description: 'Professional photography tricks using only your smartphone',
    category: 'Photography',
    platform: 'YouTube',
    engagement: '1.9M views',
    growth: '+165%',
    hashtags: ['#Photography', '#Phone', '#Tips', '#Professional'],
    thumbnail: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
    trending_score: 82,
    duration: '60-90s',
    difficulty: 'Hard'
  }
];

const categories = ['All', 'Tech', 'Lifestyle', 'Business', 'Food', 'Fitness', 'Photography'];
const platforms = ['All', 'TikTok', 'Instagram', 'YouTube'];

export default function TrendsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [sortBy, setSortBy] = useState('trending_score');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const filteredTrends = MOCK_TRENDS
    .filter(trend => {
      const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trend.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trend.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || trend.category === selectedCategory;
      const matchesPlatform = selectedPlatform === 'All' || trend.platform === selectedPlatform;
      return matchesSearch && matchesCategory && matchesPlatform;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'trending_score':
          return b.trending_score - a.trending_score;
        case 'engagement':
          return parseFloat(b.engagement.replace(/[^\d.]/g, '')) - parseFloat(a.engagement.replace(/[^\d.]/g, ''));
        case 'growth':
          return parseFloat(b.growth.replace(/[^\d.]/g, '')) - parseFloat(a.growth.replace(/[^\d.]/g, ''));
        default:
          return 0;
      }
    });

  const handleCreateFromTrend = (trend: any) => {
    // Redirect to create page with trend data
    const params = new URLSearchParams({
      trend: trend.id,
      title: trend.title,
      description: trend.description
    });
    router.push(`/create?${params.toString()}`);
  };

  const TrendCard = ({ trend }: { trend: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-video bg-gray-100">
          <img
            src={trend.thumbnail}
            alt={trend.title}
            className="w-full h-full object-cover"
          />
          
          {/* Trending score badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-500 text-white flex items-center">
              <Fire className="h-3 w-3 mr-1" />
              {trend.trending_score}
            </Badge>
          </div>

          {/* Platform badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90">
              {trend.platform}
            </Badge>
          </div>

          {/* Play overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <Button
              size="sm"
              className="opacity-0 hover:opacity-100 transition-opacity duration-300"
              onClick={() => handleCreateFromTrend(trend)}
            >
              <Play className="h-4 w-4 mr-2" />
              Use Trend
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{trend.title}</h3>
            <Badge variant="outline" className="ml-2 text-xs">
              {trend.category}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{trend.description}</p>
          
          {/* Engagement metrics */}
          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {trend.engagement}
            </span>
            <span className="flex items-center text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend.growth}
            </span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {trend.duration}
            </span>
          </div>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {trend.hashtags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            {trend.hashtags.length > 3 && (
              <span className="text-xs text-gray-500">+{trend.hashtags.length - 3} more</span>
            )}
          </div>

          {/* Difficulty and action */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`text-xs ${
                trend.difficulty === 'Easy' ? 'border-green-300 text-green-700' :
                trend.difficulty === 'Medium' ? 'border-yellow-300 text-yellow-700' :
                'border-red-300 text-red-700'
              }`}
            >
              {trend.difficulty}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700"
              onClick={() => handleCreateFromTrend(trend)}
            >
              Create Video
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending Now
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-orange-500 bg-clip-text text-transparent mb-4">
              Viral Trends
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what's trending across social media platforms and create your own viral content
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Fire className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-gray-600">Hot Trends</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-gray-600">Platforms</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">15M+</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">Updated</div>
                <div className="text-sm text-gray-600">Real-time</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search trends, hashtags, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="trending_score">Trending Score</option>
                  <option value="engagement">Most Views</option>
                  <option value="growth">Highest Growth</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trends Grid */}
        {filteredTrends.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrends.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No trends found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-orange-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Ready to Create Your Viral Video?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Pick any trending topic and let our AI transform it into engaging content that performs.
            </p>
            <Link href="/create">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Zap className="h-4 w-4 mr-2" />
                Start Creating
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}