import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, MessageSquare, Languages, Clock, Cloud, Lock, Shield,
  FileText, Zap, BarChart3, Edit3, Palette, Bold, CheckCircle,
  ArrowRight, Play, Menu, X
} from 'lucide-react';
import { useState } from 'react';

export default function Features() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    { 
      icon: <Sparkles className="h-8 w-8" />, 
      title: 'AI Writing Assistant', 
      description: 'Get intelligent suggestions, auto-completions, and creative ideas as you type. Our AI understands context and helps you write better.',
      color: 'bg-purple-500/10 text-purple-500'
    },
    { 
      icon: <MessageSquare className="h-8 w-8" />, 
      title: 'Smart Chat Interface', 
      description: 'Ask questions about your document and get instant, contextual answers. Refine your content through natural conversation.',
      color: 'bg-blue-500/10 text-blue-500'
    },
    { 
      icon: <Languages className="h-8 w-8" />, 
      title: 'Multi-Language Support', 
      description: 'Write and translate in over 50 languages with perfect grammar. Break language barriers effortlessly.',
      color: 'bg-green-500/10 text-green-500'
    },
    { 
      icon: <Clock className="h-8 w-8" />, 
      title: 'Real-Time Collaboration', 
      description: 'Work together with your team in real-time, anywhere in the world. See changes as they happen.',
      color: 'bg-orange-500/10 text-orange-500'
    },
    { 
      icon: <Cloud className="h-8 w-8" />, 
      title: 'Cloud Sync', 
      description: 'Access your documents from any device, anytime. Automatic sync ensures you never lose your work.',
      color: 'bg-cyan-500/10 text-cyan-500'
    },
    { 
      icon: <Lock className="h-8 w-8" />, 
      title: 'Enterprise Security', 
      description: 'Bank-level encryption keeps your documents safe and private. GDPR compliant and SOC 2 certified.',
      color: 'bg-red-500/10 text-red-500'
    },
  ];

  const aiCapabilities = [
    { icon: <Edit3 className="h-6 w-6" />, title: 'Auto-Complete', desc: 'Finish sentences intelligently' },
    { icon: <FileText className="h-6 w-6" />, title: 'Summarize', desc: 'Get key points instantly' },
    { icon: <Palette className="h-6 w-6" />, title: 'Rewrite', desc: 'Change tone and style' },
    { icon: <Bold className="h-6 w-6" />, title: 'Grammar Fix', desc: 'Perfect your writing' },
    { icon: <Zap className="h-6 w-6" />, title: 'Expand Ideas', desc: 'Develop thoughts further' },
    { icon: <BarChart3 className="h-6 w-6" />, title: 'Analyze', desc: 'Get insights and feedback' },
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
              <Link to="/features" className="text-foreground font-medium text-sm">Features</Link>
              <Link to="/pricing" className="text-muted-foreground hover:text-foreground text-sm">Pricing</Link>
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
            <Badge variant="secondary" className="mb-6">Powerful Features</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Everything you need to<br /><span className="text-primary">write brilliantly</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              PaperMorph combines the power of AI with an intuitive interface to help you create amazing documents faster than ever.
            </p>
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2">
              Start Writing Free <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-8 pb-6">
                    <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Capabilities */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                AI That <span className="text-primary">Does It All</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Our AI understands context and helps with any writing task
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {aiCapabilities.map((cap, index) => (
                <Card key={index} className="text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 text-primary">
                      {cap.icon}
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{cap.title}</h4>
                    <p className="text-xs text-muted-foreground">{cap.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to write smarter?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of writers who use PaperMorph to create amazing content.
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate('/auth')} className="gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
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
