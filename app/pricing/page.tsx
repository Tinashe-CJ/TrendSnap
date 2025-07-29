'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  CheckCircle, 
  Crown, 
  Zap, 
  Users, 
  Building,
  Star,
  ArrowRight,
  X
} from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free Trial',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect to get started',
    icon: <Zap className="h-6 w-6" />,
    features: [
      '3 video exports',
      'SD quality (720p)',
      'Basic templates',
      '3 AI voices',
      'Watermarked videos',
      '48-hour video storage',
      'Community support',
    ],
    limitations: [
      'No HD/4K export',
      'No custom branding',
      'No direct social posting',
      'Limited templates',
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 12, yearly: 120 },
    description: 'For serious content creators',
    icon: <Crown className="h-6 w-6" />,
    features: [
      'Unlimited video generation',
      'HD & 4K export',
      'No watermarks',
      '50+ premium templates',
      '15+ AI voices with emotions',
      '30-day video storage',
      'Direct social media posting',
      'Basic trend analytics',
      'Email support',
      'Custom brand kit',
    ],
    limitations: [],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: { monthly: 29, yearly: 290 },
    description: 'For agencies and teams',
    icon: <Users className="h-6 w-6" />,
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Team asset sharing',
      'Advanced analytics dashboard',
      'Client presentation tools',
      'Bulk video generation',
      'Priority support',
      '90-day video storage',
      'Team collaboration tools',
    ],
    limitations: [],
    cta: 'Upgrade to Team',
    popular: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 'Custom', yearly: 'Custom' },
    description: 'For large organizations',
    icon: <Building className="h-6 w-6" />,
    features: [
      'Everything in Team',
      'Unlimited team members',
      'API access',
      'White-label options',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced security',
      'SLA guarantees',
      'Unlimited storage',
      'Custom trend curation',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your billing period.',
  },
  {
    question: 'What happens to my videos if I downgrade?',
    answer: 'Your existing videos will remain accessible, but new videos will be subject to the limitations of your new plan.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan at any time. Changes take effect immediately with prorated billing.',
  },
];

export default function PricingPage() {
  const { user, upgradeTier } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleUpgrade = (planId: string) => {
    if (planId === 'free') return;
    
    if (planId === 'enterprise') {
      // Mock contact sales
      toast.success('Sales team will contact you within 24 hours!');
      return;
    }

    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    // Mock payment processing
    setTimeout(() => {
      if (selectedPlan) {
        upgradeTier(selectedPlan as any);
        toast.success(`Successfully upgraded to ${selectedPlan} plan!`);
        setShowPaymentModal(false);
        setSelectedPlan(null);
      }
    }, 2000);
  };

  const PaymentModal = () => {
    if (!showPaymentModal || !selectedPlan) return null;

    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-6 max-w-md w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Complete Your Upgrade</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPaymentModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              {plan.icon}
              <span className="font-semibold">{plan.name}</span>
            </div>
            <div className="text-2xl font-bold">
              ${typeof plan.price.monthly === 'number' ? (isYearly ? plan.price.yearly : plan.price.monthly) : 'Custom'}
              {typeof plan.price.monthly === 'number' && (
                <span className="text-sm font-normal text-gray-600">
                  /{isYearly ? 'year' : 'month'}
                </span>
              )}
            </div>
          </div>

          {/* Mock payment form */}
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium mb-2">Payment Method</div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                  VISA
                </div>
                <span>•••• •••• •••• 4242</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-600">
              By upgrading, you agree to our Terms of Service and Privacy Policy. 
              Your subscription will auto-renew until cancelled.
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={handlePayment}
            >
              Complete Upgrade
            </Button>
          </div>
        </motion.div>
      </div>
    );
  };

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
              <Star className="h-4 w-4 mr-2" />
              Choose Your Plan
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-orange-500 bg-clip-text text-transparent mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start free, scale as you grow. All plans include our core AI video generation technology.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!isYearly ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <span className={`text-sm ${isYearly ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                Yearly
              </span>
              <Badge variant="secondary" className="ml-2">Save 17%</Badge>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full relative ${
                  plan.popular 
                    ? 'ring-2 ring-purple-500 shadow-lg' 
                    : 'hover:shadow-md'
                } ${
                  user?.tier === plan.id 
                    ? 'bg-purple-50 border-purple-200' 
                    : 'bg-white'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                      plan.popular ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {plan.icon}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <div className="text-3xl font-bold">
                        {typeof plan.price.monthly === 'number' 
                          ? `$${isYearly ? plan.price.yearly : plan.price.monthly}`
                          : plan.price.monthly
                        }
                      </div>
                      {typeof plan.price.monthly === 'number' && (
                        <div className="text-sm text-gray-600">
                          per {isYearly ? 'year' : 'month'}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {plan.limitations.length > 0 && (
                      <div className="border-t pt-4">
                        <div className="text-xs text-gray-500 mb-2">Limitations:</div>
                        <ul className="space-y-1">
                          {plan.limitations.map((limitation, i) => (
                            <li key={i} className="flex items-center text-xs text-gray-500">
                              <X className="h-3 w-3 mr-2 flex-shrink-0" />
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Button
                      className={`w-full mt-6 ${
                        plan.popular 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                      disabled={user?.tier === plan.id}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {user?.tier === plan.id ? 'Current Plan' : plan.cta}
                      {plan.cta !== 'Current Plan' && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Create Viral Videos?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of creators already using TrendSnap
            </p>
            {!user && (
              <Link href="/signup">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-4">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      <PaymentModal />
    </div>
  );
}