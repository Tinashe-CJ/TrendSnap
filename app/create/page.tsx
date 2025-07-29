'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useVideo } from '@/lib/video-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Wand2, 
  TrendingUp, 
  Video, 
  Volume2, 
  Type,
  AlertTriangle,
  Crown,
  Loader2,
  Sparkles
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { toast } from 'sonner';

const MOCK_TRENDS = [
  {
    id: 'trend1',
    title: 'AI Mind Reading Experiment',
    category: 'Tech',
    engagement: '2.3M views',
    hashtags: ['#AI', '#MindReading', '#Tech'],
  },
  {
    id: 'trend2',
    title: 'Life Hacks That Actually Work',
    category: 'Lifestyle',
    engagement: '1.8M views',
    hashtags: ['#LifeHacks', '#Productivity', '#Tips'],
  },
  {
    id: 'trend3',
    title: 'Millionaire Morning Routine',
    category: 'Business',
    engagement: '3.1M views',
    hashtags: ['#Millionaire', '#MorningRoutine', '#Success'],
  },
];

const MOCK_TEMPLATES = [
  {
    id: 'trending',
    name: 'Trending Now',
    description: 'Bold text overlays with trending music',
    preview: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Clean layout with subtle animations',
    preview: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'dynamic',
    name: 'Dynamic Energy',
    description: 'High-energy transitions and effects',
    preview: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Business-focused clean design',
    preview: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300',
    isPremium: true,
  },
];

const VOICE_OPTIONS = [
  { id: 'sarah', name: 'Sarah', type: 'Female, Conversational' },
  { id: 'marcus', name: 'Marcus', type: 'Male, Energetic' },
  { id: 'alex', name: 'Alex', type: 'Neutral, Professional' },
  { id: 'emma', name: 'Emma', type: 'Female, Friendly', isPremium: true },
  { id: 'james', name: 'James', type: 'Male, Authoritative', isPremium: true },
];

