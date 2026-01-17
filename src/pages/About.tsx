import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Target, Users, Lightbulb, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function About() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const values = [
    { icon: <Heart className="h-6 w-6" />, title: 'User First', description: 'Everything we build starts with our users\' needs. We obsess over creating the best possible experience.' },
    { icon: <Target className="h-6 w-6" />, title: 'Excellence', description: 'We strive for excellence in everything we do, from code quality to customer support.' },
    { icon: <Lightbulb className="h-6 w-6" />, title: 'Innovation', description: 'We push the boundaries of what\'s possible with AI and document editing technology.' },
    { icon: <Users className="h-6 w-6" />, title: 'Community', description: 'We believe in the power of community and collaboration to create something truly amazing.' },
  ];

  const stats = [
    { value: '500K+', label: 'Active Users' },
    { value: '10M+', label: 'Documents Created' },
    { value: '50+', label: 'Languages Supported' },
    { value: '99.9%', label: 'Uptime' },
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
              <Link to="/pricing" className="text-muted-foreground hover:text-foreground text-sm">Pricing</Link>
              <Link to="/about" className="text-foreground font-medium text-sm">About</Link>
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
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6">Our Story</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                We're on a mission to<br /><span className="text-primary">democratize great writing</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                PaperMorph was born from a simple idea: everyone deserves access to tools that help them write better. We believe AI should enhance human creativity, not replace it.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Our Story</h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p>
                  Founded in 2024, PaperMorph started as a side project by a team of writers and engineers who were frustrated with the limitations of traditional word processors. We saw the potential of AI to transform how people write and communicate.
                </p>
                <p className="mt-4">
                  Today, we're proud to serve over 500,000 users worldwide, from students writing their first essays to professionals crafting important business documents. Our AI-powered platform helps people write faster, better, and with more confidence.
                </p>
                <p className="mt-4">
                  We're just getting started. Our vision is to make great writing accessible to everyone, regardless of their background or experience. We believe that when people can express themselves clearly, they can achieve anything.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-8">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                      {value.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to join us?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Start writing smarter today. Join thousands of users who trust PaperMorph for their writing needs.
            </p>
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2">
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
