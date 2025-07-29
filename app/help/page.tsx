'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ArrowLeft } from 'lucide-react';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I create my first video?',
        answer: 'After signing up, click "New Video" from your dashboard. Enter your script or choose a trending topic, select a template and voice, then click "Generate Video". Your first video will be ready in under 30 seconds!'
      },
      {
        question: 'What comes with the free trial?',
        answer: 'New users get 3 free video exports in SD quality (720p) with watermarks. Videos are stored for 48 hours and include access to basic templates and AI voices.'
      },
      {
        question: 'How long does video generation take?',
        answer: 'Most videos are generated in under 30 seconds. HD and 4K videos may take slightly longer depending on complexity and current system load.'
      }
    ]
  },
  {
    category: 'Account & Billing',
    questions: [
      {
        question: 'How do I upgrade my account?',
        answer: 'Go to Settings > Billing or click any "Upgrade" button throughout the app. Choose your plan and complete the payment process. Your upgrade takes effect immediately.'
      },
      {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel your subscription at any time from your billing settings. Your plan will remain active until the end of your current billing period.'
      },
      {
        question: 'Do you offer refunds?',
        answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact our support team if you\'re not satisfied with your experience.'
      }
    ]
  },
  {
    category: 'Video Creation',
    questions: [
      {
        question: 'What video formats do you support?',
        answer: 'We export videos in MP4 format optimized for TikTok, YouTube Shorts, Instagram Reels, and Facebook. Different aspect ratios (9:16, 1:1, 16:9) are available.'
      },
      {
        question: 'Can I remove the watermark?',
        answer: 'Watermarks are automatically removed when you upgrade to any paid plan (Pro, Team, or Enterprise). Free tier videos always include our watermark.'
      },
      {
        question: 'How do I use trending topics?',
        answer: 'In the video creator, switch to the "Trending Topics" tab to see current viral content ideas. Click any trend to auto-populate your script with optimized content.'
      }
    ]
  },
  {
    category: 'Technical Issues',
    questions: [
      {
        question: 'My video generation failed. What should I do?',
        answer: 'First, try generating the video again. If it continues to fail, check your internet connection and try shortening your script. Contact support if the issue persists.'
      },
      {
        question: 'Why can\'t I access certain templates?',
        answer: 'Premium templates are only available to Pro, Team, and Enterprise users. Upgrade your account to access our full template library.'
      },
      {
        question: 'How do I download my videos?',
        answer: 'Go to "My Locker" and click the download button next to any completed video. Videos are available for download based on your plan\'s storage duration.'
      }
    ]
  }
];

const tutorials = [
  {
    title: 'Getting Started with TrendSnap',
    description: 'Learn the basics of creating your first viral video',
    duration: '5 min',
    thumbnail: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    title: 'Using Trending Topics Effectively',
    description: 'How to leverage our trend engine for maximum reach',
    duration: '8 min',
    thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    title: 'Advanced Template Customization',
    description: 'Make templates your own with custom branding',
    duration: '12 min',
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    title: 'Team Collaboration Features',
    description: 'Working with your team on video projects',
    duration: '10 min',
    thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQs = faqs.filter(category => {
    if (selectedCategory !== 'all' && category.category.toLowerCase() !== selectedCategory) {
      return false;
    }
    
    if (searchQuery) {
      return category.questions.some(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Navigation />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
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
              <HelpCircle className="h-4 w-4 mr-2" />
              Help Center
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-orange-500 bg-clip-text text-transparent mb-6">
              How Can We Help?
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find answers to common questions, watch tutorials, or get in touch with our support team
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help articles, tutorials, or FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-4 text-lg"
              />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Book className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Documentation</h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive guides and API documentation
                  </p>
                  <Button variant="outline">
                    Browse Docs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Video Tutorials</h3>
                  <p className="text-gray-600 mb-4">
                    Step-by-step video guides for all features
                  </p>
                  <Button variant="outline">
                    Watch Tutorials
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Contact Support</h3>
                  <p className="text-gray-600 mb-4">
                    Get help from our friendly support team
                  </p>
                  <Button variant="outline">
                    Get Support
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="faq" className="space-y-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-8">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All Categories
                </Button>
                {faqs.map((category) => (
                  <Button
                    key={category.category}
                    variant={selectedCategory === category.category.toLowerCase() ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.category.toLowerCase())}
                  >
                    {category.category}
                  </Button>
                ))}
              </div>

              {/* FAQ Content */}
              <div className="space-y-8">
                {filteredFAQs.map((category, categoryIndex) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {category.category}
                    </h2>
                    <div className="space-y-4">
                      {category.questions.map((faq, index) => (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {faq.question}
                            </h3>
                            <p className="text-gray-600 ml-7">
                              {faq.answer}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tutorials Tab */}
            <TabsContent value="tutorials" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Video Tutorials
                </h2>
                <p className="text-xl text-gray-600">
                  Learn TrendSnap with our comprehensive video guides
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {tutorials.map((tutorial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={tutorial.thumbnail}
                          alt={tutorial.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                            <Video className="h-8 w-8 text-purple-600 ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {tutorial.duration}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">
                          {tutorial.title}
                        </h3>
                        <p className="text-gray-600">
                          {tutorial.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Get in Touch
                </h2>
                <p className="text-xl text-gray-600">
                  Our support team is here to help you succeed
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Methods */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <Mail className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Email Support</h3>
                          <p className="text-gray-600">Get help via email</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Send us a detailed message and we'll get back to you within 24 hours.
                      </p>
                      <button className="w-full bg-white border border-gray-300 text-black font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center">
                        Send Email
                        <Mail className="ml-2 h-4 w-4" />
                      </button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                          <MessageCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Live Chat</h3>
                          <p className="text-gray-600">Chat with our team</p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Available Monday-Friday, 9 AM - 6 PM EST for immediate assistance.
                      </p>
                      <Button className="w-full" variant="outline">
                        Start Chat
                        <MessageCircle className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you soon
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          First Name
                        </label>
                        <Input placeholder="John" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Last Name
                        </label>
                        <Input placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Email
                      </label>
                      <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Subject
                      </label>
                      <Input placeholder="How can we help?" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Message
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-md resize-none"
                        rows={4}
                        placeholder="Tell us more about your question or issue..."
                      />
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Send Message
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Still Need Help CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 text-center bg-gradient-to-r from-purple-600 to-orange-500 rounded-2xl p-8 md:p-12 text-white"
          >
            <Zap className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Still Need Help?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Our support team is standing by to help you create amazing videos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}