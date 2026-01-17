import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Check, FolderOpen, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function OnboardingWorkspaceSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [workspaceName, setWorkspaceName] = useState('My Workspace');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Update default workspace name
      const { error: workspaceError } = await supabase
        .from('workspaces')
        .update({ name: workspaceName })
        .eq('user_id', user!.id)
        .eq('is_default', true);

      if (workspaceError) throw workspaceError;

      // Mark onboarding as complete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', user!.id);

      if (profileError) throw profileError;
      
      toast.success('You\'re all set! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete setup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">Step 3 of 3</Badge>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create your workspace</h1>
          <p className="text-muted-foreground">
            Organize your documents in a workspace
          </p>
        </div>

        <Card className="border-border/50">
          <CardContent className="pt-6 space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FolderOpen className="h-10 w-10 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workspaceName">Workspace Name</Label>
              <Input
                id="workspaceName"
                placeholder="e.g., Personal, Work, School"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can create more workspaces later
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                What you'll get:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  AI-powered writing assistance
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Beautiful document templates
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Export to PDF, Word & more
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Cloud sync across devices
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => navigate('/onboarding/profile')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleComplete} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Complete Setup
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
