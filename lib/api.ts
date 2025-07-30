const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('trendsnap_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('trendsnap_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('trendsnap_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>).Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async signup(email: string, password: string, name: string, deviceFingerprint: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, deviceFingerprint }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(name: string) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  // Video endpoints
  async generateVideo(script: string, quality: 'sd' | 'hd' = 'sd') {
    return this.request('/video/generate', {
      method: 'POST',
      body: JSON.stringify({ script, quality }),
    });
  }

  async getVideoStatus(jobId: string) {
    return this.request(`/video/status/${jobId}`);
  }

  async getUserVideos() {
    return this.request('/video/list');
  }

  // Credit endpoints
  async getCreditBalance() {
    return this.request('/credit/balance');
  }

  async purchaseCredits(creditPackage: string) {
    return this.request('/credit/purchase', {
      method: 'POST',
      body: JSON.stringify({ package: creditPackage }),
    });
  }

  async getCreditPackages() {
    return this.request('/credit/packages');
  }
}

export const apiService = new ApiService(API_BASE_URL); 