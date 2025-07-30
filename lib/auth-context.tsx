'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from './api';

export interface User {
  id: string;
  email: string;
  name?: string;
  tier: 'free' | 'pro' | 'team' | 'enterprise';
  credits: number;
  createdAt: string;
  deviceFingerprint: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateCredits: (credits: number) => void;
  upgradeTier: (tier: 'pro' | 'team' | 'enterprise') => void;
  isLoading: boolean;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; errors: string[] };
  generateDeviceFingerprint: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Disposable email domains
  const DISPOSABLE_EMAIL_DOMAINS = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com', 'throwawamail.com',
    'temp-mail.org', 'sharklasers.com', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
    'bccto.me', 'chacuo.net', 'dispostable.com', 'fakeinbox.com', 'getairmail.com',
    'mailnesia.com', 'mintemail.com', 'mohmal.com', 'nwldx.com', 'yopmail.com',
    'getnada.com', 'maildrop.cc', 'mailinator.net', 'tempr.email', 'trashmail.com'
  ];

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) return false;
    
    return true;
  };

  // Password validation
  const validatePassword = (password: string): { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; errors: string[] } => {
    const errors: string[] = [];
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Calculate strength
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (score >= 4 && password.length >= 10) {
      strength = 'strong';
    } else if (score >= 3) {
      strength = 'medium';
    }
    
    return {
      isValid: errors.length === 0,
      strength,
      errors
    };
  };

  // Generate device fingerprint
  const generateDeviceFingerprint = (): string => {
    if (typeof window === 'undefined') return 'server-side';
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('TrendSnap Device Fingerprint', 10, 10);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      navigator.hardwareConcurrency,
      navigator.deviceMemory,
      navigator.platform
    ].join('|');
    
    return btoa(fingerprint).slice(0, 32);
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiService.getCurrentUser();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.log('No authenticated user found');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await apiService.login(email, password);
      if (response.success && response.data?.user && response.data?.token) {
        setUser(response.data.user);
        apiService.setToken(response.data.token);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const deviceFingerprint = generateDeviceFingerprint();
      const response = await apiService.signup(email, password, name, deviceFingerprint);
      if (response.success && response.data?.user && response.data?.token) {
        setUser(response.data.user);
        apiService.setToken(response.data.token);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Signup failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    apiService.clearToken();
  };

  const updateCredits = (credits: number) => {
    if (user) {
      setUser({ ...user, credits });
    }
  };

  const upgradeTier = (tier: 'pro' | 'team' | 'enterprise') => {
    if (user) {
      setUser({ ...user, tier });
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateCredits,
    upgradeTier,
    isLoading,
    validateEmail,
    validatePassword,
    generateDeviceFingerprint
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};