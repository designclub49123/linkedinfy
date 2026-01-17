import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Crown, Zap, CreditCard, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function Billing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('user_id', user.id).single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  const storageUsedPercent = profile ? Math.round((profile.storage_used / profile.storage_limit) * 100) : 0;
  const storageUsedMB = profile ? Math.round(profile.storage_used / (1024 * 1024)) : 0;
  const storageLimitGB = profile ? Math.round(profile.storage_limit / (1024 * 1024 * 1024)) : 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground mb-8">Manage your plan and payment details</p>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary" className="text-lg px-4 py-1 capitalize">
                    {profile?.subscription_tier || 'Free'}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {profile?.subscription_tier === 'free' ? '5 documents/month, 1GB storage' : 'Unlimited documents, 50GB storage'}
                  </p>
                </div>
                <Button onClick={() => navigate('/pricing')}>
                  <Crown className="h-4 w-4 mr-2" /> Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={storageUsedPercent} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">
                {storageUsedMB} MB of {storageLimitGB} GB used ({storageUsedPercent}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No payment method on file.</p>
              <Button variant="outline" className="mt-4">Add Payment Method</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
