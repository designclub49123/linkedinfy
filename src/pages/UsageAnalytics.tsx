import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  BarChart3, FileText, Clock, Zap, Download, Target,
  Award, Star, RefreshCw,
} from 'lucide-react';

interface DocRow {
  id: string;
  title: string;
  word_count: number;
  status: string;
  is_favorite: boolean;
  updated_at: string;
}

interface AiRow {
  action_type: string;
  tokens_used: number;
}

export default function UsageAnalytics() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [aiActions, setAiActions] = useState<AiRow[]>([]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [docsRes, aiRes] = await Promise.all([
        supabase
          .from('documents')
          .select('id, title, word_count, status, is_favorite, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false }),
        supabase
          .from('ai_usage')
          .select('action_type, tokens_used')
          .eq('user_id', user.id),
      ]);
      setDocs(docsRes.data || []);
      setAiActions(aiRes.data || []);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const totalWords = docs.reduce((sum, d) => sum + (d.word_count || 0), 0);
  const favoriteCount = docs.filter(d => d.is_favorite).length;
  const totalTokens = aiActions.reduce((sum, a) => sum + (a.tokens_used || 0), 0);

  // Group AI usage by action type
  const aiByType: Record<string, number> = {};
  aiActions.forEach(a => {
    aiByType[a.action_type] = (aiByType[a.action_type] || 0) + 1;
  });
  const maxAiCount = Math.max(...Object.values(aiByType), 1);

  const handleExportData = () => {
    const exportPayload = { documents: docs, aiUsage: aiActions, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics exported');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}><CardContent className="pt-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
            <Button variant="outline" onClick={fetchData} disabled={isLoading} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportData} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
              <FileText className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Documents', value: docs.length, icon: FileText },
            { title: 'Total Words', value: totalWords.toLocaleString(), icon: BarChart3 },
            { title: 'Favorites', value: favoriteCount, icon: Star },
            { title: 'AI Actions', value: aiActions.length, icon: Zap },
          ].map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <metric.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Your most recently edited documents</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[350px]">
                <div className="space-y-3">
                  {docs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No documents yet</p>
                  ) : (
                    docs.slice(0, 15).map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/editor/${doc.id}`)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(doc.updated_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="secondary" className="text-xs">{doc.word_count} words</Badge>
                          {doc.is_favorite && <Star className="h-3 w-3 text-primary fill-primary" />}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* AI Usage Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>AI Feature Usage</CardTitle>
              <CardDescription>How often you use different AI features</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(aiByType).length === 0 ? (
                <div className="text-center py-8">
                  <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No AI usage recorded yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Start using AI tools to see stats here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(aiByType)
                    .sort(([, a], [, b]) => b - a)
                    .map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {type.replace(/[_-]/g, ' ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${(count / maxAiCount) * 100}%` }}
                            />
                          </div>
                          <Badge variant="secondary" className="text-xs">{count}</Badge>
                        </div>
                      </div>
                    ))}
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total tokens used</span>
                      <span className="font-medium">{totalTokens.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
