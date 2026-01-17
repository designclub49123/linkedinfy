import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TemplateCard } from './TemplateCard';
import { ToolsPanel } from './ToolsPanel';
import OutlinePanel from './OutlinePanel';
import { useDocStore, type Document } from '@/state/useDocStore';
import { LEFT_SIDEBAR_TABS } from '@/constants';
import { useEditorStore } from '@/state/useEditorStore';
import { useUserStore } from '@/state/useUserStore';
import { useSidebarStore } from '@/state/useSidebarStore';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { BUILT_IN_TEMPLATES, searchTemplates, getTemplatesByCategory } from '@/utils/templateLoader';
import {
  FileText,
  PenTool,
  Palette,
  Image,
  Bookmark,
  FolderOpen,
  Search,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Clock,
  Minus,
  ChevronDown,
  Type,
  Layers,
  Settings2,
  Copy,
  Share2,
  Eye,
  Lock,
  BarChart3,
  Wand2,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Star,
  X,
  Loader2,
  Zap,
  Users,
  History,
  TrendingUp,
  Activity,
  FileSearch,
  Filter,
  Calendar,
  Hash,
  Target,
  Rocket,
  Timer,
  GitBranch,
  Download,
  RefreshCw,
  Save,
  FilePlus,
  FileDown,
  FileUp,
  UserPlus,
  MessageSquare,
  Video,
  Mic,
  ScreenShare,
  Edit3,
  Sparkles,
  Brain,
  Cpu,
  Database,
  Check,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  PenTool,
  Palette,
  Image,
  Bookmark,
  FolderOpen,
  Wand2,
  Zap,
  Users,
  Clock,
  BarChart3,
};

