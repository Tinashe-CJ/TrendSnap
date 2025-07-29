// Mock Backend System for TrendSnap
import { User } from './auth-context';
import { Video } from './video-context';

// Mock database storage
export class MockDatabase {
  private static instance: MockDatabase;
  private users: User[] = [];
  private videos: Video[] = [];
  private sessions: Map<string, string> = new Map(); // sessionId -> userId
  private analytics: Map<string, any> = new Map();

  private constructor() {
    this.initializeTestData();
  }

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  private initializeTestData() {
    // Create test users
    const testUsers: User[] = [
      {
        id: 'user_001',
        email: 'john.creator@example.com',
        name: 'John Creator',
        tier: 'pro',
        credits: 50,
        createdAt: '2024-01-15T10:30:00Z',
        deviceFingerprint: 'fp_001',
        isVerified: true,
      },
      {
        id: 'user_002',
        email: 'sarah.influencer@example.com',
        name: 'Sarah Influencer',
        tier: 'team',
        credits: 100,
        createdAt: '2024-02-01T14:20:00Z',
        deviceFingerprint: 'fp_002',
        isVerified: true,
      },
      {
        id: 'user_003',
        email: 'mike.newbie@example.com',
        name: 'Mike Newbie',
        tier: 'free',
        credits: 2,
        createdAt: '2024-12-01T09:15:00Z',
        deviceFingerprint: 'fp_003',
        isVerified: true,
      },
      {
        id: 'user_004',
        email: 'emma.agency@example.com',
        name: 'Emma Agency',
        tier: 'enterprise',
        credits: 999,
        createdAt: '2024-01-01T08:00:00Z',
        deviceFingerprint: 'fp_004',
        isVerified: true,
      }
    ];

    // Create test videos for each user
    const testVideos: Video[] = [
      // John Creator's videos
      {
        id: 'vid_001',
        title: 'AI Revolution in 2024',
        script: 'The AI revolution is here and it\'s changing everything. From content creation to business automation, artificial intelligence is transforming how we work and live.',
        status: 'completed',
        fileUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
        watermarked: false,
        template: 'trending',
        voiceType: 'marcus',
        createdAt: '2024-12-10T15:30:00Z',
        tier: 'pro',
        analytics: {
          views: 125000,
          likes: 8500,
          shares: 2100,
          comments: 450
        }
      },
      {
        id: 'vid_002',
        title: 'Morning Routine for Success',
        script: 'Start your day right with these 5 simple habits that successful people swear by. Transform your mornings, transform your life.',
        status: 'completed',
        fileUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
        watermarked: false,
        template: 'minimal',
        voiceType: 'sarah',
        createdAt: '2024-12-08T09:15:00Z',
        tier: 'pro',
        analytics: {
          views: 89000,
          likes: 6200,
          shares: 1800,
          comments: 320
        }
      },
      // Sarah Influencer's videos
      {
        id: 'vid_003',
        title: 'Fashion Trends 2024',
        script: 'These are the fashion trends that will dominate 2024. From sustainable fashion to bold colors, here\'s what you need to know.',
        status: 'completed',
        fileUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
        watermarked: false,
        template: 'dynamic',
        voiceType: 'emma',
        createdAt: '2024-12-09T12:45:00Z',
        tier: 'team',
        analytics: {
          views: 234000,
          likes: 15600,
          shares: 4200,
          comments: 890
        }
      },
      // Mike Newbie's videos
      {
        id: 'vid_004',
        title: 'My First TikTok Video',
        script: 'Hey everyone! This is my first video using TrendSnap. Let me know what you think in the comments below!',
        status: 'completed',
        fileUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
        watermarked: true,
        template: 'trending',
        voiceType: 'alex',
        createdAt: '2024-12-11T16:20:00Z',
        expiresAt: '2024-12-13T16:20:00Z',
        tier: 'free',
        analytics: {
          views: 1200,
          likes: 45,
          shares: 8,
          comments: 12
        }
      }
    ];

    // Store in mock database
    this.users = testUsers;
    this.videos = testVideos;

    // Create analytics data
    this.analytics.set('platform_stats', {
      totalUsers: 50000,
      totalVideos: 2000000,
      totalViews: 500000000,
      avgEngagementRate: 0.085
    });

    // Load from localStorage if available
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      // Only access localStorage in browser environment
      if (typeof window === 'undefined') {
        return;
      }
      
      const savedUsers = localStorage.getItem('trendsnap_users');
      const savedVideos = localStorage.getItem('trendsnap_videos');
      
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        // Merge with test users, avoiding duplicates
        const existingEmails = this.users.map(u => u.email);
        const newUsers = parsed.filter((u: User) => !existingEmails.includes(u.email));
        this.users = [...this.users, ...newUsers];
      }
      
