'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Play, 
  Search, 
  Filter,
  TrendingUp,
  Video,
  Zap,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const MOCK_TEMPLATES = [
  {
    id: 'trending',
    name: 'Trending Now',
    description: 'Bold text overlays with trending music',
    category: 'Popular',
    preview: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    uses: 12500,
    rating: 4.8,
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Clean layout with subtle animations',
    category: 'Business',
    preview: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    uses: 8900,
    rating: 4.6,
  },
  {
    id: 'dynamic',
    name: 'Dynamic Energy',
    description: 'High-energy transitions and effects',
    category: 'Entertainment',
    preview: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    uses: 15200,
    rating: 4.9,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Business-focused clean design',
    category: 'Business',
    preview: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    uses: 6700,
    rating: 4.7,
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    description: 'Narrative-focused with smooth transitions',
    category: 'Educational',
    preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    uses: 4300,
    rating: 4.5,
  },
  {
    id: 'viral-hook',
    name: 'Viral Hook',
    description: 'Attention-grabbing opening sequences',
    category: 'Popular',
    preview: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    uses: 9800,
    rating: 4.8,
  },
  {
    id: 'educational',
    name: 'Educational',
    description: 'Clear, informative layout for tutorials',
    category: 'Educational',
    preview: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    uses: 7100,
    rating: 4.4,
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    description: 'Perfect for product demonstrations',
    category: 'Business',
    preview: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    uses: 5600,
    rating: 4.6,
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    description: 'Casual, relatable content style',
    category: 'Lifestyle',
    preview: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    uses: 11200,
    rating: 4.7,
  },
  {
    id: 'tech-review',
    name: 'Tech Review',
    description: 'Modern tech-focused design',
    category: 'Tech',
    preview: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    uses: 3900,
    rating: 4.5,
  },
  {
    id: 'motivational',
    name: 'Motivational',
    description: 'Inspiring quotes and messages',
    category: 'Lifestyle',
    preview: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    uses: 13400,
    rating: 4.8,
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'High-energy gaming content style',
    category: 'Entertainment',
    preview: 'https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    uses: 8700,
    rating: 4.9,
  },
];

const categories = ['All', 'Popular', 'Business', 'Entertainment', 'Educational', 'Lifestyle', 'Tech'];

export default function TemplatesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const filteredTemplates = MOCK_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesPremium = !showPremiumOnly || template.isPremium;
    
    return matchesSearch && matchesCategory && matchesPremium;
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = MOCK_TEMPLATES.find(t => t.id === templateId);
    if (template?.isPremium && user?.tier === 'free') {
      toast.error('This template requires a Pro subscription');
      return;
    }
    
    // Redirect to create page with template pre-selected
    window.location.href = `/create?template=${templateId}`;
  };

  const TemplateCard = ({ template }: { template: typeof MOCK_TEMPLATES[0] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        template.isPremium && user?.tier === 'free' ? 'opacity-75' : ''
      }`}>
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img
            src={template.preview}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <Button
              size="sm"
              className="opacity-0 hover:opacity-100 transition-opacity duration-300"
              onClick={() => handleTemplateSelect(template.id)}
            >
              <Play className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </div>
          {template.isPremium && (
            <div className="absolute top-2 right-2">
              <Crown className="h-5 w-5 text-yellow-500" />
            </div>
          )}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="text-xs">
              {template.category}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            {template.isPremium && (
              <Badge className="bg-gradient-to-r from-purple-600 to-orange-500 text-white text-xs">
                Pro
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Video className="h-3 w-3 mr-1" />
                {template.uses.toLocaleString()} uses
              </span>
              <span className="flex items-center">
                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                {template.rating}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-purple-600 hover:text-purple-700"
              onClick={() => handleTemplateSelect(template.id)}
            >
              Use Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const content = (
    <div className="space-y-8">
      {/* Back Button - Only show for non-authenticated users */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/">
            <Button variant="ghost" className="flex items-center text-gray-600 hover:text-purple-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Video className="h-4 w-4 mr-2" />
            Video Templates
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-orange-500 bg-clip-text text-transparent mb-4">
            Choose Your Style
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional templates designed to maximize engagement across all platforms
          </p>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={showPremiumOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              >
                <Crown className="h-4 w-4 mr-2" />
                Pro Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs md:text-sm">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No templates found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Upgrade CTA for Free Users */}
      {user?.tier === 'free' && (
        <Card className="bg-gradient-to-r from-purple-50 to-orange-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Unlock Premium Templates
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get access to our entire library of professional templates, including exclusive 
              designs for viral content, business presentations, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                View Free Templates Only
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Show different layout based on user authentication
  if (user) {
    return (
      <DashboardLayout>
        {content}
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Navigation />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {content}
          
          {/* CTA for non-authenticated users */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-purple-600 to-orange-500 text-white">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
                <p className="text-xl mb-6 opacity-90">
                  Sign up now and get 3 free video exports to try any template
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" variant="secondary">
                      <Zap className="h-4 w-4 mr-2" />
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-purple-600">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}