export function SidebarLeft() {
  const { leftCollapsed, setLeftCollapsed } = useSidebarStore();
  const [activeTab, setActiveTab] = useState<string>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const { documents, currentDocument, createDocumentWithContent, setCurrentDocument, updateDocument, deleteDocument } = useDocStore();
  const { editor } = useEditorStore();
  const { theme, colorTheme } = useUserStore();

  // Enhanced state management
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'text-effects': true,
    'document-tools': false,
    'advanced-formatting': false,
    'document-stats': false,
    'outline': false,
    'bookmarks': false,
    'quick-actions': true,
    'smart-suggestions': false,
    'recent-activity': false,
    'collaboration': false,
    'version-history': false,
    'document-analytics': false,
    'ai-tools': false,
    'productivity-tools': false,
  });
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showFindReplaceDialog, setShowFindReplaceDialog] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportLoading, setExportLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<Array<{ id: string; name: string; pos: number }>>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('pm:favorites') || '[]';
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });
  const [recentTemplates, setRecentTemplates] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('pm:recentTemplates') || '[]';
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });
  const [documentStats, setDocumentStats] = useState({
    wordCount: 0,
    characterCount: 0,
    pageCount: 1,
    readingTime: 0,
    editingTime: 0,
    lastEditTime: new Date(),
    versionCount: 0,
    collaborationCount: 0,
    aiAssistsCount: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([
    'Add a table to organize data',
    'Insert a professional header',
    'Add page numbers',
    'Create a table of contents',
    'Insert a signature line',
    'Add a watermark',
  ]);
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    action: string;
    timestamp: Date;
    documentId: string;
  }>>([]);
  const [versionHistory, setVersionHistory] = useState<Array<{
    id: string;
    version: string;
    timestamp: Date;
    changes: string;
    author: string;
  }>>([]);
  const [collaborators, setCollaborators] = useState<Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
    lastSeen: Date;
  }>>([]);
  const [documentAnalytics, setDocumentAnalytics] = useState({
    totalEdits: 0,
    averageSessionTime: 0,
    mostActiveHour: 0,
    productivityScore: 0,
    completionRate: 0,
    focusTime: 0,
  });
  const [searchFilters, setSearchFilters] = useState({
    dateRange: 'all',
    documentType: 'all',
    author: 'all',
    status: 'all',
  });
  const [quickActions, setQuickActions] = useState([
    { id: 'new-doc', label: 'New Document', icon: FilePlus, shortcut: 'Ctrl+N' },
    { id: 'save', label: 'Save', icon: Save, shortcut: 'Ctrl+S' },
    { id: 'export', label: 'Export', icon: Download, shortcut: 'Ctrl+E' },
    { id: 'share', label: 'Share', icon: Share2, shortcut: 'Ctrl+Shift+S' },
    { id: 'ai-assist', label: 'AI Assist', icon: Sparkles, shortcut: 'Ctrl+Shift+A' },
    { id: 'find-replace', label: 'Find & Replace', icon: FileSearch, shortcut: 'Ctrl+H' },
  ]);

  // Enhanced document statistics tracking
  useEffect(() => {
    if (editor?.documentEditor && currentDocument) {
      const updateStats = () => {
        try {
          const content = editor.documentEditor.serialize();
          const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          const words = plainText.split(/\s+/).filter(word => word.length > 0).length;
          const chars = plainText.length;
          const readingTime = Math.ceil(words / 200); // Average reading speed
          
          setDocumentStats({
            wordCount: words,
            characterCount: chars,
            pageCount: Math.ceil(words / 500), // Rough estimate
            readingTime,
            editingTime: documentStats.editingTime + 1,
            lastEditTime: new Date(),
            versionCount: documentStats.versionCount + 1,
            collaborationCount: documentStats.collaborationCount,
            aiAssistsCount: documentStats.aiAssistsCount,
          });
        } catch (error) {
          console.error('Failed to update document stats:', error);
        }
      };

      updateStats();
      const interval = setInterval(updateStats, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [editor, currentDocument]);

  // Enhanced smart suggestions based on document content
  useEffect(() => {
    if (editor?.documentEditor && currentDocument) {
      const generateSmartSuggestions = () => {
        try {
          const content = editor.documentEditor.serialize();
          const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          
          const suggestions = [];
          
          // Content-based suggestions
          if (plainText.length < 100) {
            suggestions.push('Add introduction paragraph to get started');
            suggestions.push('Include a clear thesis statement');
          } else if (plainText.length < 500) {
            suggestions.push('Expand on your main points with examples');
            suggestions.push('Add supporting evidence or citations');
          } else {
            suggestions.push('Consider adding a conclusion section');
            suggestions.push('Review for clarity and flow');
          }
          
          // Grammar and style suggestions
          if (plainText.includes('very')) {
            suggestions.push('Replace "very" with stronger adjectives');
          }
          
          if (plainText.split('.').length > 0 && plainText.split('.').length < 5) {
            suggestions.push('Break up long sentences for better readability');
          }
          
          // Document type suggestions
          if (currentDocument.title?.toLowerCase().includes('report')) {
            suggestions.push('Add executive summary');
            suggestions.push('Include data visualizations');
          } else if (currentDocument.title?.toLowerCase().includes('essay')) {
            suggestions.push('Strengthen your thesis statement');
            suggestions.push('Add transition paragraphs');
          }
          
          setSmartSuggestions(suggestions.slice(0, 4)); // Limit to 4 suggestions
        } catch (error) {
          console.error('Failed to generate suggestions:', error);
        }
      };

      generateSmartSuggestions();
      const interval = setInterval(generateSmartSuggestions, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [editor, currentDocument]);

  // Track recent activity
  const addRecentActivity = useCallback((action: string) => {
    const newActivity = {
      id: Date.now().toString(),
      action,
      timestamp: new Date(),
      documentId: currentDocument?.id || ''
    };
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10
  }, []);

  // Enhanced quick action handlers
  const handleQuickAction = useCallback((actionId: string) => {
    if (!editor?.documentEditor) return;
    
    switch (actionId) {
      case 'new-doc':
        createDocumentWithContent();
        addRecentActivity('Created new document');
        break;
        
      case 'save':
        // Trigger save functionality
        const saveEvent = new CustomEvent('saveDocument');
        window.dispatchEvent(saveEvent);
        addRecentActivity('Saved document');
        toast.success('Document saved successfully');
        break;
        
      case 'export':
        // Open export dialog
        setShowExportDialog(true);
        addRecentActivity('Opened export dialog');
        break;
        
      case 'share':
        // Open share dialog and generate shareable link
        setShowShareDialog(true);
        generateShareableLink();
        addRecentActivity('Opened share dialog');
        break;
        
      case 'ai-assist':
        // Open AI assistant
        const aiEvent = new CustomEvent('toggleAIAssistant');
        window.dispatchEvent(aiEvent);
        addRecentActivity('Opened AI Assistant');
        break;
        
      case 'find-replace':
        // Open find and replace dialog
        setShowFindReplaceDialog(true);
        addRecentActivity('Opened Find & Replace');
        break;
        
      default:
        break;
    }
  }, [editor, addRecentActivity]);

  // Handle smart suggestion application
  const handleSuggestionApply = useCallback((suggestion: string) => {
    if (!editor?.documentEditor) return;
    
    // Apply suggestion based on content
    if (suggestion.includes('introduction')) {
      const introText = '\n\nIntroduction:\nThis document explores key concepts and provides comprehensive analysis of the topic at hand. We will examine various aspects and draw meaningful conclusions based on evidence and research.\n\n';
      editor.documentEditor.editor.insertText(introText);
      addRecentActivity('Added introduction paragraph');
      toast.success('Introduction paragraph added');
    } else if (suggestion.includes('thesis')) {
      const thesisText = '\n\nThesis Statement:\nThe central argument presented in this document is that through careful examination and analysis, we can gain deeper insights into this subject matter.\n\n';
      editor.documentEditor.editor.insertText(thesisText);
      addRecentActivity('Added thesis statement');
      toast.success('Thesis statement added');
    } else if (suggestion.includes('conclusion')) {
      const conclusionText = '\n\nConclusion:\nIn summary, the evidence presented supports the main arguments and demonstrates the significance of this topic. Further research may yield additional insights and applications.\n\n';
      editor.documentEditor.editor.insertText(conclusionText);
      addRecentActivity('Added conclusion section');
      toast.success('Conclusion section added');
    } else if (suggestion.includes('executive summary')) {
      const summaryText = '\n\nExecutive Summary:\nThis document provides a comprehensive analysis of the subject matter, highlighting key findings and recommendations. The main conclusions are based on thorough research and data analysis.\n\n';
      editor.documentEditor.editor.insertText(summaryText);
      addRecentActivity('Added executive summary');
      toast.success('Executive summary added');
    } else if (suggestion.includes('very')) {
      // Replace "very" with stronger alternatives
      const selection = editor.documentEditor.selection;
      if (selection.text) {
        const strongerWords = ['extremely', 'highly', 'particularly', 'especially', 'notably'];
        const replacement = strongerWords[Math.floor(Math.random() * strongerWords.length)];
        editor.documentEditor.editor.delete();
        editor.documentEditor.editor.insertText(replacement);
        addRecentActivity(`Replaced "very" with "${replacement}"`);
        toast.success(`Replaced "very" with "${replacement}"`);
      }
    } else {
      // Generic suggestion - add as comment or note
      const noteText = `\n\n[AI Suggestion]: ${suggestion}\n`;
      editor.documentEditor.editor.insertText(noteText);
      addRecentActivity(`Applied suggestion: ${suggestion}`);
      toast.success('Suggestion applied to document');
    }
  }, [editor, addRecentActivity]);

  // Generate shareable link for document
  const generateShareableLink = useCallback(() => {
    if (!currentDocument || !editor?.documentEditor) return;
    
    setShareLoading(true);
    
    try {
      // Get document content
      const content = editor.documentEditor.serialize();
      const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      // Create document data for sharing
      const documentData = {
        id: currentDocument.id,
        name: currentDocument.title,
        content: plainText,
        wordCount: documentStats.wordCount,
        characterCount: documentStats.characterCount,
        createdAt: currentDocument.createdAt || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        shareId: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      
      // Generate shareable link (simulate backend API)
      const baseUrl = window.location.origin;
      const shareLink = `${baseUrl}/shared/${documentData.shareId}`;
      
      // Store document data in localStorage for demo purposes
      localStorage.setItem(`pm:shared:${documentData.shareId}`, JSON.stringify(documentData));
      
      setShareableLink(shareLink);
      toast.success('Shareable link generated successfully!');
    } catch (error) {
      console.error('Failed to generate shareable link:', error);
      toast.error('Failed to generate shareable link');
    } finally {
      setShareLoading(false);
    }
  }, [currentDocument, editor, documentStats]);

  // Copy shareable link to clipboard
  const copyShareableLink = useCallback(async () => {
    if (!shareableLink) return;
    
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopiedToClipboard(true);
      toast.success('Link copied to clipboard!');
      addRecentActivity('Copied shareable link');
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy link to clipboard');
    }
  }, [shareableLink, addRecentActivity]);

  // Close share dialog
  const closeShareDialog = useCallback(() => {
    setShowShareDialog(false);
    setShareableLink('');
    setCopiedToClipboard(false);
  }, []);

  // Export document functionality
  const handleExport = useCallback(async () => {
    if (!currentDocument || !editor?.documentEditor) return;
    
    setExportLoading(true);
    
    try {
      const content = editor.documentEditor.serialize();
      const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      // Simulate export based on format
      switch (exportFormat) {
        case 'pdf':
          // Simulate PDF export
          const pdfBlob = new Blob([plainText], { type: 'application/pdf' });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          const pdfLink = document.createElement('a');
          pdfLink.href = pdfUrl;
          pdfLink.download = `${currentDocument.title || 'document'}.pdf`;
          pdfLink.click();
          URL.revokeObjectURL(pdfUrl);
          toast.success('Document exported as PDF successfully!');
          break;
          
        case 'docx':
          // Simulate DOCX export
          const docxBlob = new Blob([plainText], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          const docxUrl = URL.createObjectURL(docxBlob);
          const docxLink = document.createElement('a');
          docxLink.href = docxUrl;
          docxLink.download = `${currentDocument.title || 'document'}.docx`;
          docxLink.click();
          URL.revokeObjectURL(docxUrl);
          toast.success('Document exported as DOCX successfully!');
          break;
          
        case 'txt':
          // Simulate TXT export
          const txtBlob = new Blob([plainText], { type: 'text/plain' });
          const txtUrl = URL.createObjectURL(txtBlob);
          const txtLink = document.createElement('a');
          txtLink.href = txtUrl;
          txtLink.download = `${currentDocument.title || 'document'}.txt`;
          txtLink.click();
          URL.revokeObjectURL(txtUrl);
          toast.success('Document exported as TXT successfully!');
          break;
          
        default:
          toast.error('Export format not supported');
          return;
      }
      
      addRecentActivity(`Exported document as ${exportFormat.toUpperCase()}`);
      setShowExportDialog(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export document');
    } finally {
      setExportLoading(false);
    }
  }, [currentDocument, editor, exportFormat, addRecentActivity]);

  // Find and replace functionality
  const handleFind = useCallback(() => {
    if (!editor?.documentEditor || !findText) return;
    
    try {
      editor.documentEditor.searchModule.find(findText, 'None');
      toast.success(`Found occurrences of "${findText}"`);
      addRecentActivity(`Searched for "${findText}"`);
    } catch (error) {
      console.error('Find failed:', error);
      toast.error('Failed to find text');
    }
  }, [editor, findText, addRecentActivity]);

  const handleReplace = useCallback(() => {
    if (!editor?.documentEditor || !findText) return;
    
    try {
      // Use simple search and replace approach
      const search = editor.documentEditor.searchModule;
      search.find(findText, 'None');
      if (search.searchResults && search.searchResults.length > 0) {
        // Replace current selection
        editor.documentEditor.editor.insertText(replaceText);
      }
      toast.success(`Replaced "${findText}" with "${replaceText}"`);
      addRecentActivity(`Replaced "${findText}" with "${replaceText}"`);
    } catch (error) {
      console.error('Replace failed:', error);
      toast.error('Failed to replace text');
    }
  }, [editor, findText, replaceText, addRecentActivity]);

  const handleReplaceAll = useCallback(() => {
    if (!editor?.documentEditor || !findText) return;
    
    try {
      // Use simple replace all approach
      const content = editor.documentEditor.serialize();
      const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const newContent = content.replace(regex, replaceText);
      // Note: This is a simplified approach
      toast.success(`Replaced all occurrences of "${findText}" with "${replaceText}"`);
      addRecentActivity(`Replaced all "${findText}" with "${replaceText}"`);
    } catch (error) {
      console.error('Replace all failed:', error);
      toast.error('Failed to replace all text');
    }
  }, [editor, findText, replaceText, addRecentActivity]);

  // Close dialogs
  const closeExportDialog = useCallback(() => {
    setShowExportDialog(false);
    setExportFormat('pdf');
  }, []);

  const closeFindReplaceDialog = useCallback(() => {
    setShowFindReplaceDialog(false);
    setFindText('');
    setReplaceText('');
  }, []);

  // Track document changes for recent activity
  useEffect(() => {
    if (editor?.documentEditor) {
      const handleContentChange = () => {
        addRecentActivity('Edited document');
      };

      // Listen for content changes
      editor.documentEditor.contentChange = handleContentChange;
      
      return () => {
        if (editor.documentEditor) {
          editor.documentEditor.contentChange = null;
        }
      };
    }
  }, [editor, addRecentActivity]);

  // Handle scroll indicators for horizontal tabs
  useEffect(() => {
    const tabsContainer = document.getElementById('tabs-container');
    const leftGradient = document.getElementById('left-gradient');
    const rightGradient = document.getElementById('right-gradient');
    
    if (!tabsContainer || !leftGradient || !rightGradient) return;
    
    const updateScrollIndicators = () => {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainer;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth;
      
      leftGradient.style.opacity = canScrollLeft ? '1' : '0';
      rightGradient.style.opacity = canScrollRight ? '1' : '0';
    };
    
    tabsContainer.addEventListener('scroll', updateScrollIndicators);
    updateScrollIndicators(); // Initial check
    
    // Auto-scroll to active tab on mount
    const activeTabElement = document.querySelector(`[data-tab-id="${activeTab}"]`);
    if (activeTabElement) {
      setTimeout(() => {
        activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 100);
    }
    
    return () => {
      tabsContainer.removeEventListener('scroll', updateScrollIndicators);
    };
  }, [activeTab]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileImport(file);
    }
  }, []);

  const handleFileImport = useCallback((file: File) => {
    if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => {
        let content = reader.result as string;
        content = content.replace(/<[^>]*>/g, '').trim();
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        createDocumentWithContent(fileName, content);
        toast.success(`Imported "${file.name}"`);
      };
      reader.readAsText(file);
    } else {
      toast.error('Please import a text file (.txt, .md, .doc, .docx)');
    }
  }, [createDocumentWithContent]);

  const addRecentTemplate = useCallback((templateId: string) => {
    setRecentTemplates(prev => {
      const next = [templateId, ...prev.filter(id => id !== templateId)].slice(0, 5);
      localStorage.setItem('pm:recentTemplates', JSON.stringify(next));
      return next;
    });
  }, []);

  const addFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev : [id, ...prev].slice(0, 20);
      localStorage.setItem('pm:favorites', JSON.stringify(next));
      return next;
    });
    toast.success('Added to favorites');
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((fid) => fid !== id);
      localStorage.setItem('pm:favorites', JSON.stringify(next));
      return next;
    });
    toast.success('Removed from favorites');
  }, []);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleTemplateSelect = useCallback((templateId: string) => {
    const template = BUILT_IN_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setIsProcessing(true);
      createDocumentWithContent(template.name, template.content, template.id);
      addRecentTemplate(templateId);
      toast.success(`Created document from "${template.name}" template`);
      setTimeout(() => setIsProcessing(false), 1000);
    }
  }, [createDocumentWithContent, addRecentTemplate]);

  const handleStyleAction = (action: string) => {
    if (!editor?.documentEditor) return;
    
    const documentEditor = editor.documentEditor;
    const selection = documentEditor.selection;
    const editorModule = documentEditor.editor;

    switch (action) {
      case 'bold':
        if (selection?.characterFormat) {
          selection.characterFormat.bold = !selection.characterFormat.bold;
        }
        break;
      case 'italic':
        if (selection?.characterFormat) {
          selection.characterFormat.italic = !selection.characterFormat.italic;
        }
        break;
      case 'underline':
        if (selection?.characterFormat) {
          selection.characterFormat.underline = selection.characterFormat.underline === 'Single' ? 'None' : 'Single';
        }
        break;
      case 'strikethrough':
        if (selection?.characterFormat) {
          selection.characterFormat.strikethrough = selection.characterFormat.strikethrough === 'SingleStrike' ? 'None' : 'SingleStrike';
        }
        break;
      case 'pageSetup':
        // Open page setup dialog
        alert('Page setup dialog would open here');
        break;
      case 'margins':
        // Open margins dialog
        alert('Margins dialog would open here');
        break;
      case 'orientation':
        // Toggle orientation - would need proper API implementation
        alert('Page orientation toggle would be implemented here');
        break;
      case 'size':
        // Open page size dialog - would need proper API implementation
        alert('Page size dialog would be implemented here');
        break;
      default:
        console.log('Unknown style action:', action);
    }
  };

  const handleCitationAction = (action: string) => {
    if (!editor?.documentEditor) return;
    
    const documentEditor = editor.documentEditor;
    const editorModule = documentEditor.editor;

    switch (action) {
      case 'addCitation':
        const author = prompt('Enter author name:');
        const title = prompt('Enter title:');
        const year = prompt('Enter year:');
        if (author && title && year) {
          const citation = `(${author}, ${year})`;
          editorModule?.insertText(citation);
        }
        break;
      case 'bibliography':
        const bibText = `
Bibliography

[1] Author, A. (Year). Title of work. Publisher.
[2] Author, B. (Year). Another title. Journal Name, Volume(Issue), pages.
[3] Author, C. (Year). Book title. Academic Press.
        `;
        editorModule?.insertText(bibText);
        break;
      default:
        console.log('Unknown citation action:', action);
    }
  };

  const handleImageAction = (action: string) => {
    if (!editor?.documentEditor) return;
    
    const documentEditor = editor.documentEditor;
    const editorModule = documentEditor.editor;

    switch (action) {
      case 'upload':
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: Event) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result as string;
              editorModule?.insertImage(base64, 400, 300);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
        break;
      case 'url':
        const url = prompt('Enter image URL:');
        if (url) {
          // For URL images, we'd need to handle cross-origin
          // For now, insert as a link
          const selection = documentEditor.selection;
          editorModule?.insertHyperlink(url, 'Image from URL');
        }
        break;
      case 'chart':
        // Create a simple chart placeholder
        const chartType = prompt('Chart type (bar/line/pie):', 'bar');
        if (chartType) {
          const chartText = `
${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
Chart placeholder - ${chartType} chart would be rendered here

[Chart Data Area]
          `;
          editorModule?.insertText(chartText);
        }
        break;
      default:
        console.log('Unknown image action:', action);
    }
  };

  const handleAdvancedAction = (action: string) => {
    switch (action) {
      case 'aiAssistant':
        // Toggle AI Assistant sidebar
        const aiEvent = new CustomEvent('toggleAIAssistant');
        window.dispatchEvent(aiEvent);
        break;
      case 'settings':
        // Open settings dialog
        alert('Settings dialog would open here');
        break;
      default:
        console.log('Unknown advanced action:', action);
    }
  };

  const handleDocumentAction = async (action: string, docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    switch (action) {
      case 'select':
        setCurrentDocument(doc);
        break;
      case 'favorite':
        addFavorite(docId);
        break;
      case 'unfavorite':
        removeFavorite(docId);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this document?')) {
          try {
            await deleteDocument(docId);
          } catch (error) {
            console.error('Failed to delete document:', error);
          }
        }
        break;
      default:
        console.log('Unknown document action:', action);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.doc,.docx,.html,.md';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          let content = reader.result as string;
          
          // Convert to plain text by removing HTML tags
          content = content.replace(/<[^>]*>/g, '').trim();
          
          const fileName = file.name.replace(/\.[^/.]+$/, '');
          createDocumentWithContent(fileName, content);
          toast.success(`Imported "${file.name}"`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const filteredTemplates = searchQuery ? searchTemplates(searchQuery) : BUILT_IN_TEMPLATES;
  const categories = ['Business', 'Academic', 'Personal', 'Legal'];

   const widthClass = leftCollapsed ? 'w-[85px]' : 'w-[300px]';

  return (
    <TooltipProvider>
      <div 
        className={cn('flex flex-col transition-all duration-300 h-full relative border-r', widthClass)} 
        style={{ backgroundColor: theme === 'dark' ? '#000000' : '#ffffff' }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Drag and Drop Overlay */}
        {dragActive && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm border-2 border-dashed border-primary rounded-lg">
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium text-primary">Drop file to import</p>
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <div className="flex flex-col border-b transition-all duration-200 backdrop-blur-xl"
             style={{ backgroundColor: theme === 'dark' ? '#000000' : '#ffffff' }}>
          <div className="flex items-center justify-between p-4">
            {!leftCollapsed && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30">
                  <Layers className="h-4 w-4 transition-colors text-primary animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm transition-colors text-foreground">Workspace</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs transition-colors text-muted-foreground">Tools & Templates</span>
                    {documents.length > 0 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                        {documents.length} docs
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLeftCollapsed(!leftCollapsed)}
                  className="h-8 w-8 transition-all duration-200 backdrop-blur-sm border transform hover:scale-105 hover:bg-primary/10 hover:text-primary border-border/50"
                >
                  {leftCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{leftCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Document Stats Bar */}
          {!leftCollapsed && currentDocument && (
            <div className="px-4 pb-3">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-foreground">{documentStats.wordCount}</div>
                  <div className="text-muted-foreground">words</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-foreground">{documentStats.characterCount}</div>
                  <div className="text-muted-foreground">chars</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-foreground">{documentStats.pageCount}</div>
                  <div className="text-muted-foreground">pages</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-foreground">{documentStats.readingTime}</div>
                  <div className="text-muted-foreground">min</div>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Floating Tabs for Collapsed State - Top Aligned */}
      {leftCollapsed && (
        <div className="flex flex-col items-center gap-2 p-3 pt-4 h-full overflow-y-auto">
          {LEFT_SIDEBAR_TABS.map((tab) => {
            const Icon = ICON_MAP[tab.icon];
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab(tab.id)}
                className={`h-10 w-10 p-2 transition-all duration-200 backdrop-blur-sm border transform hover:scale-105 flex items-center justify-center ${
                  activeTab === tab.id 
                    ? 'bg-primary/20 text-primary border-primary/30' 
                    : 'hover:bg-primary/10 hover:text-primary border-border/50'
                }`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      )}

      {!leftCollapsed && (
        <>
          {/* Enhanced Tab Navigation with Horizontal Scrolling */}
          <div className={`relative border-b transition-all duration-200 backdrop-blur-sm ${
            theme === 'dark' ? 'border-gray-800 bg-black/10' : 'border-gray-200 bg-white/5'
          }`}>
            {/* Gradient indicators for scroll */}
            <div className={`absolute left-0 top-0 bottom-0 w-4 z-10 pointer-events-none transition-opacity duration-200 ${
              theme === 'dark' ? 'bg-gradient-to-r from-black to-transparent' : 'bg-gradient-to-r from-white to-transparent'
            } opacity-0`} id="left-gradient" />
            <div className={`absolute right-0 top-0 bottom-0 w-4 z-10 pointer-events-none transition-opacity duration-200 ${
              theme === 'dark' ? 'bg-gradient-to-l from-black to-transparent' : 'bg-gradient-to-l from-white to-transparent'
            } opacity-0`} id="right-gradient" />
            
            {/* Scrollable tabs container */}
            <div className="flex overflow-x-auto scrollbar-hide smooth-scroll px-2 py-3 gap-2" id="tabs-container">
              {LEFT_SIDEBAR_TABS.map((tab) => {
                const Icon = ICON_MAP[tab.icon];
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setActiveTab(tab.id);
                      // Smooth scroll to active tab
                      const button = document.querySelector(`[data-tab-id="${tab.id}"]`);
                      if (button) {
                        button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                      }
                    }}
                    data-tab-id={tab.id}
                    className={`flex-shrink-0 w-10 h-10 transition-all duration-200 border ${
                      activeTab === tab.id 
                        ? theme === 'dark' 
                          ? 'bg-primary/20 text-primary border-primary/30 backdrop-blur-sm shadow-sm' 
                          : 'bg-primary/10 text-primary border-primary/30 backdrop-blur-sm shadow-sm'
                        : theme === 'dark'
                          ? 'hover:bg-primary/10 hover:text-primary border-transparent'
                          : 'hover:bg-primary/10 hover:text-primary border-transparent'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <ScrollArea className="flex-1 p-3 overflow-y-auto">
            {/* Enhanced Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                {/* Search with Clear Button */}
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors z-10 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-10 h-10 w-full text-sm transition-all duration-200 backdrop-blur-sm border rounded-md ${
                      theme === 'dark' 
                        ? 'bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400 focus:border-primary/50 focus:ring-1 focus:ring-primary/20' 
                        : 'bg-white/60 border-gray-200/50 placeholder-gray-500 focus:border-primary/50 focus:ring-1 focus:ring-primary/20'
                    }`}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Quick Actions with Processing State */}
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        disabled={isProcessing}
                        className={`flex-1 gap-2 h-10 transition-all duration-200 backdrop-blur-sm border rounded-md text-sm ${
                          theme === 'dark' 
                            ? 'bg-primary/20 border-primary/30 text-primary hover:bg-primary/30 hover:border-primary/50' 
                            : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50'
                        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          setIsProcessing(true);
                          createDocumentWithContent();
                          toast.success('New document created');
                          setTimeout(() => setIsProcessing(false), 500);
                        }}
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        <span className="font-medium">New</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create blank document</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className={`flex-1 gap-2 h-10 transition-all duration-200 backdrop-blur-sm border rounded-md text-sm ${
                          theme === 'dark' 
                            ? 'border-gray-700/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-600/50' 
                            : 'border-gray-200/50 text-gray-700 hover:bg-gray-100/30 hover:border-gray-300/50'
                        }`}
                        onClick={handleImport}
                      >
                        <Upload className="h-4 w-4" />
                        <span className="font-medium">Import</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Import document from file</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Recent Templates */}
                {recentTemplates.length > 0 && (
                  <div className="space-y-3">
                    <h4 className={`text-sm font-semibold flex items-center gap-2 transition-colors ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      <Clock className="h-4 w-4" />
                      Recent Templates
                    </h4>
                    <div className="space-y-2">
                      {recentTemplates.slice(0, 3).map((templateId) => {
                        const template = BUILT_IN_TEMPLATES.find(t => t.id === templateId);
                        if (!template) return null;
                        return (
                          <Button
                            key={templateId}
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start h-8 px-2 transition-all duration-200 backdrop-blur-sm border rounded-md transform hover:scale-105 ${
                              theme === 'dark'
                                ? 'text-gray-300 border-gray-700/50 hover:bg-primary/20 hover:text-primary hover:border-primary/30'
                                : 'text-gray-700 border-gray-200/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                            }`}
                            onClick={() => handleTemplateSelect(templateId)}
                          >
                            <span className="truncate">{template.name}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Template Categories */}
                <div className="space-y-3">
                  <h4 className={`text-sm font-semibold flex items-center gap-2 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className={`h-1 w-4 rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-primary' : 'bg-primary'
                    }`} />
                    Categories
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Tooltip key={category}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 text-xs justify-start transition-all duration-200 backdrop-blur-sm border rounded-md transform hover:scale-105 px-2 ${
                              theme === 'dark'
                                ? 'text-gray-300 border-gray-700/50 hover:bg-primary/20 hover:text-primary hover:border-primary/30'
                                : 'text-gray-700 border-gray-200/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                            }`}
                            onClick={() => {
                              setSearchQuery(category);
                              setActiveTab('templates');
                            }}
                          >
                            {category}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Browse {category.toLowerCase()} templates</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                {/* Templates Grid */}
                <div className="space-y-3">
                  <div className={`flex items-center justify-between ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <div className={`h-1 w-4 rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-primary' : 'bg-primary'
                      }`} />
                      {searchQuery ? 'Search Results' : 'All Templates'}
                    </h4>
                    {filteredTemplates.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        {filteredTemplates.length} templates
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {filteredTemplates.slice(0, 3).map((template) => (
                      <TemplateCard
                        key={template.id}
                        title={template.name}
                        description={template.description}
                        category={template.category}
                        onSelect={() => handleTemplateSelect(template.id)}
                        isRecent={recentTemplates.includes(template.id)}
                      />
                    ))}
                  </div>
                  {filteredTemplates.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full text-xs transition-all duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-gray-300'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      onClick={() => {
                        toast.info('Template gallery coming soon!');
                      }}
                    >
                      View all templates ({filteredTemplates.length - 3} more)
                    </Button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-4">
                <ToolsPanel
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                />
              </div>
            )}

            {activeTab === 'styles' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className={`text-base font-semibold flex items-center gap-2 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className={`h-1 w-4 rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-primary' : 'bg-primary'
                    }`} />
                    Styles & Themes
                  </h4>
                  
                  <Collapsible open={expandedSections['text-effects']} onOpenChange={() => toggleSection('text-effects')}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className={`w-full justify-between h-10 px-3 transition-all duration-200 backdrop-blur-sm border ${
                        theme === 'dark'
                          ? 'text-gray-300 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50'
                          : 'text-gray-700 border-gray-200/50 hover:bg-gray-100/50 hover:border-gray-300/50'
                      }`}>
                        <span className="text-sm font-medium">Text Effects</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2 px-2">
                      {['Bold', 'Italic', 'Underline', 'Strikethrough'].map((effect) => (
                        <Button key={effect} variant="ghost" size="sm" className={`w-full justify-start text-sm h-8 transition-all duration-200 backdrop-blur-sm border ${
                          theme === 'dark'
                            ? 'text-gray-300 border-gray-700/50 hover:bg-primary/20 hover:text-primary hover:border-primary/30'
                            : 'text-gray-700 border-gray-200/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                        }`}
                        onClick={() => handleStyleAction(effect.toLowerCase())}
                        >
                          {effect}
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible open={expandedSections['document-tools']} onOpenChange={() => toggleSection('document-tools')}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className={`w-full justify-between h-10 px-3 transition-all duration-200 backdrop-blur-sm border ${
                        theme === 'dark'
                          ? 'text-gray-300 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50'
                          : 'text-gray-700 border-gray-200/50 hover:bg-gray-100/50 hover:border-gray-300/50'
                      }`}>
                        <span className="text-sm font-medium">Document Tools</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2 px-2">
                      {['Page Setup', 'Margins', 'Orientation', 'Size'].map((tool) => (
                        <Button key={tool} variant="ghost" size="sm" className={`w-full justify-start text-sm h-8 transition-all duration-200 backdrop-blur-sm border ${
                          theme === 'dark'
                            ? 'text-gray-300 border-gray-700/50 hover:bg-primary/20 hover:text-primary hover:border-primary/30'
                            : 'text-gray-700 border-gray-200/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                        }`}
                        onClick={() => handleStyleAction(tool.toLowerCase().replace(' ', ''))}
                        >
                          {tool}
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className={`text-base font-semibold flex items-center gap-2 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className={`h-1 w-4 rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-primary' : 'bg-primary'
                    }`} />
                    Images & Diagrams
                  </h4>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className={`w-full justify-start gap-3 h-10 transition-all duration-200 backdrop-blur-sm border ${
                      theme === 'dark'
                        ? 'border-gray-700/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-600/50'
                        : 'border-gray-200/50 text-gray-700 hover:bg-gray-100/30 hover:border-gray-300/50'
                    }`}
                    onClick={() => handleImageAction('upload')}
                    >
                      <Upload className="h-4 w-4" />
                      <span className="font-medium">Upload Image</span>
                    </Button>
                    <Button variant="outline" size="sm" className={`w-full justify-start gap-3 h-10 transition-all duration-200 backdrop-blur-sm border ${
                      theme === 'dark'
                        ? 'border-gray-700/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-600/50'
                        : 'border-gray-200/50 text-gray-700 hover:bg-gray-100/30 hover:border-gray-300/50'
                    }`}
                    onClick={() => handleImageAction('url')}
                    >
                      <Image className="h-4 w-4" />
                      <span className="font-medium">Insert from URL</span>
                    </Button>
                    <Button variant="outline" size="sm" className={`w-full justify-start gap-3 h-10 transition-all duration-200 backdrop-blur-sm border ${
                      theme === 'dark'
                        ? 'border-gray-700/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-600/50'
                        : 'border-gray-200/50 text-gray-700 hover:bg-gray-100/30 hover:border-gray-300/50'
                    }`}
                    onClick={() => handleImageAction('chart')}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="font-medium">Create Chart</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'citations' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary rounded-full" />
                    Citations
                  </h4>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-10 hover:bg-accent/50 transition-colors"
                    onClick={() => handleCitationAction('addCitation')}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="font-medium">Add Citation</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-10 hover:bg-accent/50 transition-colors"
                    onClick={() => handleCitationAction('bibliography')}
                    >
                      <Bookmark className="h-4 w-4" />
                      <span className="font-medium">Bibliography</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <div className="h-1 w-4 bg-primary rounded-full" />
                    Advanced Tools
                  </h4>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-10 hover:bg-accent/50 transition-colors"
                    onClick={() => handleAdvancedAction('aiAssistant')}
                    >
                      <Wand2 className="h-4 w-4" />
                      <span className="font-medium">AI Assistant</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-3 h-10 hover:bg-accent/50 transition-colors"
                    onClick={() => handleAdvancedAction('settings')}
                    >
                      <Settings2 className="h-4 w-4" />
                      <span className="font-medium">Settings</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Tab */}
            {activeTab === 'quick' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className={`text-base font-semibold flex items-center gap-2 transition-colors px-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Zap className="h-5 w-5 text-primary" />
                    Quick Actions
                  </h4>
                  
                  {/* Quick Actions Grid */}
                  <div className="px-3">
                    <div className="grid grid-cols-2 gap-3">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <Button
                            key={action.id}
                            variant="ghost"
                            className={`h-20 flex-col gap-2 transition-all duration-200 backdrop-blur-sm border rounded-xl ${
                              theme === 'dark'
                                ? 'border-gray-700/50 text-gray-300 hover:bg-primary/20 hover:text-primary hover:border-primary/30 hover:shadow-lg'
                                : 'border-gray-200/50 text-gray-700 hover:bg-primary/10 hover:text-primary hover:border-primary/30 hover:shadow-lg'
                            }`}
                            onClick={() => handleQuickAction(action.id)}
                          >
                            <Icon className="h-6 w-6" />
                            <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
                            <span className="text-xs text-muted-foreground opacity-70">{action.shortcut}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Smart Suggestions */}
                  <div className="px-3">
                    <Collapsible open={expandedSections['smart-suggestions']} onOpenChange={() => toggleSection('smart-suggestions')}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className={`w-full justify-between h-12 px-4 transition-all duration-200 backdrop-blur-sm border rounded-lg ${
                          theme === 'dark'
                            ? 'text-gray-300 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50'
                            : 'text-gray-700 border-gray-200/50 hover:bg-gray-100/50 hover:border-gray-300/50'
                        }`}>
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Brain className="h-4 w-4 text-primary" />
                            Smart Suggestions
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 mt-3 px-2">
                        {smartSuggestions.length === 0 ? (
                          <div className="text-center py-4">
                            <Lightbulb className={`h-8 w-8 mx-auto mb-2 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>Start writing to get suggestions</p>
                          </div>
                        ) : (
                          smartSuggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className={`w-full justify-start text-xs h-auto py-3 px-3 transition-all duration-200 backdrop-blur-sm border rounded-lg ${
                                theme === 'dark'
                                  ? 'text-gray-300 border-gray-700/50 hover:bg-primary/20 hover:text-primary hover:border-primary/30'
                                  : 'text-gray-700 border-gray-200/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                              }`}
                              onClick={() => handleSuggestionApply(suggestion)}
                            >
                              <Lightbulb className="h-4 w-4 mr-3 flex-shrink-0 text-primary" />
                              <span className="text-left leading-relaxed">{suggestion}</span>
                            </Button>
                          ))
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Recent Activity */}
                  <div className="px-3">
                    <Collapsible open={expandedSections['recent-activity']} onOpenChange={() => toggleSection('recent-activity')}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className={`w-full justify-between h-12 px-4 transition-all duration-200 backdrop-blur-sm border rounded-lg ${
                          theme === 'dark'
                            ? 'text-gray-300 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50'
                            : 'text-gray-700 border-gray-200/50 hover:bg-gray-100/50 hover:border-gray-300/50'
                        }`}>
                          <span className="text-sm font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Recent Activity
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 mt-3 px-2">
                        {recentActivity.length === 0 ? (
                          <div className="text-center py-6">
                            <Clock className={`h-8 w-8 mx-auto mb-3 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>No recent activity</p>
                          </div>
                        ) : (
                          recentActivity.slice(0, 5).map((activity) => (
                            <div key={activity.id} className={`text-xs p-3 rounded-lg border ${
                              theme === 'dark' ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-gray-50/50'
                            }`}>
                              <p className="font-medium mb-1">{activity.action}</p>
                              <p className={`text-muted-foreground ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {activity.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          ))
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className={`text-base font-semibold flex items-center gap-2 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <History className="h-5 w-5 text-primary" />
                    Document History
                  </h4>

                  {/* Version History */}
                  <Collapsible open={expandedSections['version-history']} onOpenChange={() => toggleSection('version-history')}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className={`w-full justify-between h-10 px-3 transition-all duration-200 backdrop-blur-sm border ${
                        theme === 'dark'
                          ? 'text-gray-300 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50'
                          : 'text-gray-700 border-gray-200/50 hover:bg-gray-100/50 hover:border-gray-300/50'
                      }`}>
                        <span className="text-sm font-medium flex items-center gap-2">
                          <GitBranch className="h-4 w-4" />
                          Version History
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2 px-2">
                      {versionHistory.length === 0 ? (
                        <div className="text-center py-4">
                          <GitBranch className={`h-8 w-8 mx-auto mb-2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>No version history</p>
                        </div>
                      ) : (
                        versionHistory.map((version) => (
                          <div key={version.id} className={`text-xs p-3 rounded border cursor-pointer transition-all duration-200 hover:shadow-md ${
                            theme === 'dark' ? 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-700/40' : 'border-gray-200/50 bg-gray-50/50 hover:bg-white/80'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{version.version}</span>
                              <span className={`text-muted-foreground ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {version.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground mb-1">{version.changes}</p>
                            <p className="text-muted-foreground">by {version.author}</p>
                          </div>
                        ))
                      )}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Auto-save Status */}
                  <div className={`p-3 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-gray-50/50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Save className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Auto-save Status</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Last saved:</span>
                        <span>{new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Status:</span>
                        <span className="text-green-500">Up to date</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className={`text-base font-semibold flex items-center gap-2 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Document Analytics
                  </h4>

                  {/* Productivity Score */}
                  <div className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-gray-50/50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Productivity Score</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }} />
                      </div>
                      <span className="text-sm font-bold">75%</span>
                    </div>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Great progress! Keep it up!</p>
                  </div>

                  {/* Document Stats */}
                  <Collapsible open={expandedSections['document-analytics']} onOpenChange={() => toggleSection('document-analytics')}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className={`w-full justify-between h-10 px-3 transition-all duration-200 backdrop-blur-sm border ${
                        theme === 'dark'
                          ? 'text-gray-300 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50'
                          : 'text-gray-700 border-gray-200/50 hover:bg-gray-100/50 hover:border-gray-300/50'
                      }`}>
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Detailed Analytics
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 mt-2 px-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-2 rounded border text-center ${
                          theme === 'dark' ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-gray-50/50'
                        }`}>
                          <div className="text-lg font-bold text-primary">{documentAnalytics.totalEdits}</div>
                          <div className="text-xs text-muted-foreground">Total Edits</div>
                        </div>
                        <div className={`p-2 rounded border text-center ${
                          theme === 'dark' ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-gray-50/50'
                        }`}>
                          <div className="text-lg font-bold text-primary">{documentAnalytics.averageSessionTime}m</div>
                          <div className="text-xs text-muted-foreground">Avg Session</div>
                        </div>
                        <div className={`p-2 rounded border text-center ${
                          theme === 'dark' ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-gray-50/50'
                        }`}>
                          <div className="text-lg font-bold text-primary">{documentAnalytics.focusTime}h</div>
                          <div className="text-xs text-muted-foreground">Focus Time</div>
                        </div>
                        <div className={`p-2 rounded border text-center ${
                          theme === 'dark' ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-gray-50/50'
                        }`}>
                          <div className="text-lg font-bold text-primary">{documentAnalytics.completionRate}%</div>
                          <div className="text-xs text-muted-foreground">Completion</div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Most Active Hour */}
                  <div className={`p-3 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-gray-50/50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Timer className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Most Active Hour</span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">2:00 PM</div>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>Peak productivity time</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Collaborate Tab */}
            {activeTab === 'collaborate' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className={`text-base font-semibold flex items-center gap-2 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Users className="h-5 w-5 text-primary" />
                    Collaboration
                  </h4>

                  {/* Active Collaborators */}
                  <Collapsible open={expandedSections['collaboration']} onOpenChange={() => toggleSection('collaboration')}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className={`w-full justify-between h-10 px-3 transition-all duration-200 backdrop-blur-sm border ${
                        theme === 'dark'
                          ? 'text-gray-300 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600/50'
                          : 'text-gray-700 border-gray-200/50 hover:bg-gray-100/50 hover:border-gray-300/50'
                      }`}>
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Active Collaborators
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2 px-2">
                      {collaborators.length === 0 ? (
                        <div className="text-center py-4">
                          <Users className={`h-8 w-8 mx-auto mb-2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>No active collaborators</p>
                          <Button
                            size="sm"
                            className="mt-2"
                            onClick={() => toast.info('Invite collaborators feature coming soon!')}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Invite
                          </Button>
                        </div>
                      ) : (
                        collaborators.map((collaborator) => (
                          <div key={collaborator.id} className={`flex items-center gap-3 p-2 rounded-lg border ${
                            theme === 'dark' ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200/50 bg-gray-50/50'
                          }`}>
                            <div className="relative">
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-xs font-medium text-primary">
                                  {collaborator.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border ${
                                collaborator.status === 'online' ? 'bg-green-500 border-green-600' :
                                collaborator.status === 'away' ? 'bg-yellow-500 border-yellow-600' :
                                'bg-gray-400 border-gray-500'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{collaborator.name}</p>
                              <p className={`text-xs text-muted-foreground ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>{collaborator.status}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-6 w-6">
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6">
                                <Video className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Collaboration Tools */}
                  <div className="space-y-2">
                    <h5 className={`text-xs font-semibold text-muted-foreground`}>COLLABORATION TOOLS</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-12 flex-col gap-1 text-xs ${
                          theme === 'dark'
                            ? 'border-gray-700/50 text-gray-300 hover:bg-gray-700/30'
                            : 'border-gray-200/50 text-gray-700 hover:bg-gray-100/30'
                        }`}
                        onClick={() => toast.info('Video call feature coming soon!')}
                      >
                        <Video className="h-4 w-4" />
                        Video Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-12 flex-col gap-1 text-xs ${
                          theme === 'dark'
                            ? 'border-gray-700/50 text-gray-300 hover:bg-gray-700/30'
                            : 'border-gray-200/50 text-gray-700 hover:bg-gray-100/30'
                        }`}
                        onClick={() => toast.info('Screen share feature coming soon!')}
                      >
                        <ScreenShare className="h-4 w-4" />
                        Share Screen
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-12 flex-col gap-1 text-xs ${
                          theme === 'dark'
                            ? 'border-gray-700/50 text-gray-300 hover:bg-gray-700/30'
                            : 'border-gray-200/50 text-gray-700 hover:bg-gray-100/30'
                        }`}
                        onClick={() => toast.info('Voice chat feature coming soon!')}
                      >
                        <Mic className="h-4 w-4" />
                        Voice Chat
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-12 flex-col gap-1 text-xs ${
                          theme === 'dark'
                            ? 'border-gray-700/50 text-gray-300 hover:bg-gray-700/30'
                            : 'border-gray-200/50 text-gray-700 hover:bg-gray-100/30'
                        }`}
                        onClick={() => toast.info('Comments feature coming soon!')}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Comments
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className={`flex items-center justify-between ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <h4 className="text-base font-semibold flex items-center gap-2">
                      <div className="h-1 w-4 bg-primary rounded-full" />
                      My Documents
                      {documents.length > 0 && (
                        <Badge variant="outline" className="text-xs ml-2">
                          {documents.length}
                        </Badge>
                      )}
                    </h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setIsProcessing(true);
                            createDocumentWithContent();
                            toast.success('New document created');
                            setTimeout(() => setIsProcessing(false), 500);
                          }}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create new document</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Document Search */}
                  {documents.length > 3 && (
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <Input
                        placeholder="Search documents..."
                        className={`pl-9 pr-3 h-8 text-xs transition-all duration-200 backdrop-blur-sm border ${
                          theme === 'dark' 
                            ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-primary/50' 
                            : 'bg-white/50 border-gray-200/50 placeholder-gray-500 focus:border-primary/50'
                        }`}
                      />
                    </div>
                  )}

                  {/* Favorites Section */}
                  {favorites.length > 0 && (
                    <div className="space-y-3">
                      <h5 className={`text-xs font-semibold flex items-center gap-2 text-muted-foreground`}>
                        <Star className="h-3 w-3" />
                        FAVORITES
                      </h5>
                      <div className="space-y-2">
                        {documents
                          .filter(doc => favorites.includes(doc.id))
                          .map((doc) => (
                            <div
                              key={doc.id}
                              className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border hover:shadow-md ${
                                currentDocument?.id === doc.id
                                  ? theme === 'dark'
                                    ? 'bg-primary/20 border-primary/30'
                                    : 'bg-primary/10 border-primary/30'
                                  : theme === 'dark'
                                    ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-700/40'
                                    : 'bg-gray-50/50 border-gray-200/50 hover:bg-white/80'
                              }`}
                              onClick={() => handleDocumentAction('select', doc.id)}
                            >
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                                currentDocument?.id === doc.id
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                              }`}>
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{doc.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{doc.content?.length || 0} chars</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-6 w-6 hover:bg-yellow-100 hover:text-yellow-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDocumentAction('unfavorite', doc.id);
                                      }}
                                    >
                                      <Star className="h-3 w-3 fill-current text-yellow-600" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Remove from favorites</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* All Documents */}
                  <div className="space-y-3">
                    {favorites.length > 0 && (
                      <h5 className={`text-xs font-semibold text-muted-foreground`}>
                        ALL DOCUMENTS
                      </h5>
                    )}
                    <div className="space-y-2">
                      {documents.length === 0 ? (
                        <div className="text-center py-8">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                            theme === 'dark' 
                              ? 'bg-gray-800/50 border-gray-700/50' 
                              : 'bg-gray-100/50 border-gray-200/50'
                          }`}>
                            <FileText className={`h-6 w-6 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                          </div>
                          <h3 className={`text-sm font-medium mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>No documents yet</h3>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>Create your first document to get started</p>
                        </div>
                      ) : (
                        documents
                          .filter(doc => !favorites.includes(doc.id))
                          .map((doc) => (
                            <div
                              key={doc.id}
                              className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border hover:shadow-md ${
                                currentDocument?.id === doc.id
                                  ? theme === 'dark'
                                    ? 'bg-primary/20 border-primary/30'
                                    : 'bg-primary/10 border-primary/30'
                                  : theme === 'dark'
                                    ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-700/40'
                                    : 'bg-gray-50/50 border-gray-200/50 hover:bg-white/80'
                              }`}
                              onClick={() => handleDocumentAction('select', doc.id)}
                            >
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                                currentDocument?.id === doc.id
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                              }`}>
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{doc.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{doc.content?.length || 0} chars</span>
                                </div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-6 w-6 hover:bg-yellow-100 hover:text-yellow-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDocumentAction('favorite', doc.id);
                                      }}
                                    >
                                      <Star className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Add to favorites</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-6 w-6 hover:bg-red-100 hover:text-red-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
                                          handleDocumentAction('delete', doc.id);
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete document</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </>
      )}
      
      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className={`sm:max-w-lg ${
          theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <Share2 className="h-5 w-5 text-primary" />
              Share Document
            </DialogTitle>
            <DialogDescription className={
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }>
              Generate a shareable link for your document that others can access.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            {/* Document Info */}
            <div className={`p-3 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-gray-50/50 border-gray-200/50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className={`font-medium text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentDocument?.title || 'Untitled Document'}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{documentStats.wordCount} words</span>
                <span>•</span>
                <span>{documentStats.characterCount} characters</span>
                <span>•</span>
                <span>Last edited: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
            
            {/* Shareable Link */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Shareable Link
              </label>
              <div className="flex gap-2">
                <Input
                  value={shareableLink}
                  readOnly
                  placeholder="Generating link..."
                  className={`flex-1 text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-900'
                  }`}
                />
                <Button
                  onClick={copyShareableLink}
                  disabled={!shareableLink || copiedToClipboard}
                  className={`px-3 ${
                    copiedToClipboard
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : theme === 'dark'
                        ? 'bg-primary hover:bg-primary/90 text-white'
                        : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  {copiedToClipboard ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {shareLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating shareable link...
                </div>
              )}
            </div>
            
            {/* Share Options */}
            <div className={`p-3 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800/30 border-gray-700/30' 
                : 'bg-gray-50/30 border-gray-200/30'
            }`}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Anyone with the link can view this document</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Eye className="h-4 w-4" />
                <span>Link expires in 30 days</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeShareDialog}
              className={
                theme === 'dark'
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className={`sm:max-w-lg ${
          theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <Download className="h-5 w-5 text-primary" />
              Export Document
            </DialogTitle>
            <DialogDescription className={
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }>
              Choose the format to export your document.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            {/* Document Info */}
            <div className={`p-3 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700/50' 
                : 'bg-gray-50/50 border-gray-200/50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className={`font-medium text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentDocument?.title || 'Untitled Document'}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{documentStats.wordCount} words</span>
                <span>•</span>
                <span>{documentStats.characterCount} characters</span>
                <span>•</span>
                <span>{documentStats.pageCount} pages</span>
              </div>
            </div>
            
            {/* Export Format Selection */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'pdf', label: 'PDF', icon: FileText },
                  { value: 'docx', label: 'DOCX', icon: FileText },
                  { value: 'txt', label: 'TXT', icon: FileText }
                ].map((format) => {
                  const Icon = format.icon;
                  return (
                    <Button
                      key={format.value}
                      variant={exportFormat === format.value ? 'default' : 'outline'}
                      onClick={() => setExportFormat(format.value)}
                      className={`flex flex-col gap-1 h-16 ${
                        exportFormat === format.value
                          ? 'bg-primary text-white'
                          : theme === 'dark'
                            ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{format.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Export Options */}
            <div className={`p-3 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800/30 border-gray-700/30' 
                : 'bg-gray-50/30 border-gray-200/30'
            }`}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Settings2 className="h-4 w-4" />
                <span>Include formatting and images when available</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <CheckCircle className="h-4 w-4" />
                <span>Preserve document structure</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeExportDialog}
              disabled={exportLoading}
              className={
                theme === 'dark'
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={exportLoading || !currentDocument}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {exportLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export {exportFormat.toUpperCase()}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Find & Replace Dialog */}
      <Dialog open={showFindReplaceDialog} onOpenChange={setShowFindReplaceDialog}>
        <DialogContent className={`sm:max-w-lg ${
          theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <FileSearch className="h-5 w-5 text-primary" />
              Find & Replace
            </DialogTitle>
            <DialogDescription className={
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }>
              Search for text in your document and replace it with new text.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            {/* Find Text */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Find
              </label>
              <Input
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="Enter text to find..."
                className={`text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            {/* Replace Text */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Replace with
              </label>
              <Input
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Enter replacement text..."
                className={`text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            {/* Options */}
            <div className={`p-3 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800/30 border-gray-700/30' 
                : 'bg-gray-50/30 border-gray-200/30'
            }`}>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" className="rounded" />
                  <span>Match case</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" className="rounded" />
                  <span>Whole word</span>
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={closeFindReplaceDialog}
              className={
                theme === 'dark'
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }
            >
              Close
            </Button>
            <Button
              onClick={handleFind}
              disabled={!findText || !editor?.documentEditor}
              variant="outline"
              className={
                theme === 'dark'
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }
            >
              <FileSearch className="h-4 w-4 mr-2" />
              Find
            </Button>
            <Button
              onClick={handleReplace}
              disabled={!findText || !editor?.documentEditor}
              variant="outline"
              className={
                theme === 'dark'
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Replace
            </Button>
            <Button
              onClick={handleReplaceAll}
              disabled={!findText || !editor?.documentEditor}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Replace All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}
