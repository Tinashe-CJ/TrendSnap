'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Video {
  id: string;
  title: string;
  script: string;
  status: 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  thumbnailUrl?: string;
  watermarked: boolean;
  template: string;
  voiceType: string;
  createdAt: string;
  expiresAt?: string;
  tier: 'free' | 'pro' | 'team' | 'enterprise';
  analytics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

interface VideoContextType {
  videos: Video[];
  generateVideo: (data: {
    script: string;
    template: string;
    voiceType: string;
    title: string;
  }) => Promise<{ success: boolean; videoId?: string; error?: string }>;
  deleteVideo: (videoId: string) => void;
  exportVideo: (videoId: string) => Promise<{ success: boolean; error?: string }>;
  isGenerating: boolean;
}

const VideoContext = createContext<VideoContextType | null>(null);

const MOCK_TEMPLATES = [
  { id: 'trending', name: 'Trending Now', preview: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 'minimal', name: 'Minimal', preview: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 'dynamic', name: 'Dynamic', preview: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 'professional', name: 'Professional', preview: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateVideo = async (data: {
    script: string;
    template: string;
    voiceType: string;
    title: string;
  }): Promise<{ success: boolean; videoId?: string; error?: string }> => {
    setIsGenerating(true);

    // Simulate AI video generation delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const videoId = Math.random().toString(36).substring(7);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours for free tier

    const newVideo: Video = {
      id: videoId,
      title: data.title,
      script: data.script,
      status: 'completed',
      fileUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnailUrl: MOCK_TEMPLATES.find(t => t.id === data.template)?.preview || MOCK_TEMPLATES[0].preview,
      watermarked: true, // Always watermarked for free tier in this demo
      template: data.template,
      voiceType: data.voiceType,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      tier: 'free',
      analytics: {
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 200),
      }
    };

    setVideos(prev => [newVideo, ...prev]);
    setIsGenerating(false);

    return { success: true, videoId };
  };

  const deleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  const exportVideo = async (videoId: string) => {
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const video = videos.find(v => v.id === videoId);
    if (!video) {
      return { success: false, error: 'Video not found' };
    }

    // Create download link (mock)
    const link = document.createElement('a');
    link.href = video.fileUrl || '';
    link.download = `${video.title.replace(/[^a-z0-9]/gi, '_')}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true };
  };

  return (
    <VideoContext.Provider value={{
      videos,
      generateVideo,
      deleteVideo,
      exportVideo,
      isGenerating,
    }}>
      {children}
    </VideoContext.Provider>
  );
}

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};