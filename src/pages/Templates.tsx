import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, FileText, Mail, FileBarChart, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const templates = [
  { id: 'blank', name: 'Blank Document', description: 'Start from scratch', icon: FileText, category: 'Basic' },
  { id: 'letter', name: 'Professional Letter', description: 'Formal business letter', icon: Mail, category: 'Business' },
  { id: 'report', name: 'Business Report', description: 'Structured report template', icon: FileBarChart, category: 'Business' },
  { id: 'resume', name: 'Resume', description: 'Professional resume template', icon: Briefcase, category: 'Career' },
  { id: 'essay', name: 'Academic Essay', description: 'Essay with proper structure', icon: GraduationCap, category: 'Education' },
];

export default function Templates() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState<string | null>(null);

  const filtered = templates.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const createFromTemplate = async (templateId: string) => {
    if (!user) { navigate('/auth'); return; }
    
    setCreating(templateId);
    try {
      const template = templates.find(t => t.id === templateId);
      const { data, error } = await supabase.from('documents').insert({
        user_id: user.id,
        title: template?.name || 'New Document',
        template_id: templateId,
        status: 'draft'
      }).select().single();

      if (error) throw error;
      navigate(`/editor/${data.id}`);
    } catch (error) {
      toast.error('Failed to create document');
    } finally {
      setCreating(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <h1 className="text-3xl font-bold mb-2">Templates</h1>
        <p className="text-muted-foreground mb-6">Start with a template to save time</p>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template) => (
            <Card key={template.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => createFromTemplate(template.id)}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <template.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{template.name}</h3>
                      {creating === template.id && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">{template.category}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
