import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocStore } from '@/state/useDocStore';
import { useUserStore } from '@/state/useUserStore';
import { useEditorStore } from '@/state/useEditorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Shield,
  Zap,
  Globe,
  HelpCircle,
  Search,
  Menu,
  X,
  Crown,
  Star,
  TrendingUp,
  Monitor,
  Users,
  CreditCard,
} from 'lucide-react';
import { APP_NAME } from '@/constants';
import { Palette } from 'lucide-react';
import ThemeSelector from '@/components/ThemeSelector';
import { AIToolsDropdown } from '@/components/AIToolsDropdown';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';
import { toast } from 'sonner';
import { exportToDOCX, exportToTXT } from '@/utils/exportDocument';
import { cn } from '@/lib/utils';
import logo from '/logo.png';
import logo1 from '/logo1.png';
import SecurityService from '@/security/SecurityService';
import SecurityMiddleware from '@/security/SecurityMiddleware';

export function Topbar() {
  const navigate = useNavigate();
  const { currentDocument, saveStatus, updateDocumentTitle, saveDocument, autoSave, createNewDocument } = useDocStore();
  const { user, theme, colorTheme, toggleTheme, setColorTheme, logout } = useUserStore();
  const { contentRef } = useEditorStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(currentDocument?.title || 'Untitled Document');
  const [isExporting, setIsExporting] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Initialize security services
  useEffect(() => {
    const securityMiddleware = SecurityMiddleware.getInstance();
    const securityService = SecurityService.getInstance();
    
    // Initialize security monitoring
    // Note: applySecurityHeaders is not a method, remove this call
    
    // Track user session
    if (user) {
      // Note: createSession is not a method on SecurityService, remove this call
      console.log('Security services initialized for user:', user.id);
    }
  }, [user]);

  // Handle save error notifications
  useEffect(() => {
    const handleSaveError = (event: CustomEvent) => {
      const { message } = event.detail;
      toast.error(`Save failed: ${message}`);
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
    } catch (error) {
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
      setTitleValue(titleValue.trim()); // Update the displayed value immediately
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setTitleValue(currentDocument?.title || 'Untitled Document');
    }
  };

  const handleExport = async (format: 'docx' | 'txt') => {
    // Create a new document if none exists
    if (!currentDocument) {
      createNewDocument();
      // Wait a moment for the document to be created
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const updatedDoc = useDocStore.getState().currentDocument;
    if (!updatedDoc) {
      toast.error('Failed to create document for export');
      return;
    }

    setIsExporting(true);
    try {
      switch (format) {
        case 'docx':
          await exportToDOCX(updatedDoc, contentRef);
          toast.success('Word document exported successfully');
          break;
        case 'txt':
          await exportToTXT(updatedDoc, contentRef);
          toast.success('Text file exported successfully');
          break;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      toast.error(message);
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
      case 'saved':
        return <Check className="h-4 w-4 text-success" />;
      default:
        if (showSaveError) {
          return <AlertTriangle className="h-4 w-4 text-destructive" />;
        }
        return <Cloud className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      default:
        if (showSaveError) {
          return 'Save failed';
        }
        return 'Unsaved changes';
    }
  };

  return (
    <header className={`h-16 border-b flex items-center justify-between px-6 gap-4 relative z-50 transition-colors duration-200 ${
      theme === 'dark' 
        ? 'border-gray-800 bg-[#000000]' 
        : 'border-gray-200 bg-white'
    }`}>
      {/* Logo & Document Section */}
      <div className="flex items-center gap-4 min-w-0 flex-1 relative">
        {/* Logo Only */}
        <div className="flex items-center shrink-0">
          <div className="h-12 w- rounded-lg overflow-hidden">
            <img 
              src={theme === 'dark' ? logo : logo1} 
              alt="PaperMorph Logo" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className={`h-6 w-px hidden lg:block ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        }`} />

        {/* Document Name & Status */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            {/* Document Name - Inline Editable */}
            {isEditingTitle ? (
              <input
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                autoFocus
                className={`bg-transparent border-none outline-none font-semibold text-sm w-full min-w-0 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
                placeholder="Enter document name..."
              />
            ) : (
              <span
                onClick={handleTitleClick}
                className={`font-semibold text-sm cursor-pointer truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
                title="Click to edit document name"
              >
                {titleValue || 'Untitled Document'}
              </span>
            )}
          </div>

          {/* Save Status */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 flex-shrink-0">
            {getSaveStatusIcon()}
            <span className="hidden sm:block">{getSaveStatusText()}</span>
            {showSaveError && (
              <button
                onClick={handleRetrySave}
                disabled={isRetrying}
                title="Retry save"
                className="hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded p-0.5"
              >
                <RefreshCw className={`h-2 w-2 ${isRetrying ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 relative">
        {/* Save Button */}
        <Button 
          variant={saveStatus === 'saved' ? 'outline' : 'default'} 
          size="sm" 
          onClick={() => saveDocument()}
          disabled={saveStatus === 'saving'}
          className="gap-2 shadow-sm hover:shadow-md transition-all duration-200 h-8 px-3"
        >
          {saveStatus === 'saving' ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Save className="h-3 w-3" />
          )}
          <span className="hidden sm:block text-sm font-medium">
            {saveStatus === 'saving' ? 'Saving...' : 'Save'}
          </span>
        </Button>

        <div className={`h-4 w-px ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        }`} />

        {/* Export & Tools */}
        <div className="flex items-center gap-1">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 h-8 px-3 transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-white' 
                    : 'hover:bg-gray-100 text-gray-900'
                }`}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Download className="h-3 w-3" />
                )}
                <span className="hidden lg:block text-sm font-medium">Export</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <div className="text-xs font-medium text-muted-foreground mb-1">Export Format</div>
              </div>
              <DropdownMenuItem onClick={() => handleExport('docx')} className="gap-3">
                <Presentation className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <div className="font-medium">Word Document</div>
                  <div className="text-xs text-muted-foreground">Editable format</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('txt')} className="gap-3">
                <FileText className="h-4 w-4 text-gray-500" />
                <div className="flex-1">
                  <div className="font-medium">Plain Text</div>
                  <div className="text-xs text-muted-foreground">Simple format</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 h-8 px-2.5 transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-white' 
                    : 'hover:bg-gray-100 text-gray-900'
                }`}
                title="Select theme"
              >
                <Palette className="h-3 w-3" />
                <span className="hidden lg:block text-sm font-medium">Theme</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setColorTheme('orange')} className="gap-3">
                <div className="h-4 w-4 bg-orange-500 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium">Orange Theme</div>
                  <div className="text-xs text-muted-foreground">Warm and energetic</div>
                </div>
                {colorTheme === 'orange' && <Check className="h-4 w-4 text-green-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setColorTheme('blue')} className="gap-3">
                <div className="h-4 w-4 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium">Blue Theme</div>
                  <div className="text-xs text-muted-foreground">Cool and professional</div>
                </div>
                {colorTheme === 'blue' && <Check className="h-4 w-4 text-green-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setColorTheme('green')} className="gap-3">
                <div className="h-4 w-4 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium">Green Theme</div>
                  <div className="text-xs text-muted-foreground">Fresh and natural</div>
                </div>
                {colorTheme === 'green' && <Check className="h-4 w-4 text-green-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setColorTheme('red')} className="gap-3">
                <div className="h-4 w-4 bg-red-500 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium">Red Theme</div>
                  <div className="text-xs text-muted-foreground">Bold and passionate</div>
                </div>
                {colorTheme === 'red' && <Check className="h-4 w-4 text-green-500" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toggleTheme()} className="gap-3">
                <Moon className="h-4 w-4 text-gray-800" />
                <div className="flex-1">
                  <div className="font-medium">Dark Theme</div>
                  <div className="text-xs text-muted-foreground">Classic dark mode</div>
                </div>
                {theme === 'dark' && <Check className="h-4 w-4 text-green-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleTheme()} className="gap-3">
                <Sun className="h-4 w-4 text-yellow-500" />
                <div className="flex-1">
                  <div className="font-medium">Light Theme</div>
                  <div className="text-xs text-muted-foreground">Clean and bright</div>
                </div>
                {theme === 'light' && <Check className="h-4 w-4 text-green-500" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* AI Tools Dropdown */}
          <AIToolsDropdown />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleTheme()}
            className={`h-8 w-8 transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-gray-800 text-white' 
                : 'hover:bg-gray-100 text-gray-900'
            }`}
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-3 w-3" />
            ) : (
              <Moon className="h-3 w-3" />
            )}
          </Button>

          {/* Notifications Dropdown */}
          <NotificationsDropdown />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 h-8 px-2.5 transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-white' 
                    : 'hover:bg-gray-100 text-gray-900'
                }`}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-medium">{user?.name || 'User'}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Crown className="h-2.5 w-2.5 text-yellow-500" />
                    Premium Plan
                  </div>
                </div>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-2 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{user?.name || 'User'}</div>
                    <div className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</div>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      <Crown className="h-2.5 w-2.5 mr-1 text-yellow-500" />
                      Premium
                    </Badge>
                  </div>
                </div>
              </div>
              
              <DropdownMenuItem onClick={() => navigate('/profile')} className="gap-3">
                <User className="h-3 w-3" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Profile</div>
                  <div className="text-xs text-muted-foreground">View & edit profile</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/billing')} className="gap-3">
                <Crown className="h-3 w-3" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Billing</div>
                  <div className="text-xs text-muted-foreground">Manage subscription</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/team')} className="gap-3">
                <Users className="h-3 w-3" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Team</div>
                  <div className="text-xs text-muted-foreground">Manage members</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/admin/payments')} className="gap-3">
                <CreditCard className="h-3 w-3" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Payments</div>
                  <div className="text-xs text-muted-foreground">Billing & subscriptions</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/admin')} className="gap-3">
                <Shield className="h-3 w-3" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Admin</div>
                  <div className="text-xs text-muted-foreground">Admin panel</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/security')} className="gap-3">
                <Shield className="h-3 w-3" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Security</div>
                  <div className="text-xs text-muted-foreground">Monitor & threats</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/settings')} className="gap-3">
                <Settings className="h-3 w-3" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Settings</div>
                  <div className="text-xs text-muted-foreground">Preferences & account</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/analytics')} className="gap-3">
                <TrendingUp className="h-3 w-3" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Usage Analytics</div>
                  <div className="text-xs text-muted-foreground">View your statistics</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/help')} className="gap-3">
                <HelpCircle className="h-3 w-3" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Help & Support</div>
                  <div className="text-xs text-muted-foreground">Get assistance</div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => logout()} className="gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">
                <LogOut className="h-3 w-3" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Sign Out</div>
                  <div className="text-xs opacity-70">Logout from account</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