      if (savedVideos) {
        const parsed = JSON.parse(savedVideos);
        this.videos = [...this.videos, ...parsed];
      }
    } catch (error) {
      console.warn('Failed to load data from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      // Only access localStorage in browser environment
      if (typeof window === 'undefined') {
        return;
      }
      
      localStorage.setItem('trendsnap_users', JSON.stringify(this.users));
      localStorage.setItem('trendsnap_videos', JSON.stringify(this.videos));
    } catch (error) {
      console.warn('Failed to save data to storage:', error);
    }
  }

  // User operations
  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const user: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    this.users.push(user);
    this.saveToStorage();
    return user;
  }

  getUserByEmail(email: string): User | null {
    return this.users.find(user => user.email === email) || null;
  }

  getUserById(id: string): User | null {
    return this.users.find(user => user.id === id) || null;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    this.saveToStorage();
    return this.users[userIndex];
  }

  // Video operations
  createVideo(videoData: Omit<Video, 'id' | 'createdAt'>): Video {
    const video: Video = {
      ...videoData,
      id: `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    this.videos.push(video);
    this.saveToStorage();
    return video;
  }

  getVideosByUserId(userId: string): Video[] {
    // For demo purposes, return all videos for test users
    const testUserIds = ['user_001', 'user_002', 'user_003', 'user_004'];
    if (testUserIds.includes(userId)) {
      return this.videos;
    }
    
    // For real users, filter by actual ownership (would need userId field in Video)
    return this.videos.filter(video => video.id.includes(userId.slice(-3)));
  }

  getAllVideos(): Video[] {
    return this.videos;
  }

  updateVideo(id: string, updates: Partial<Video>): Video | null {
    const videoIndex = this.videos.findIndex(video => video.id === id);
    if (videoIndex === -1) return null;
    
    this.videos[videoIndex] = { ...this.videos[videoIndex], ...updates };
    this.saveToStorage();
    return this.videos[videoIndex];
  }

  deleteVideo(id: string): boolean {
    const videoIndex = this.videos.findIndex(video => video.id === id);
    if (videoIndex === -1) return false;
    
    this.videos.splice(videoIndex, 1);
    this.saveToStorage();
    return true;
  }

  // Analytics operations
  getAnalytics(type: string): any {
    return this.analytics.get(type);
  }

  getUserAnalytics(userId: string): any {
    const userVideos = this.getVideosByUserId(userId);
    const totalViews = userVideos.reduce((sum, video) => sum + (video.analytics?.views || 0), 0);
    const totalLikes = userVideos.reduce((sum, video) => sum + (video.analytics?.likes || 0), 0);
    const totalShares = userVideos.reduce((sum, video) => sum + (video.analytics?.shares || 0), 0);
    const totalComments = userVideos.reduce((sum, video) => sum + (video.analytics?.comments || 0), 0);
    
    return {
      totalVideos: userVideos.length,
      totalViews,
      totalLikes,
      totalShares,
      totalComments,
      avgViewsPerVideo: userVideos.length > 0 ? Math.round(totalViews / userVideos.length) : 0,
      engagementRate: totalViews > 0 ? ((totalLikes + totalShares + totalComments) / totalViews * 100).toFixed(2) : 0
    };
  }

  // Session management
  createSession(userId: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.sessions.set(sessionId, userId);
    return sessionId;
  }

  getSession(sessionId: string): string | null {
    return this.sessions.get(sessionId) || null;
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  // Test user login helper
  getTestUsers(): User[] {
    return this.users.filter(user => user.email.includes('example.com'));
  }
}

// Export singleton instance
export const mockDB = MockDatabase.getInstance();