export default function CreateVideoPage() {
  const { user, updateCredits } = useAuth();
  const { generateVideo, isGenerating } = useVideo();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    script: '',
    template: 'trending',
    voice: 'sarah',
    inputMethod: 'script' as 'script' | 'trend',
    selectedTrend: '',
  });

  const [showLegalWarning, setShowLegalWarning] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.credits <= 0 && user.tier === 'free') {
      toast.error('You have no credits remaining. Please upgrade to continue.');
      router.push('/pricing');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleTrendSelect = (trendId: string) => {
    const trend = MOCK_TRENDS.find(t => t.id === trendId);
    if (trend) {
      setFormData(prev => ({
        ...prev,
        selectedTrend: trendId,
        title: trend.title,
        script: `Create a viral video about: ${trend.title}. Make it engaging and trending on social media.`,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.script) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (user.tier === 'free' && formData.script.length > 500) {
      toast.error('Free tier is limited to 500 characters. Please shorten your script or upgrade.');
      return;
    }

    // Show legal warning for free tier
    if (user.tier === 'free' && !showLegalWarning) {
      setShowLegalWarning(true);
      return;
    }

    try {
      const result = await generateVideo({
        title: formData.title,
        script: formData.script,
        template: formData.template,
        voiceType: formData.voice,
      });

      if (result.success) {
        // Decrease credits for free tier
        if (user.tier === 'free') {
          updateCredits(user.credits - 1);
        }
        
        toast.success('Video generated successfully!');
        router.push('/locker');
      } else {
        toast.error(result.error || 'Failed to generate video');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const selectedTemplate = MOCK_TEMPLATES.find(t => t.id === formData.template);
  const selectedVoice = VOICE_OPTIONS.find(v => v.id === formData.voice);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Video</h1>
          <p className="text-gray-600">
            Transform your ideas into viral videos using AI
          </p>
        </div>

        {/* Credits Warning */}
        {user.tier === 'free' && user.credits <= 1 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have {user.credits} credit{user.credits !== 1 ? 's' : ''} remaining. 
              <Button variant="link" className="p-0 ml-1 h-auto" onClick={() => router.push('/pricing')}>
                Upgrade for unlimited generations
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Input Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wand2 className="h-5 w-5 mr-2" />
                Input Method
              </CardTitle>
              <CardDescription>
                Choose how you'd like to start creating your video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={formData.inputMethod} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, inputMethod: value as any }))}
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="script">Write Script</TabsTrigger>
                  <TabsTrigger value="trend">Use Trending Topic</TabsTrigger>
                </TabsList>
                
                <TabsContent value="script" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Video Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a catchy title for your video"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="script">
                      Script Content
                      {user.tier === 'free' && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({formData.script.length}/500 characters)
                        </span>
                      )}
                    </Label>
                    <Textarea
                      id="script"
                      placeholder="Write your video script here. Describe what you want to communicate..."
                      value={formData.script}
                      onChange={(e) => setFormData(prev => ({ ...prev, script: e.target.value }))}
                      rows={4}
                      maxLength={user.tier === 'free' ? 500 : undefined}
                      required
                    />
                    {user.tier === 'free' && formData.script.length > 450 && (
                      <p className="text-sm text-orange-600">
                        Approaching character limit. Upgrade for unlimited characters.
                      </p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="trend" className="space-y-4 mt-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_TRENDS.map((trend) => (
                      <Card 
                        key={trend.id}
                        className={`cursor-pointer transition-all ${
                          formData.selectedTrend === trend.id 
                            ? 'ring-2 ring-purple-500 bg-purple-50' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handleTrendSelect(trend.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {trend.category}
                            </Badge>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          </div>
                          <h3 className="font-semibold text-sm mb-2">{trend.title}</h3>
                          <p className="text-xs text-gray-600 mb-2">{trend.engagement}</p>
                          <div className="flex flex-wrap gap-1">
                            {trend.hashtags.map((tag) => (
                              <span key={tag} className="text-xs text-blue-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {formData.selectedTrend && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="trend-script">Customize Script (Optional)</Label>
                      <Textarea
                        id="trend-script"
                        placeholder="Modify the generated script or add your own twist..."
                        value={formData.script}
                        onChange={(e) => setFormData(prev => ({ ...prev, script: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Choose Template
              </CardTitle>
              <CardDescription>
                Select a style that matches your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_TEMPLATES.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      formData.template === template.id
                        ? 'ring-2 ring-purple-500'
                        : 'hover:shadow-md'
                    } ${
                      template.isPremium && user.tier === 'free'
                        ? 'opacity-50'
                        : ''
                    }`}
                    onClick={() => {
                      if (template.isPremium && user.tier === 'free') {
                        toast.error('This template requires a Pro subscription');
                        return;
                      }
                      setFormData(prev => ({ ...prev, template: template.id }));
                    }}
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={template.preview}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      {template.isPremium && (
                        <div className="absolute top-2 right-2">
                          <Crown className="h-4 w-4 text-yellow-500" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm mb-1">
                        {template.name}
                        {template.isPremium && (
                          <Badge variant="outline" className="ml-2 text-xs">Pro</Badge>
                        )}
                      </h3>
                      <p className="text-xs text-gray-600">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Voice Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="h-5 w-5 mr-2" />
                AI Voice
              </CardTitle>
              <CardDescription>
                Choose the voice for your video narration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.voice}
                onValueChange={(value) => setFormData(prev => ({ ...prev, voice: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_OPTIONS.map((voice) => (
                    <SelectItem 
                      key={voice.id} 
                      value={voice.id}
                      disabled={voice.isPremium && user.tier === 'free'}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <span className="font-medium">{voice.name}</span>
                          <span className="text-sm text-gray-500 ml-2">{voice.type}</span>
                        </div>
                        {voice.isPremium && (
                          <Crown className="h-3 w-3 text-yellow-500 ml-2" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Preview Card */}
          {formData.title && formData.script && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold">{formData.title}</h3>
                  <p className="text-sm text-gray-700 line-clamp-3">{formData.script}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Template: {selectedTemplate?.name}</span>
                    <span>Voice: {selectedVoice?.name}</span>
                    <span>Quality: {user.tier === 'free' ? 'SD (720p)' : 'HD (1080p)'}</span>
                  </div>
                  {user.tier === 'free' && (
                    <Badge variant="outline" className="text-xs">
                      Will include watermark
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Legal Warning for Free Tier */}
          {showLegalWarning && user.tier === 'free' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Important Legal Notice</p>
                  <p className="text-sm">
                    Free tier videos include watermarks and are subject to fair use policies. 
                    By proceeding, you agree to our terms of service and content guidelines.
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isGenerating}
                    >
                      I Understand, Continue
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLegalWarning(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          {!showLegalWarning && (
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isGenerating || !formData.title || !formData.script}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Video ({user.tier === 'free' ? '1 Credit' : 'Unlimited'})
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}