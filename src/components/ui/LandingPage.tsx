import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  File,
  Edit3,
  Sparkles,
  MessageSquare,
  Clock,
  Cloud,
  Lock,
  Share2,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Menu,
  X,
  Plus,
  Send,
  MessageCircle,
  Instagram,
  Facebook,
  Globe,
  Crown,
  Zap,
  BarChart3,
  Shield,
  Cpu,
  Book,
  Briefcase,
  Users,
  GraduationCap,
  Layers,
  Settings,
  Languages,
  Monitor,
  Clipboard,
  Palette,
  Bold,
} from 'lucide-react';
import logo from '/logo.png';
import heroPreview from '/placeholder.svg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
  ];

  const features = [
    { icon: <Sparkles className="h-7 w-7 text-primary" />, title: 'AI Writing Assistant', description: 'Get intelligent suggestions, auto-completions, and creative ideas as you type.' },
    { icon: <MessageSquare className="h-7 w-7 text-primary" />, title: 'Smart Chat Interface', description: 'Ask questions about your document and get instant, contextual answers.' },
    { icon: <Languages className="h-7 w-7 text-primary" />, title: 'Multi-Language Support', description: 'Write and translate in over 50 languages with perfect grammar.' },
    { icon: <Clock className="h-7 w-7 text-primary" />, title: 'Real-Time Collaboration', description: 'Work together with your team in real-time, anywhere in the world.' },
    { icon: <Cloud className="h-7 w-7 text-primary" />, title: 'Cloud Sync', description: 'Access your documents from any device, anytime, with automatic sync.' },
    { icon: <Lock className="h-7 w-7 text-primary" />, title: 'Enterprise Security', description: 'Bank-level encryption keeps your documents safe and private.' },
  ];

  const aiCapabilities = [
    { icon: <Edit3 className="h-6 w-6" />, title: 'Auto-Complete', desc: 'Finish sentences intelligently' },
    { icon: <FileText className="h-6 w-6" />, title: 'Summarize', desc: 'Get key points instantly' },
    { icon: <Palette className="h-6 w-6" />, title: 'Rewrite', desc: 'Change tone and style' },
    { icon: <Bold className="h-6 w-6" />, title: 'Grammar Fix', desc: 'Perfect your writing' },
    { icon: <Zap className="h-6 w-6" />, title: 'Expand Ideas', desc: 'Develop thoughts further' },
    { icon: <BarChart3 className="h-6 w-6" />, title: 'Analyze', desc: 'Get insights and feedback' },
  ];

  const steps = [
    { number: '01', title: 'Create or Import', description: 'Start a new document or import your existing files.', visual: <File className="h-10 w-10 text-primary" /> },
    { number: '02', title: 'Write with AI', description: 'Let our AI assist you with suggestions and improvements.', visual: <Sparkles className="h-10 w-10 text-primary" /> },
    { number: '03', title: 'Chat & Refine', description: 'Ask questions and refine your content through conversation.', visual: <MessageSquare className="h-10 w-10 text-primary" /> },
    { number: '04', title: 'Export & Share', description: 'Export to any format or share with your team.', visual: <Share2 className="h-10 w-10 text-primary" /> },
  ];

  const benefits = [
    { icon: <Clock className="h-6 w-6" />, title: 'Save 10+ Hours/Week', desc: 'Automate repetitive writing tasks' },
    { icon: <BarChart3 className="h-6 w-6" />, title: '3x Faster Writing', desc: 'AI-powered speed boost' },
    { icon: <CheckCircle className="h-6 w-6" />, title: '99.9% Accuracy', desc: 'Precise grammar & spelling' },
    { icon: <Shield className="h-6 w-6" />, title: 'GDPR Compliant', desc: 'Your data stays private' },
  ];

  const useCases = [
    { icon: <Briefcase className="h-7 w-7" />, title: 'Business', desc: 'Reports, proposals, contracts' },
    { icon: <GraduationCap className="h-7 w-7" />, title: 'Education', desc: 'Essays, research, assignments' },
    { icon: <Book className="h-7 w-7" />, title: 'Creative', desc: 'Stories, scripts, content' },
    { icon: <Users className="h-7 w-7" />, title: 'Personal', desc: 'Letters, resumes, blogs' },
  ];

  const integrations = [
    { name: 'Google Drive', icon: <Cloud className="h-9 w-9" /> },
    { name: 'Dropbox', icon: <Layers className="h-9 w-9" /> },
    { name: 'OneDrive', icon: <Monitor className="h-9 w-9" /> },
    { name: 'Slack', icon: <MessageSquare className="h-9 w-9" /> },
    { name: 'Notion', icon: <Clipboard className="h-9 w-9" /> },
  ];

  const pricingPlans = [
    { name: 'Free', price: { monthly: 0, yearly: 0 }, description: 'Perfect for getting started', features: ['5 documents/month', 'Basic AI assistance', '1GB storage', 'Export to PDF'], highlighted: false },
    { name: 'Pro', price: { monthly: 19, yearly: 190 }, description: 'For professionals and creators', features: ['Unlimited documents', 'Advanced AI features', '50GB storage', 'All export formats', 'Priority support', 'Team sharing'], highlighted: true },
    { name: 'Enterprise', price: { monthly: 49, yearly: 490 }, description: 'For teams and organizations', features: ['Everything in Pro', 'Unlimited storage', 'Custom AI training', 'SSO & Admin controls', 'Dedicated support', 'API access'], highlighted: false },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Content Manager', company: 'TechCorp', avatar: 'S', rating: 5, text: 'PaperMorph has completely transformed how I write. The AI suggestions are incredibly accurate.' },
    { name: 'Michael Chen', role: 'PhD Researcher', company: 'MIT', avatar: 'M', rating: 5, text: 'As an academic, I need precise writing. This tool understands context like no other.' },
    { name: 'Emily Davis', role: 'Freelance Writer', company: 'Self-employed', avatar: 'E', rating: 5, text: 'I was skeptical about AI writing tools, but this one feels like having a brilliant co-writer.' },
  ];

  const faqs = [
    { question: 'How does the AI understand my document?', answer: 'Our AI uses advanced natural language processing to understand the context, tone, and intent of your writing.' },
    { question: 'Is my data secure and private?', answer: 'Absolutely. We use bank-level encryption and never share your data. Your documents are stored securely.' },
    { question: 'Can I use it offline?', answer: 'While PaperMorph is primarily cloud-based, we offer offline mode for basic editing.' },
    { question: 'What file formats are supported?', answer: 'We support DOCX, PDF, TXT, RTF, ODT, HTML, and Markdown.' },
    { question: 'Can I cancel my subscription anytime?', answer: 'Yes! You can cancel your subscription at any time.' },
  ];

  const stats = [
    { value: '500K+', label: 'Active Users' },
    { value: '10M+', label: 'Documents Created' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9/5', label: 'User Rating' },
  ];

  return (
    <div className="min-h-screen font-sans bg-background">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <img src={logo} alt="PaperMorph" className="h-10" />
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium dash-on-hover">
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => navigate('/auth')} className="px-5 py-2.5 text-foreground text-sm font-medium hover:text-primary transition-colors">Log In</button>
              <button onClick={() => navigate('/auth?mode=signup')} className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full btn-3d-orange">Get Started</button>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-up">
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>{link.name}</a>
                ))}
                <button onClick={() => navigate('/auth?mode=signup')} className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full btn-3d-orange w-full mt-2">Get Started</button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg border border-border mb-6 bounce-on-hover">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">AI-Powered Document Editor</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-5">
              Write Smarter with<br /><span className="text-primary">AI That Understands</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              The next-generation document editor with built-in AI. Create, edit, and collaborate like never before.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => navigate('/auth?mode=signup')} className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full btn-3d-orange flex items-center gap-2">
                Start Writing Free <ArrowRight className="h-4.5 w-4.5" />
              </button>
              <button className="px-8 py-3 bg-secondary text-foreground font-semibold rounded-lg border border-border flex items-center gap-2 btn-3d">
                <Play className="h-4.5 w-4.5" /> Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Preview Image */}
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-lg overflow-hidden border border-border shadow-elevated card-3d">
              <img src={heroPreview} alt="PaperMorph Editor Interface" className="w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bounce-on-hover">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Traditional Word Processors Are <span className="text-primary">Stuck in the Past</span>
            </h2>
            <p className="text-muted-foreground">They were built for typing, not thinking. No AI, no intelligence, no help.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: <Clock className="h-7 w-7" />, problem: 'Hours Wasted', desc: 'Formatting and rewriting manually' },
              { icon: <X className="h-7 w-7" />, problem: 'No AI Help', desc: 'Writing alone without suggestions' },
              { icon: <Monitor className="h-7 w-7" />, problem: 'Device Locked', desc: 'Files stuck on one computer' },
            ].map((item, index) => (
              <div key={index} className="p-6 bg-card rounded-lg border border-border card-3d">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{item.problem}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-semibold text-primary-foreground">The Solution</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Meet <span className="text-primary">PaperMorph</span>
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              A document editor that thinks with you. AI that understands your content, context, and intent.
            </p>

            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="text-center bounce-on-hover">
                <div className="w-16 h-16 bg-card border border-border rounded-lg flex items-center justify-center mx-auto mb-2">
                  <File className="h-8 w-8 text-primary" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Your Document</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground hidden sm:block" />
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2 animate-pulse-glow">
                  <Cpu className="h-8 w-8 text-primary-foreground" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">AI Processes</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground hidden sm:block" />
              <div className="text-center bounce-on-hover">
                <div className="w-16 h-16 bg-card border border-border rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Perfect Result</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">Powerful <span className="text-primary">Features</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to create amazing documents.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-card rounded-lg border border-border card-3d group hover:border-primary transition-colors">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI CAPABILITIES */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">AI That <span className="text-primary">Does It All</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Our AI understands context and helps with any writing task.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {aiCapabilities.map((cap, index) => (
              <div key={index} className="p-4 bg-card rounded-lg border border-border text-center fall-on-hover cursor-pointer hover:border-primary group transition-colors">
                <div className="w-10 h-10 bg-secondary group-hover:bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors">
                  {cap.icon}
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-0.5">{cap.title}</h4>
                <p className="text-xs text-muted-foreground">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">How It <span className="text-primary">Works</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Get started in minutes with our simple process.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 p-6 bg-card rounded-lg border border-border card-3d">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold">
                    {step.number}
                  </div>
                </div>
                <div>
                  <div className="mb-3">{step.visual}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD SHOWCASE */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">Beautiful, <span className="text-primary">Intuitive</span> Interface</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A clean, modern workspace designed for focus.</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-lg border border-border overflow-hidden card-3d">
              <div className="bg-secondary px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">My Workspace</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">U</div>
                </div>
              </div>
              <div className="flex">
                <div className="w-48 bg-card border-r border-border p-3 hidden md:block">
                  {['All Documents', 'Recent', 'Shared', 'Templates'].map((item, i) => (
                    <button key={i} className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors mb-1 ${i === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}>
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex-1 p-4">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((_, i) => (
                      <div key={i} className="p-4 bg-secondary rounded-lg border border-border hover:border-primary transition-colors cursor-pointer fall-on-hover">
                        <div className="w-full h-16 bg-muted rounded-lg mb-3 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="h-3 bg-muted rounded w-3/4 mb-1.5"></div>
                        <div className="h-2 bg-muted/50 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">Why Choose <span className="text-primary">PaperMorph?</span></h2>
              <p className="text-muted-foreground mb-8">Join thousands of professionals who have transformed their writing workflow.</p>

              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border bounce-on-hover">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-0.5">{benefit.title}</h4>
                      <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-card rounded-lg border border-border p-6 card-3d">
                <h4 className="font-semibold text-foreground mb-4 text-center">Productivity Boost</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Writing Speed', value: 85 },
                    { label: 'Quality Improvement', value: 92 },
                    { label: 'Time Saved', value: 78 },
                    { label: 'User Satisfaction', value: 96 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className="text-xs font-semibold text-primary">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">Perfect for <span className="text-primary">Everyone</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From students to enterprises, PaperMorph adapts to your needs.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {useCases.map((useCase, index) => (
              <div key={index} className="p-5 bg-card rounded-lg border border-border text-center fall-on-hover cursor-pointer hover:border-primary transition-colors">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                  {useCase.icon}
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-0.5">{useCase.title}</h4>
                <p className="text-xs text-muted-foreground">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">Works With Your <span className="text-primary">Tools</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Connect with the apps you already use.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((integration, index) => (
              <div key={index} className="w-20 h-20 bg-card rounded-lg border border-border flex flex-col items-center justify-center bounce-on-hover text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                {integration.icon}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">Simple <span className="text-primary">Pricing</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">Choose the plan that works for you.</p>

            <div className="inline-flex items-center gap-1 p-1 bg-card rounded-full border border-border">
              <button className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billingPeriod === 'monthly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setBillingPeriod('monthly')}>Monthly</button>
              <button className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billingPeriod === 'yearly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setBillingPeriod('yearly')}>Yearly <span className="text-xs opacity-70">-20%</span></button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`p-6 rounded-lg border ${plan.highlighted ? 'bg-primary border-primary scale-105' : 'bg-card border-border'} card-3d`}>
                {plan.highlighted && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Crown className="h-4 w-4 text-primary-foreground" />
                    <span className="text-xs font-semibold text-primary-foreground">Most Popular</span>
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-primary-foreground' : 'text-foreground'}`}>{plan.name}</h3>
                <p className={`text-xs mb-4 ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{plan.description}</p>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-primary-foreground' : 'text-foreground'}`}>${plan.price[billingPeriod]}</span>
                  <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>/{billingPeriod === 'yearly' ? 'year' : 'month'}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-2 text-sm ${plan.highlighted ? 'text-primary-foreground' : 'text-foreground'}`}>
                      <CheckCircle className={`h-4 w-4 ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/auth?mode=signup')} className={`w-full py-2.5 rounded-full font-semibold text-sm transition-all ${plan.highlighted ? 'bg-foreground text-background btn-3d' : 'bg-primary text-primary-foreground btn-3d-orange'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">Loved by <span className="text-primary">Thousands</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">See what our users have to say.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-card rounded-lg border border-border card-3d">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-primary fill-current" />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-4 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">{testimonial.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">Frequently Asked <span className="text-primary">Questions</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Got questions? We've got answers.</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card rounded-lg border border-border overflow-hidden">
                <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span className="font-semibold text-foreground text-sm">{faq.question}</span>
                  <div className={`transition-transform duration-300 ${openFaq === index ? 'rotate-45' : ''}`}>
                    <Plus className="h-4.5 w-4.5 text-primary" />
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-4 animate-fade-up">
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA & FOOTER */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">Ready to Transform Your <span className="text-primary">Writing?</span></h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Join 500,000+ users who write smarter with PaperMorph.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => navigate('/auth?mode=signup')} className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full btn-3d-orange flex items-center gap-2">
                Get Started Free <ArrowRight className="h-4.5 w-4.5" />
              </button>
              <button className="px-8 py-3 bg-secondary text-foreground font-semibold rounded-lg border border-border flex items-center gap-2 btn-3d">
                <MessageCircle className="h-4.5 w-4.5" /> Contact Sales
              </button>
            </div>
          </div>

          <footer className="border-t border-border pt-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <img src={logo} alt="PaperMorph" className="h-8 mb-4" />
                <p className="text-sm text-muted-foreground mb-4">The AI-powered document editor for the modern age.</p>
                <div className="flex gap-2">
                  {[<Instagram className="h-4.5 w-4.5" />, <Facebook className="h-4.5 w-4.5" />, <Globe className="h-4.5 w-4.5" />].map((icon, i) => (
                    <button key={i} className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-colors bounce-on-hover">
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { title: 'Product', links: ['Features', 'Pricing', 'Templates', 'Integrations'] },
                { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
                { title: 'Support', links: ['Help Center', 'Contact', 'Privacy', 'Terms'] },
              ].map((section, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-foreground mb-3 text-sm">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">© 2024 PaperMorph. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;