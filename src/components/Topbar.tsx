import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocStore } from '@/state/useDocStore';
import { useUserStore } from '@/state/useUserStore';
import { useEditorStore } from '@/state/useEditorStore';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Save,
  Download,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Check,
  Loader2,
  Cloud,
  Presentation,
  AlertTriangle,
  RefreshCw,
  Zap,
  HelpCircle,
  History,
  FileDown,
} from 'lucide-react';
import { Palette } from 'lucide-react';
import { AIToolsDropdown } from '@/components/AIToolsDropdown';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';
import VersionHistory from '@/components/VersionHistory';
import AdvancedExportDialog from '@/components/AdvancedExportDialog';
import { toast } from 'sonner';
import { exportToDOCX, exportToTXT } from '@/utils/exportDocument';
import { cn } from '@/lib/utils';
import logo from '/logo.png';
import logo1 from '/logo1.png';

export function Topbar() {
  const navigate = useNavigate();
  const { id: documentId } = useParams();
  const { currentDocument, saveStatus, updateDocumentTitle, saveDocument, autoSave } = useDocStore();
  const { theme, colorTheme, toggleTheme, setColorTheme } = useUserStore();
  const { user, signOut } = useAuth();
  const { contentRef, editor } = useEditorStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentDocument?.title || 'Untitled Document');
  const [isExporting, setIsExporting] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);

  // Handle save error notifications
  useEffect(() => {
    const handleSaveError = (event: CustomEvent) => {
      toast.error(`Save failed: ${event.detail?.message}`);
      setShowSaveError(true);
    };

    window.addEventListener('documentSaveError', handleSaveError as EventListener);
    return () => window.removeEventListener('documentSaveError', handleSaveError as EventListener);
  }, []);

  // Auto-save setup
  useEffect(() => {
    const cleanup = autoSave();
    return cleanup;
  }, [autoSave]);

  // Sync title value with current document
  useEffect(() => {
    if (!isEditingTitle) {
      setTitleValue(currentDocument?.title || 'Untitled Document');
    }
  }, [currentDocument?.title, isEditingTitle]);

  const handleRetrySave = async () => {
    setIsRetrying(true);
    try {
      await saveDocument();
      setShowSaveError(false);
      toast.success('Document saved successfully');
    } catch {
      toast.error('Retry failed. Please check your connection.');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleTitleClick = () => {
    setTitleValue(currentDocument?.title || 'Untitled Document');
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleValue.trim()) {
      updateDocumentTitle(titleValue.trim());
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleBlur();
    if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTitleValue(currentDocument?.title || 'Untitled Document');
    }
  };

  const handleExport = async (format: 'docx' | 'txt') => {
    if (!currentDocument) {
      toast.error('No document to export');
      return;
    }
    setIsExporting(true);
    try {
      if (format === 'docx') {
        await exportToDOCX(currentDocument, contentRef);
        toast.success('Word document exported');
      } else {
        await exportToTXT(currentDocument, contentRef);
        toast.success('Text file exported');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
      case 'saved':
        return <Check className="h-4 w-4 text-green-600 dark:text-green-400" />;
      default:
        return showSaveError
          ? <AlertTriangle className="h-4 w-4 text-destructive" />
          : <Cloud className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving': return 'Saving...';
      case 'saved': return 'Saved';
      default: return showSaveError ? 'Save failed' : 'Unsaved';
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 gap-3 relative z-50 bg-background">
      {/* Logo & Document */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="h-10 shrink-0 rounded-lg overflow-hidden">
          <img
            src={theme === 'dark' ? logo : logo1}
            alt="PaperMorph"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="h-5 w-px bg-border hidden lg:block" />

        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="bg-transparent border-none outline-none font-semibold text-sm w-full min-w-0 text-foreground"
              placeholder="Document name..."
            />
          ) : (
            <span
              onClick={handleTitleClick}
              className="font-semibold text-sm cursor-pointer truncate text-foreground hover:text-primary transition-colors"
              title="Click to rename"
            >
              {titleValue || 'Untitled Document'}
            </span>
          )}

          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-muted-foreground shrink-0">
            {getSaveStatusIcon()}
            <span className="hidden sm:block">{getSaveStatusText()}</span>
            {showSaveError && (
              <button onClick={handleRetrySave} disabled={isRetrying} className="hover:text-destructive p-0.5">
                <RefreshCw className={cn("h-3 w-3", isRetrying && "animate-spin")} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <Button
          variant={saveStatus === 'saved' ? 'outline' : 'default'}
          size="sm"
          onClick={() => saveDocument()}
          disabled={saveStatus === 'saving'}
          className="gap-1.5 h-8 px-3"
        >
          {saveStatus === 'saving' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          <span className="hidden sm:block text-sm">Save</span>
        </Button>

        <div className="h-4 w-px bg-border" />

        {/* Version History */}
        {documentId && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setShowVersionHistory(true)}>
                <History className="h-3.5 w-3.5" />
                <span className="hidden lg:block text-sm ml-1">History</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Version history</TooltipContent>
          </Tooltip>
        )}

        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 h-8 px-2" disabled={isExporting}>
              {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              <span className="hidden lg:block text-sm">Export</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={() => handleExport('docx')} className="gap-2">
              <Presentation className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium text-sm">Word Document</div>
                <div className="text-xs text-muted-foreground">Editable .docx</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('txt')} className="gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">Plain Text</div>
                <div className="text-xs text-muted-foreground">.txt format</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowAdvancedExport(true)} className="gap-2">
              <FileDown className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium text-sm">Advanced Export</div>
                <div className="text-xs text-muted-foreground">PDF, headers, watermarks</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
              <Palette className="h-3.5 w-3.5" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {([
              { id: 'orange' as const, label: 'Orange', color: 'hsl(15 90% 55%)' },
              { id: 'blue' as const, label: 'Blue', color: 'hsl(212 100% 50%)' },
              { id: 'green' as const, label: 'Green', color: 'hsl(142 76% 36%)' },
              { id: 'red' as const, label: 'Red', color: 'hsl(0 72% 51%)' },
            ]).map((t) => (
              <DropdownMenuItem key={t.id} onClick={() => setColorTheme(t.id)} className="gap-2">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="flex-1">{t.label}</span>
                {colorTheme === t.id && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleTheme} className="gap-2">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AIToolsDropdown />
        <NotificationsDropdown />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 h-8 px-2 hover:bg-accent">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2 border-b border-border">
              <div className="font-medium text-sm">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>

            <DropdownMenuItem onClick={() => navigate('/dashboard')} className="gap-2">
              <FileText className="h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/billing')} className="gap-2">
              <Zap className="h-4 w-4" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/help')} className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialogs */}
      {documentId && (
        <VersionHistory
          documentId={documentId}
          currentContent={currentDocument?.content || ''}
          onRestore={(content) => {
            if (editor?.documentEditor?.editor) {
              editor.documentEditor.selection.selectAll();
              editor.documentEditor.editor.delete();
              editor.documentEditor.editor.insertText(content);
              toast.success('Version restored');
            }
          }}
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
        />
      )}

      <AdvancedExportDialog
        isOpen={showAdvancedExport}
        onClose={() => setShowAdvancedExport(false)}
        documentName={currentDocument?.title || 'Untitled Document'}
        content={currentDocument?.content || ''}
        onExport={(options) => {
          console.log('Export with options:', options);
        }}
      />
    </header>
  );
}

export default Topbar;
