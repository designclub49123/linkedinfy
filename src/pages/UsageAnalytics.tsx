import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/state/useUserStore';
import { useDocStore } from '@/state/useDocStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  Zap,
  Users,
  Eye,
  Download,
  Calendar,
  Activity,
  Target,
  Award,
  BookOpen,
  MessageSquare,
  Star,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

export default function UsageAnalytics() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { documents } = useDocStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock analytics data
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalDocuments: 156,
      totalWords: 45678,
      totalSessions: 89,
      avgSessionDuration: 23,
      documentsCreated: 12,
      documentsEdited: 34,
      aiFeaturesUsed: 89,
      productivityScore: 85,
    },
    documents: {
      created: [12, 19, 8, 15, 22, 18, 25],
      edited: [34, 28, 45, 32, 38, 42, 35],
      deleted: [2, 1, 3, 1, 2, 1, 2],
    },
    aiUsage: {
      writingAssistant: 45,
      grammarCheck: 32,
      translation: 18,
      contentGenerator: 28,
      chatAssistant: 56,
      summarization: 12,
    },
    productivity: {
      daily: [65, 78, 82, 71, 88, 92, 85],
      weekly: [75, 82, 78, 85],
      monthly: [72, 78, 82, 85, 88],
    },
    timeSpent: {
      writing: 45,
      editing: 25,
      research: 15,
      formatting: 10,
      aiAssistance: 5,
    },
  });

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Analytics data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Analytics data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 0) {
      return { icon: ArrowUpRight, color: 'text-green-600', value: `+${change.toFixed(1)}%` };
    } else if (change < 0) {
      return { icon: ArrowDownRight, color: 'text-red-600', value: `${change.toFixed(1)}%` };
    }
    return { icon: Minus, color: 'text-gray-600', value: '0%' };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Usage Analytics</h1>
            <p className="text-muted-foreground mt-1">Track your productivity and application usage</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleRefreshData} disabled={isLoading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportData} disabled={isLoading} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="gap-2">
              <FileText className="h-4 w-4" />
              Back to Editor
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Zap className="h-4 w-4" />
              AI Usage
            </TabsTrigger>
            <TabsTrigger value="productivity" className="gap-2">
              <Target className="h-4 w-4" />
              Productivity
            </TabsTrigger>
            <TabsTrigger value="time" className="gap-2">
              <Clock className="h-4 w-4" />
              Time Analysis
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Total Documents',
                  value: analyticsData.overview.totalDocuments,
                  change: 12,
                  icon: FileText,
                  color: 'text-blue-600',
                },
                {
                  title: 'Total Words Written',
                  value: analyticsData.overview.totalWords.toLocaleString(),
                  change: 8,
                  icon: MessageSquare,
                  color: 'text-green-600',
                },
                {
                  title: 'Sessions',
                  value: analyticsData.overview.totalSessions,
                  change: -3,
                  icon: Users,
                  color: 'text-purple-600',
                },
                {
                  title: 'Productivity Score',
                  value: `${analyticsData.overview.productivityScore}%`,
                  change: 5,
                  icon: Award,
                  color: 'text-orange-600',
                },
              ].map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {metric.change > 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          ) : metric.change < 0 ? (
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                          ) : (
                            <Minus className="h-4 w-4 text-gray-600" />
                          )}
                          <span className={`text-sm ${metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg bg-muted ${metric.color}`}>
                        <metric.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Activity</CardTitle>
                  <CardDescription>Documents created, edited, and deleted over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-12 text-sm font-medium">{day}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(analyticsData.documents.created[index] / 30) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">
                              {analyticsData.documents.created[index]}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Productivity Trend</CardTitle>
                  <CardDescription>Your daily productivity score over the last week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-12 text-sm font-medium">{day}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={analyticsData.productivity.daily[index]} 
                              className="flex-1" 
                            />
                            <span className="text-xs text-muted-foreground w-8">
                              {analyticsData.productivity.daily[index]}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Created</span>
                    <Badge variant="secondary">{analyticsData.overview.documentsCreated}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Edited</span>
                    <Badge variant="secondary">{analyticsData.overview.documentsEdited}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Words</span>
                    <Badge variant="secondary">293</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Most Active Day</span>
                    <Badge variant="secondary">Wednesday</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Documents</CardTitle>
                  <CardDescription>Your most recently created and edited documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {documents.slice(0, 10).map((doc, index) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(doc.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Document</Badge>
                            <Badge variant="secondary">{doc.templateId || 'Custom'}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Usage Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Feature Usage</CardTitle>
                  <CardDescription>How often you use different AI features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData.aiUsage).map(([feature, count]) => (
                      <div key={feature} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(count / 56) * 100}%` }}
                            />
                          </div>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Performance</CardTitle>
                  <CardDescription>AI assistant performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                      <Badge variant="secondary">1.2s</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Accuracy</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
                      </div>
                      <Badge variant="secondary">92%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Satisfaction</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '88%' }} />
                      </div>
                      <Badge variant="secondary">88%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Productivity Tab */}
          <TabsContent value="productivity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Productivity Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary mb-2">
                      {analyticsData.overview.productivityScore}%
                    </div>
                    <p className="text-muted-foreground">Great job! You're more productive than 75% of users</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Productivity Trends</CardTitle>
                  <CardDescription>Your productivity over different time periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Daily Average</span>
                        <Badge variant="secondary">82%</Badge>
                      </div>
                      <Progress value={82} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Weekly Average</span>
                        <Badge variant="secondary">78%</Badge>
                      </div>
                      <Progress value={78} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Monthly Average</span>
                        <Badge variant="secondary">81%</Badge>
                      </div>
                      <Progress value={81} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Productivity Insights</CardTitle>
                <CardDescription>AI-powered insights to improve your productivity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Peak Productivity</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You're most productive between 9 AM - 12 PM. Schedule important tasks during this time.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Focus Areas</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You spend 45% of your time writing. Consider using AI assistance to boost efficiency.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Achievement</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You've written 10,000+ words this month! Keep up the great work.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Recommendation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Try using the content generator for brainstorming to save time on initial drafts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Time Analysis Tab */}
          <TabsContent value="time" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Time Distribution</CardTitle>
                  <CardDescription>How you spend your time in the application</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData.timeSpent).map(([activity, percentage]) => (
                      <div key={activity} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {activity.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <Badge variant="secondary">{percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Analytics</CardTitle>
                  <CardDescription>Statistics about your work sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Session Duration</span>
                    <Badge variant="secondary">{analyticsData.overview.avgSessionDuration} min</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Longest Session</span>
                    <Badge variant="secondary">2h 15min</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Time Today</span>
                    <Badge variant="secondary">3h 42min</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Most Productive Hour</span>
                    <Badge variant="secondary">10:00 AM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Breaks Taken</span>
                    <Badge variant="secondary">4</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Time Management Tips</CardTitle>
                <CardDescription>Personalized recommendations to improve your time management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Pomodoro Technique</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Try working in 25-minute focused sessions with 5-minute breaks.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Take Regular Breaks</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You work best when taking breaks every 45-60 minutes.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Set Daily Goals</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Set specific word count goals to maintain consistent progress.
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
