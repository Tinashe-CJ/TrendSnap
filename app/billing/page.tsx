'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Crown, 
  Calendar, 
  Download,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import Link from 'next/link';

export default function BillingPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const mockInvoices = [
    {
      id: 'inv_001',
      date: '2024-12-01',
      amount: 12.00,
      status: 'paid',
      plan: 'Pro Monthly',
      downloadUrl: '#'
    },
    {
      id: 'inv_002',
      date: '2024-11-01',
      amount: 12.00,
      status: 'paid',
      plan: 'Pro Monthly',
      downloadUrl: '#'
    },
    {
      id: 'inv_003',
      date: '2024-10-01',
      amount: 12.00,
      status: 'paid',
      plan: 'Pro Monthly',
      downloadUrl: '#'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
          <p className="text-gray-600">
            Manage your subscription and billing information
          </p>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2 text-purple-600" />
              Current Plan
            </CardTitle>
            <CardDescription>
              Your active subscription details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-bold capitalize">{user.tier}</h3>
                  <Badge variant={user.tier === 'free' ? 'secondary' : 'default'}>
                    {user.tier === 'free' ? 'Free Tier' : 'Active'}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">
                  {user.tier === 'free' 
                    ? 'You are currently on the free plan with limited features.'
                    : `You have access to all ${user.tier} features and unlimited video generation.`
                  }
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {user.tier === 'free' ? 'No billing cycle' : 'Next billing: Jan 1, 2025'}
                  </span>
                  <span className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    {user.tier === 'free' ? 'No payment method' : '•••• •••• •••• 4242'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {user.tier === 'free' ? '$0' : user.tier === 'pro' ? '$12' : user.tier === 'team' ? '$29' : 'Custom'}
                </div>
                <div className="text-sm text-gray-500">
                  {user.tier === 'free' ? 'Forever' : 'per month'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage & Credits */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Credits Usage</CardTitle>
              <CardDescription>
                Your current credit balance and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {user.credits}
                </div>
                <p className="text-gray-600 mb-4">
                  {user.tier === 'free' ? 'Credits remaining' : 'Unlimited credits'}
                </p>
                {user.tier === 'free' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(user.credits / 3) * 100}%` }}
                    ></div>
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  {user.tier === 'free' 
                    ? 'Upgrade for unlimited video generation'
                    : 'No limits on video creation'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Billing</CardTitle>
              <CardDescription>
                Your upcoming charges and billing cycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {user.tier === 'free' ? (
                  <>
                    <div className="text-4xl font-bold text-gray-400 mb-2">
                      $0
                    </div>
                    <p className="text-gray-600 mb-4">No upcoming charges</p>
                    <p className="text-sm text-gray-500">
                      You're on the free plan
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ${user.tier === 'pro' ? '12' : user.tier === 'team' ? '29' : 'Custom'}
                    </div>
                    <p className="text-gray-600 mb-4">Due January 1, 2025</p>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      Auto-renewal enabled
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Method */}
        {user.tier !== 'free' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </CardTitle>
              <CardDescription>
                Manage your payment information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/2027</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing History */}
        {user.tier !== 'free' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="h-5 w-5 mr-2" />
                Billing History
              </CardTitle>
              <CardDescription>
                Download your past invoices and receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{invoice.plan}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(invoice.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                        <div className="flex items-center text-sm text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upgrade CTA for Free Users */}
        {user.tier === 'free' && (
          <Card className="bg-gradient-to-r from-purple-50 to-orange-50 border-purple-200">
            <CardContent className="p-8 text-center">
              <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to Upgrade?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Unlock unlimited video generation, HD quality, premium templates, and remove watermarks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    <Crown className="h-4 w-4 mr-2" />
                    View Plans
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manage Subscription */}
        {user.tier !== 'free' && (
          <Card>
            <CardHeader>
              <CardTitle>Manage Subscription</CardTitle>
              <CardDescription>
                Change your plan or cancel your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/pricing">
                  <Button variant="outline">
                    Change Plan
                  </Button>
                </Link>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  Cancel Subscription
                </Button>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 mb-1">Cancellation Policy</p>
                    <p className="text-yellow-700">
                      If you cancel, you'll retain access to your current plan until the end of your billing period. 
                      Your videos will be preserved, but new generations will be limited to free tier quotas.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}