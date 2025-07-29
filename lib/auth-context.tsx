'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock disposable email domains for demonstration
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'throwawamail.com'
];

// Simulate device fingerprinting
const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('fingerprint', 2, 2);
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvas.toDataURL(),
  };
  
  return btoa(JSON.stringify(fingerprint)).slice(0, 32);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('trendsnap_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('trendsnap_user');
      }
    }
    setIsLoading(false);
  }, []);

  const signup = async (email: string, password: string, name?: string) => {
    // Check for disposable email
    const domain = email.split('@')[1]?.toLowerCase();
    if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      return {
        success: false,
        error: 'Disposable email addresses are not allowed. Please use a permanent email address.'
      };
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('trendsnap_users') || '[]');
    if (existingUsers.find((u: any) => u.email === email)) {
      return {
        success: false,
        error: 'An account with this email already exists.'
      };
    }

    // Create new user
    const deviceFingerprint = generateDeviceFingerprint();
    
    // Check if device has been used before (anti-abuse)
    const usedFingerprints = JSON.parse(localStorage.getItem('trendsnap_fingerprints') || '[]');
    const existingFingerprint = usedFingerprints.find((f: any) => f.fingerprint === deviceFingerprint);
    
    let credits = 3; // Default free credits
    if (existingFingerprint) {
      credits = 0; // No additional credits for same device
    }

    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      tier: 'free',
      credits,
      createdAt: new Date().toISOString(),
      deviceFingerprint,
      isVerified: true, // Simulate email verification
    };

    // Save user
    existingUsers.push(newUser);
    localStorage.setItem('trendsnap_users', JSON.stringify(existingUsers));
    
    // Track device fingerprint
    if (!existingFingerprint) {
      usedFingerprints.push({
        fingerprint: deviceFingerprint,
        userId: newUser.id,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('trendsnap_fingerprints', JSON.stringify(usedFingerprints));
    }

    setUser(newUser);
    localStorage.setItem('trendsnap_user', JSON.stringify(newUser));

    return { success: true };
  };

  const login = async (email: string, password: string) => {
    const existingUsers = JSON.parse(localStorage.getItem('trendsnap_users') || '[]');
    const user = existingUsers.find((u: any) => u.email === email);
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password.'
      };
    }

    setUser(user);
    localStorage.setItem('trendsnap_user', JSON.stringify(user));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trendsnap_user');
  };

  const updateCredits = (newCredits: number) => {
    if (!user) return;
    
    const updatedUser = { ...user, credits: newCredits };
    setUser(updatedUser);
    localStorage.setItem('trendsnap_user', JSON.stringify(updatedUser));
    
    // Update in users array
    const existingUsers = JSON.parse(localStorage.getItem('trendsnap_users') || '[]');
    const userIndex = existingUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex >= 0) {
      existingUsers[userIndex] = updatedUser;
      localStorage.setItem('trendsnap_users', JSON.stringify(existingUsers));
    }
  };

  const upgradeTier = (tier: 'pro' | 'team' | 'enterprise') => {
    if (!user) return;
    
    const updatedUser = { ...user, tier };
    setUser(updatedUser);
    localStorage.setItem('trendsnap_user', JSON.stringify(updatedUser));
    
    // Update in users array
    const existingUsers = JSON.parse(localStorage.getItem('trendsnap_users') || '[]');
    const userIndex = existingUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex >= 0) {
      existingUsers[userIndex] = updatedUser;
      localStorage.setItem('trendsnap_users', JSON.stringify(existingUsers));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateCredits,
      upgradeTier,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};