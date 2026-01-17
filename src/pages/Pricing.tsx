import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, X, Crown, Zap, Building2, Menu } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, yearly: 0 },
      icon: <Zap className="h-6 w-6" />,
      features: [
        { text: '5 documents per month', included: true },
        { text: 'Basic AI assistance', included: true },
        { text: '1GB storage', included: true },
        { text: 'Export to PDF', included: true },
        { text: 'Email support', included: true },
        { text: 'Advanced AI features', included: false },
        { text: 'Team sharing', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Start Free',
      highlighted: false
    },
    {
      name: 'Pro',
      description: 'For professionals and creators',
      price: { monthly: 19, yearly: 190 },
      icon: <Crown className="h-6 w-6" />,
      features: [
        { text: 'Unlimited documents', included: true },
        { text: 'Advanced AI features', included: true },
        { text: '50GB storage', included: true },
        { text: 'All export formats', included: true },
        { text: 'Priority support', included: true },
        { text: 'Team sharing', included: true },
        { text: 'Version history', included: true },
        { text: 'Custom templates', included: true },
      ],
      cta: 'Start Pro Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      description: 'For teams and organizations',
      price: { monthly: 49, yearly: 490 },
      icon: <Building2 className="h-6 w-6" />,
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Unlimited storage', included: true },
        { text: 'Custom AI training', included: true },
        { text: 'SSO & Admin controls', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'API access', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'SLA guarantee', included: true },
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="PaperMorph" className="h-10" />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/features" className="text-muted-foreground hover:text-foreground text-sm">Features</Link>
              <Link to="/pricing" className="text-foreground font-medium text-sm">Pricing</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground text-sm">About</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm">Contact</Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/auth')}>Log In</Button>
              <Button onClick={() => navigate('/auth')}>Get Started</Button>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 text-center">
            <Badge variant="secondary" className="mb-6">Simple Pricing</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Choose your <span className="text-primary">perfect plan</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Start free and upgrade as you grow. No hidden fees, cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mb-12">
              <Label htmlFor="billing" className={billingPeriod === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}>
                Monthly
              </Label>
              <Switch
                id="billing"
                checked={billingPeriod === 'yearly'}
                onCheckedChange={(checked) => setBillingPeriod(checked ? 'yearly' : 'monthly')}
              />
              <Label htmlFor="billing" className={billingPeriod === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}>
                Yearly
              </Label>
              {billingPeriod === 'yearly' && (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Save 20%</Badge>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index}
                  className={`relative ${plan.highlighted ? 'border-primary shadow-lg scale-105' : 'border-border'}`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground gap-1">
                        <Crown className="h-3 w-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <div className={`w-14 h-14 rounded-xl ${plan.highlighted ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'} flex items-center justify-center mx-auto mb-4`}>
                      {plan.icon}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    <div className="pt-4">
                      <span className="text-4xl font-bold">
                        ${plan.price[billingPeriod]}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-muted-foreground">
                          /{billingPeriod === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={feature.included ? '' : 'text-muted-foreground'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={plan.highlighted ? 'default' : 'outline'}
                      onClick={() => navigate('/auth')}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-2xl mx-auto space-y-6">
              {[
                { q: 'Can I cancel anytime?', a: 'Yes! You can cancel your subscription at any time. No questions asked.' },
                { q: 'Is there a free trial for Pro?', a: 'Yes, we offer a 14-day free trial for the Pro plan. No credit card required.' },
                { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.' },
                { q: 'Can I switch plans later?', a: 'Absolutely! You can upgrade or downgrade your plan at any time from your account settings.' },
              ].map((faq, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <img src="/logo.png" alt="PaperMorph" className="h-8" />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-foreground">Terms</Link>
              <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link to="/contact" className="hover:text-foreground">Contact</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PaperMorph. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
