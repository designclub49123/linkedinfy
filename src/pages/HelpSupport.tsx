import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  HelpCircle,
  MessageSquare,
  BookOpen,
  Mail,
  Phone,
  ExternalLink,
  Search,
  FileText,
  Video,
  Users,
  Zap,
  Shield,
  Settings,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Lightbulb,
  Target,
  Award,
  TrendingUp,
  Headphones,
  Globe,
  Github,
  Twitter,
  Facebook,
  Eye,
} from 'lucide-react';

export default function HelpSupport() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('help');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data
  const categories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'getting-started', name: 'Getting Started', icon: BookOpen },
    { id: 'editor', name: 'Editor Features', icon: FileText },
    { id: 'ai-features', name: 'AI Features', icon: Zap },
    { id: 'account', name: 'Account & Billing', icon: Shield },
    { id: 'technical', name: 'Technical Issues', icon: Settings },
  ];

  const helpArticles = [
    {
      id: 1,
      title: 'Getting Started with Papermorph',
      category: 'getting-started',
      description: 'Learn the basics of using Papermorph and its core features.',
      readTime: '5 min',
      difficulty: 'Beginner',
      views: 1234,
      helpful: 89,
    },
    {
      id: 2,
      title: 'Using the AI Writing Assistant',
      category: 'ai-features',
      description: 'Master the AI writing assistant to improve your content creation.',
      readTime: '8 min',
      difficulty: 'Intermediate',
      views: 892,
      helpful: 94,
    },
    {
      id: 3,
      title: 'Document Formatting and Styles',
      category: 'editor',
      description: 'Learn how to format your documents with advanced styling options.',
      readTime: '6 min',
      difficulty: 'Beginner',
      views: 756,
      helpful: 87,
    },
    {
      id: 4,
      title: 'Collaboration Features',
      category: 'editor',
      description: 'Work together with your team in real-time using collaboration tools.',
      readTime: '10 min',
      difficulty: 'Advanced',
      views: 623,
      helpful: 91,
    },
    {
      id: 5,
      title: 'Managing Your Account',
      category: 'account',
      description: 'Update your profile, manage subscriptions, and control privacy settings.',
      readTime: '4 min',
      difficulty: 'Beginner',
      views: 1456,
      helpful: 85,
    },
    {
      id: 6,
      title: 'Troubleshooting Common Issues',
      category: 'technical',
      description: 'Solve common technical problems and get back to writing quickly.',
      readTime: '7 min',
      difficulty: 'Intermediate',
      views: 934,
      helpful: 88,
    },
  ];

  const videoTutorials = [
    {
      id: 1,
      title: 'Papermorph Complete Tutorial',
      duration: '15:42',
      thumbnail: '/api/placeholder/320/180',
      views: 12543,
      category: 'getting-started',
    },
    {
      id: 2,
      title: 'AI Writing Assistant Demo',
      duration: '8:23',
      thumbnail: '/api/placeholder/320/180',
      views: 8934,
      category: 'ai-features',
    },
    {
      id: 3,
      title: 'Advanced Formatting Techniques',
      duration: '12:15',
      thumbnail: '/api/placeholder/320/180',
      views: 6782,
      category: 'editor',
    },
    ];

  const faqs = [
    {
      id: 1,
      question: 'How do I get started with Papermorph?',
      answer: 'Papermorph is designed to be intuitive. Start by creating a new document or choosing from our templates. The AI assistant can help you with content suggestions, and our comprehensive toolbar provides all formatting options you need.',
      category: 'getting-started',
      helpful: 156,
    },
    {
      id: 2,
      question: 'What AI features are available?',
      answer: 'Papermorph includes AI Writing Assistant, Grammar Check, Translation, Content Generator, Chat Assistant, Summarization, Sentiment Analysis, Keyword Extraction, and Text Analytics. Each tool is designed to enhance your writing experience.',
      category: 'ai-features',
      helpful: 234,
    },
    {
      id: 3,
      question: 'Can I collaborate with others?',
      answer: 'Yes! Papermorph supports real-time collaboration. You can share documents, work together simultaneously, leave comments, and track changes. Collaboration features are available for all premium users.',
      category: 'editor',
      helpful: 189,
    },
    {
      id: 4,
      question: 'How do I export my documents?',
      answer: 'You can export your documents in multiple formats including PDF, DOCX, TXT, and HTML. Use the export button in the toolbar or go to File > Export. You can also export all your data from the settings page.',
      category: 'editor',
      helpful: 145,
    },
    {
      id: 5,
      question: 'What subscription plans are available?',
      answer: 'We offer Free, Pro, and Enterprise plans. The Free plan includes basic features, Pro adds advanced AI features and collaboration, and Enterprise includes custom solutions and priority support.',
      category: 'account',
      helpful: 267,
    },
  ];

  const contactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general',
  };

  const [formData, setFormData] = useState(contactForm);

  const { user } = useAuth();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in first'); return; }
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('support_tickets').insert({
        user_id: user.id,
        subject: formData.subject.trim(),
        description: formData.message.trim(),
        priority: 'medium',
      });
      if (error) throw error;
      toast.success('Support request submitted successfully. We\'ll get back to you soon!');
      setFormData(contactForm);
    } catch (error) {
      console.error('Support ticket error:', error);
      toast.error('Failed to submit support request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
            <p className="text-muted-foreground mt-1">Get help, learn, and connect with our community</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
              <FileText className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="help" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Help Center
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="gap-2">
              <Video className="h-4 w-4" />
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="community" className="gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>

          {/* Help Center Tab */}
          <TabsContent value="help" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">Getting Started</h3>
                  <p className="text-sm text-muted-foreground">Learn the basics</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">AI Features</h3>
                  <p className="text-sm text-muted-foreground">Master AI tools</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Video className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground">Watch & learn</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Get instant help</p>
                </CardContent>
              </Card>
            </div>

            {/* Help Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Help Articles</CardTitle>
                <CardDescription>Comprehensive guides to help you master Papermorph</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{article.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{article.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary">{article.difficulty}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.readTime}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views} views
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTutorials.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative">
                    <div className="w-full h-40 bg-muted flex items-center justify-center">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{video.views.toLocaleString()} views</p>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      Watch Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Live Sessions</CardTitle>
                <CardDescription>Join live workshops and Q&A sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">AI Writing Workshop</h3>
                        <p className="text-sm text-muted-foreground">Learn advanced AI writing techniques</p>
                        <p className="text-xs text-muted-foreground mt-1">Tomorrow, 2:00 PM EST</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Register</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-accent rounded-lg">
                        <Target className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">Productivity Masterclass</h3>
                        <p className="text-sm text-muted-foreground">Boost your writing productivity</p>
                        <p className="text-xs text-muted-foreground mt-1">Friday, 3:00 PM EST</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Register</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="border rounded-lg">
                      <div className="p-4">
                        <h3 className="font-medium text-foreground">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Helpful ({faq.helpful})
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Not helpful
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>Get in touch with our support team</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium">Category</label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <textarea
                        id="message"
                        className="w-full min-h-[120px] p-3 border border-input rounded-md resize-none bg-background text-foreground"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Other Ways to Reach Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-muted-foreground">support@papermorph.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Headphones className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-muted-foreground">Available 9 AM - 6 PM EST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Times</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Support</span>
                      <Badge variant="secondary">24 hours</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Live Chat</span>
                      <Badge variant="secondary">Instant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Phone Support</span>
                      <Badge variant="secondary">During business hours</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community Forum
                  </CardTitle>
                  <CardDescription>Connect with other users</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join our vibrant community of writers, researchers, and professionals.
                  </p>
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Join Forum
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Twitter className="h-5 w-5" />
                    Twitter
                  </CardTitle>
                  <CardDescription>Follow us for updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the latest news, tips, and feature announcements.
                  </p>
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Follow @papermorph
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    GitHub
                  </CardTitle>
                  <CardDescription>Open source contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contribute to our open source projects and report issues.
                  </p>
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View on GitHub
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Community Highlights</CardTitle>
                <CardDescription>See what our community is creating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">User of the Month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Congratulations to Sarah Johnson for writing 50,000 words this month!
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Top Contributor</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mike Chen has helped 100+ users in our community forum this month.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
