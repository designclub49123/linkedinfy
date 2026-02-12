import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  History, 
  RotateCcw, 
  Eye, 
  Clock, 
  FileText,
  ChevronRight,
  X,
  Check,
  Loader2,
  GitBranch
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import DOMPurify from 'dompurify';

interface Version {
  id: string;
  version_number: number;
  content: string | null;
  content_html: string | null;
  created_at: string;
  document_id: string;
}

interface VersionHistoryProps {
  documentId: string;
  currentContent: string;
  onRestore: (content: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  documentId,
  currentContent,
  onRestore,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (isOpen && documentId) {
      fetchVersions();
    }
  }, [isOpen, documentId]);

  const fetchVersions = async () => {
    if (!user || !documentId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .eq('user_id', user.id)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Failed to fetch versions:', error);
      toast.error('Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (version: Version) => {
    setSelectedVersion(version);
    setPreviewContent(version.content || version.content_html || '');
  };

  const handleRestore = async () => {
    if (!selectedVersion) return;
    
    setRestoring(true);
    try {
      const content = selectedVersion.content || selectedVersion.content_html || '';
      
      // Save current content as a new version before restoring
      if (user && currentContent) {
        const latestVersionNumber = versions.length > 0 ? versions[0].version_number : 0;
        await supabase.from('document_versions').insert({
          document_id: documentId,
          user_id: user.id,
          version_number: latestVersionNumber + 1,
          content: currentContent,
          content_html: currentContent
        });
      }
      
      onRestore(content);
      toast.success(`Restored to version ${selectedVersion.version_number}`);
      onClose();
    } catch (error) {
      console.error('Failed to restore version:', error);
      toast.error('Failed to restore version');
    } finally {
      setRestoring(false);
    }
  };

  const getVersionLabel = (version: Version, index: number) => {
    if (index === 0) return 'Latest';
    if (index === versions.length - 1) return 'Original';
    return `Version ${version.version_number}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <History className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Version History</DialogTitle>
              <DialogDescription className="text-sm">
                View and restore previous versions of your document
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Versions List */}
          <div className="w-80 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GitBranch className="h-4 w-4" />
                <span>{versions.length} versions saved</span>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-3 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))
                ) : versions.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No versions yet</p>
                    <p className="text-xs mt-1">Versions are saved automatically</p>
                  </div>
                ) : (
                  versions.map((version, index) => (
                    <button
                      key={version.id}
                      onClick={() => handlePreview(version)}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-all",
                        "hover:bg-accent/50",
                        selectedVersion?.id === version.id && "bg-accent border border-primary/20"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {getVersionLabel(version, index)}
                        </span>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 flex flex-col">
            {selectedVersion ? (
              <>
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Preview - Version {selectedVersion.version_number}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleRestore}
                    disabled={restoring}
                    className="gap-2"
                  >
                    {restoring ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4" />
                    )}
                    Restore This Version
                  </Button>
                </div>
                
                <ScrollArea className="flex-1 p-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div 
                      className="whitespace-pre-wrap bg-muted/50 rounded-lg p-4 text-sm"
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(previewContent?.replace(/\n/g, '<br/>') || '')
                      }}
                    />
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a version to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VersionHistory;
