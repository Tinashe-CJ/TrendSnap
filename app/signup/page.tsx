'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Zap, Mail, Lock, User, Shield, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [emailValidation, setEmailValidation] = useState<{ isValid: boolean; error?: string } | null>(null);
  const [passwordValidation, setPasswordValidation] = useState<{ isValid: boolean; strength: 'weak' | 'medium' | 'strong'; errors: string[] } | null>(null);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  
  const { signup, validateEmail, validatePassword } = useAuth();
  const router = useRouter();

  // Real-time email validation
  useEffect(() => {
    const validateEmailField = async () => {
      if (!formData.email) {
        setEmailValidation(null);
        return;
      }

      setIsValidatingEmail(true);
      try {
        const result = await validateEmail(formData.email);
        setEmailValidation(result);
      } catch (error) {
        setEmailValidation({ isValid: false, error: 'Email validation failed' });
      } finally {
        setIsValidatingEmail(false);
      }
    };

    const timeoutId = setTimeout(validateEmailField, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email, validateEmail]);

  // Real-time password validation
  useEffect(() => {
    if (!formData.password) {
      setPasswordValidation(null);
      return;
    }

    const result = validatePassword(formData.password);
    setPasswordValidation(result);
  }, [formData.password, validatePassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!emailValidation?.isValid) {
      setError(emailValidation?.error || 'Please enter a valid email address');
      return;
    }

    if (!passwordValidation?.isValid) {
      setError(passwordValidation?.errors.join('. '));
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    
    // Simulate CAPTCHA verification for some cases
    if (!showCaptcha && Math.random() > 0.7) {
      setShowCaptcha(true);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signup(formData.email, formData.password, formData.name);
      
      if (result.success) {
        toast.success('Account created successfully! You have 3 free credits to get started.');
        router.push('/dashboard');
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
    
    setIsLoading(false);
  };

  const handleCaptchaComplete = () => {
    setShowCaptcha(false);
    handleSubmit(new Event('submit') as any);
  };

  const getPasswordStrengthColor = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center px-4">
      {/* Back Button */}
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Button variant="ghost" className="flex items-center text-gray-600 hover:text-purple-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              TrendSnap
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Start creating viral videos with 3 free credits</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Join thousands of creators already using TrendSnap
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showCaptcha && (
              <Alert className="mb-6">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Please complete the security verification to continue.
                  <div className="mt-3 p-4 bg-gray-100 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-2">reCAPTCHA Verification</div>
                    <Button onClick={handleCaptchaComplete} size="sm">
                      I'm not a robot ✓
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className={`pr-10 ${
                      emailValidation?.isValid === true ? 'border-green-500' : 
                      emailValidation?.isValid === false ? 'border-red-500' : ''
                    }`}
                  />
                  {isValidatingEmail && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    </div>
                  )}
                  {emailValidation && !isValidatingEmail && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailValidation.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {emailValidation && !emailValidation.isValid && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {emailValidation.error}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className={`${
                    passwordValidation?.isValid === true ? 'border-green-500' : 
                    passwordValidation?.isValid === false ? 'border-red-500' : ''
                  }`}
                />
                {passwordValidation && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Password strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordValidation.strength === 'weak' ? 'text-red-600' :
                        passwordValidation.strength === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {getPasswordStrengthText(passwordValidation.strength)}
                      </span>
                    </div>
                    <Progress 
                      value={
                        passwordValidation.strength === 'weak' ? 33 :
                        passwordValidation.strength === 'medium' ? 66 : 100
                      } 
                      className="h-1"
                    />
                    {passwordValidation.errors.length > 0 && (
                      <div className="space-y-1">
                        {passwordValidation.errors.map((error, index) => (
                          <p key={index} className="text-xs text-red-600 flex items-center">
                            <XCircle className="h-3 w-3 mr-1" />
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className={`${
                    formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-500' : 
                    formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''
                  }`}
                />
                {formData.confirmPassword && (
                  <p className={`text-sm flex items-center ${
                    formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formData.password === formData.confirmPassword ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-purple-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading || showCaptcha || !emailValidation?.isValid || !passwordValidation?.isValid || formData.password !== formData.confirmPassword || !formData.acceptTerms}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Anti-abuse notice */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-orange-800 mb-1">Fair Usage Policy</div>
                  <div className="text-orange-700">
                    One account per person. We use device fingerprinting and email validation 
                    to prevent abuse and ensure a fair experience for all users.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}