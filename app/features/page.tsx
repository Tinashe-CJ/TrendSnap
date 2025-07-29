'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  Video, 
  Volume2, 
  Type,
  Crown,
  Users,
  BarChart3,
  Download,
  Share2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ArrowLeft } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'AI-Powered Generation',
    description: 'Transform any script into viral videos in under 30 seconds using advanced AI technology.',
    category: 'Core',
    benefits: [
      'Lightning-fast video creation',
      'Advanced AI script analysis',
      'Automated B-roll matching',
      'Smart scene transitions'
    ]
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: 'Trend Integration',
    description: 'Automatically incorporate the latest trends from TikTok, Instagram, and YouTube.',
    category: 'Core',
    benefits: [
      'Real-time trend detection',
      'Viral template suggestions',
      'Trending audio integration',
      'Platform-specific optimization'
    ]
  },
  {
    icon: <Video className="h-8 w-8" />,
    title: 'Professional Templates',
    description: 'Choose from 50+ professionally designed templates optimized for engagement.',
    category: 'Design',
    benefits: [
      '50+ premium templates',
      'Customizable layouts',
      'Brand kit integration',
      'Mobile-optimized designs'
    ]
  },
  {
    icon: <Volume2 className="h-8 w-8" />,
    title: 'AI Voices',
    description: 'Natural-sounding AI voices in multiple languages and emotional tones.',
    category: 'Audio',
    benefits: [
      '15+ realistic AI voices',
      'Emotion control',
      'Multi-language support',
      'Custom voice cloning'
    ]
  },
  {
    icon: <Type className="h-8 w-8" />,
    title: 'Dynamic Captions',
    description: 'Auto-generated captions with perfect timing and engaging animations.',
    category: 'Design',
    benefits: [
      'Auto-generated captions',
      'Perfect timing sync',
      'Custom animations',
      'Emoji integration'
    ]
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Anti-Abuse Protection',
    description: 'Robust fraud prevention ensures fair usage and platform integrity.',
    category: 'Security',
    benefits: [
      'Advanced fraud detection',
      'Device fingerprinting',
      'Usage monitoring',
      'Fair access policies'
    ]
  },
  {
    icon: <Crown className="h-8 w-8" />,
    title: 'HD/4K Export',
    description: 'Export your videos in stunning HD and 4K quality without watermarks.',
    category: 'Export',
    benefits: [
      'Up to 4K resolution',
      'No watermarks',
      'Multiple formats',
      'Instant downloads'
    ],
    isPro: true
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Team Collaboration',
    description: 'Work together with your team on video projects and share assets.',
    category: 'Collaboration',
    benefits: [
      'Multi-user accounts',
      'Asset sharing',
      'Team analytics',
      'Client presentation tools'
    ],
    isPro: true
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: 'Advanced Analytics',
    description: 'Track performance and optimize your content strategy with detailed insights.',
    category: 'Analytics',
    benefits: [
      'Performance tracking',
      'Engagement metrics',
      'Trend analysis',
      'ROI measurement'
    ],
    isPro: true
  }
];

const categories = ['All', 'Core', 'Design', 'Audio', 'Export', 'Security', 'Collaboration', 'Analytics'];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Navigation />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/">
              <Button variant="ghost" className="flex items-center text-gray-600 hover:text-purple-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Powerful Features
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-orange-500 bg-clip-text text-transparent mb-6">
              Everything You Need
              <br />
              to Go Viral
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              From AI-powered generation to advanced analytics, TrendSnap provides all the tools you need to create engaging content that performs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-4">
                  Start Creating Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="px-8 py-4">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                        feature.isPro 
                          ? 'bg-gradient-to-r from-purple-100 to-orange-100 text-purple-600' 
                          : 'bg-purple-100 text-purple-600'
                      } group-hover:scale-110 transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {feature.category}
                        </Badge>
                        {feature.isPro && (
                          <Badge className="bg-gradient-to-r from-purple-600 to-orange-500 text-white text-xs">
                            Pro
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Built for Modern Creators
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Every feature is designed to help you create better content faster
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600">
                  Generate professional videos in under 30 seconds with our optimized AI pipeline.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Export Ready</h3>
                <p className="text-gray-600">
                  Download in multiple formats optimized for every social media platform.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Share Anywhere</h3>
                <p className="text-gray-600">
                  Direct publishing to TikTok, Instagram, YouTube, and more social platforms.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-r from-purple-600 to-orange-500 rounded-2xl p-8 md:p-12 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Create Your First Viral Video?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators already using TrendSnap to grow their audience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="px-8 py-4">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="px-8 py-4 border-white text-black hover:bg-white hover:text-purple-600">
                  View All Plans
                </Button>
              </Link>
            </div>
            <p className="text-sm mt-4 opacity-75">
              No credit card required • 3 free video exports
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}