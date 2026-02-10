import React, { useRef, useState, useCallback, useEffect } from 'react';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
import { useParams } from 'react-router-dom';
import { Topbar } from './Topbar';
import { SidebarLeft } from './SidebarLeft';
import { SidebarRight } from './SidebarRight';
import MainToolbar from './editor/Toolbar';
import StatusBar from './StatusBar';
import MobileAIChat from './MobileAIChat';
import { useEditorStore } from '@/state/useEditorStore';
import { useUserStore } from '@/state/useUserStore';
import { useDocStore } from '@/state/useDocStore';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

DocumentEditorContainerComponent.Inject(Toolbar);

const DocumentEditor: React.FC = () => {
  const { id: documentId } = useParams();
  const editorRef = useRef<DocumentEditorContainerComponent | null>(null);
  const { setEditor } = useEditorStore();
  const { theme } = useUserStore();
  const { currentDocument, loadDocument, updateDocument, saveDocument } = useDocStore();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [documentName, setDocumentName] = useState('Untitled Document');
  const [isSaved, setIsSaved] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [selectedFontSize, setSelectedFontSize] = useState('12');
  const [isTyping, setIsTyping] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentLoadedRef = useRef(false);

  // Load document from Supabase on mount
  useEffect(() => {
    if (documentId && user) {
      contentLoadedRef.current = false;
      loadDocument(documentId);
    }
  }, [documentId, user, loadDocument]);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Load document content into editor when ready
  useEffect(() => {
    if (currentDocument && editorRef.current?.documentEditor && isReady && !contentLoadedRef.current) {
      const editor = editorRef.current.documentEditor;
      if (currentDocument.content) {
        try {
          // Try to open as SFDT first (if previously saved as SFDT)
          try {
            const parsed = JSON.parse(currentDocument.content);
            if (parsed.sections) {
              editor.open(currentDocument.content);
              contentLoadedRef.current = true;
              setDocumentName(currentDocument.title);
              editor.focusIn();
              return;
            }
          } catch {
            // Not JSON/SFDT, treat as plain text
          }
          
          // Fall back to inserting as plain text
          editor.selection.selectAll();
          editor.editor.delete();
          const plainText = currentDocument.content.replace(/<[^>]*>/g, '');
          if (plainText.trim()) {
            editor.editor.insertText(plainText);
          }
          contentLoadedRef.current = true;
          setDocumentName(currentDocument.title);
          editor.focusIn();
        } catch (error) {
          console.error('Failed to load content:', error);
        }
      } else {
        contentLoadedRef.current = true;
        setDocumentName(currentDocument.title);
      }
    }
  }, [currentDocument?.id, isReady]);

  // Extract content from editor
  const getEditorContent = useCallback(() => {
    if (!editorRef.current?.documentEditor) return { text: '', sfdt: '' };
    const editor = editorRef.current.documentEditor;
    try {
      const sfdt = editor.serialize();
      // Extract plain text for word/char counts
      const text = sfdt.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      return { text, sfdt };
    } catch {
      return { text: '', sfdt: '' };
    }
  }, []);

  // Auto-save to Supabase
  const performAutoSave = useCallback(async () => {
    if (!editorRef.current?.documentEditor || !currentDocument || isAutoSaving) return;
    
    setIsAutoSaving(true);
    try {
      const { text, sfdt } = getEditorContent();
      const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
      const chars = text.length;

      updateDocument({
        content: sfdt,
        word_count: words,
        character_count: chars,
      });
      
      await saveDocument();
      setLastSaved(new Date());
      setIsSaved(true);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [currentDocument, isAutoSaving, getEditorContent, updateDocument, saveDocument]);

  const handleContentChange = useCallback(() => {
    if (!editorRef.current?.documentEditor) return;
    const editor = editorRef.current.documentEditor;
    setTotalPages(editor.pageCount || 1);
    setIsSaved(false);
    setIsTyping(true);

    // Update word/char counts
    try {
      const { text } = getEditorContent();
      const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
      setWordCount(words);
      setCharacterCount(text.length);
    } catch {
      // Silent fail
    }

    updateActiveFormats();

    // Debounce typing indicator
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1500);

    // Debounce auto-save (5 seconds after last change)
    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, 5000);
  }, [getEditorContent, performAutoSave]);

  const updateActiveFormats = useCallback(() => {
    if (!editorRef.current?.documentEditor) return;
    const selection = editorRef.current.documentEditor.selection;
    const formats: string[] = [];
    if (selection?.characterFormat) {
      if (selection.characterFormat.bold) formats.push('bold');
      if (selection.characterFormat.italic) formats.push('italic');
      if (selection.characterFormat.underline !== 'None') formats.push('underline');
      if (selection.characterFormat.strikethrough !== 'None') formats.push('strikethrough');
      if (selection.characterFormat.fontFamily) setSelectedFont(selection.characterFormat.fontFamily);
      if (selection.characterFormat.fontSize) setSelectedFontSize(selection.characterFormat.fontSize.toString());
    }
    setActiveFormats(formats);
  }, []);

  const handleSave = useCallback(async () => {
    if (!editorRef.current?.documentEditor) return;
    const { text, sfdt } = getEditorContent();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    
    updateDocument({
      content: sfdt,
      word_count: words,
      character_count: text.length,
    });
    await saveDocument();
    setIsSaved(true);
    setLastSaved(new Date());
  }, [getEditorContent, updateDocument, saveDocument]);

  const handleExportDocx = useCallback(() => {
    if (editorRef.current?.documentEditor) {
      editorRef.current.documentEditor.save(documentName, 'Docx');
    }
  }, [documentName]);

  // Toolbar actions
  const handleToolbarAction = useCallback((action: string, value?: string) => {
    if (!editorRef.current?.documentEditor) {
      toast.error('Please wait for the editor to load');
      return;
    }

    const editor = editorRef.current.documentEditor;
    const selection = editor.selection;
    const editorModule = editor.editor;
    const hasSelection = selection && (selection.text || selection.characterFormat);
    const hasParagraph = selection && selection.paragraphFormat;

    switch (action) {
      case 'undo':
        if (editor.editorHistory?.canUndo()) editor.editorHistory.undo();
        break;
      case 'redo':
        if (editor.editorHistory?.canRedo()) editor.editorHistory.redo();
        break;
      case 'bold':
        if (hasSelection) selection.characterFormat.bold = !selection.characterFormat.bold;
        break;
      case 'italic':
        if (hasSelection) selection.characterFormat.italic = !selection.characterFormat.italic;
        break;
      case 'underline':
        if (hasSelection) {
          selection.characterFormat.underline = selection.characterFormat.underline === 'Single' ? 'None' : 'Single';
        }
        break;
      case 'strikethrough':
        if (hasSelection) {
          selection.characterFormat.strikethrough = selection.characterFormat.strikethrough === 'SingleStrike' ? 'None' : 'SingleStrike';
        }
        break;
      case 'subscript':
        if (hasSelection) {
          selection.characterFormat.baselineAlignment = selection.characterFormat.baselineAlignment === 'Subscript' ? 'Normal' : 'Subscript';
        }
        break;
      case 'superscript':
        if (hasSelection) {
          selection.characterFormat.baselineAlignment = selection.characterFormat.baselineAlignment === 'Superscript' ? 'Normal' : 'Superscript';
        }
        break;
      case 'h1':
        if (hasParagraph) selection.paragraphFormat.styleName = 'Heading 1';
        break;
      case 'h2':
        if (hasParagraph) selection.paragraphFormat.styleName = 'Heading 2';
        break;
      case 'h3':
        if (hasParagraph) selection.paragraphFormat.styleName = 'Heading 3';
        break;
      case 'alignLeft':
        if (hasParagraph) selection.paragraphFormat.textAlignment = 'Left';
        break;
      case 'alignCenter':
        if (hasParagraph) selection.paragraphFormat.textAlignment = 'Center';
        break;
      case 'alignRight':
        if (hasParagraph) selection.paragraphFormat.textAlignment = 'Right';
        break;
      case 'alignJustify':
        if (hasParagraph) selection.paragraphFormat.textAlignment = 'Justify';
        break;
      case 'orderedList':
        if (hasParagraph) editorModule?.applyNumbering('%1.');
        break;
      case 'unorderedList':
        if (hasParagraph) editorModule?.applyBullet('•', 'Symbol');
        break;
      case 'horizontalRule':
        editorModule?.insertText('\n' + '─'.repeat(50) + '\n');
        break;
      case 'link': {
        const url = window.prompt('Enter URL:', 'https://');
        if (url && url.trim() && url !== 'https://') {
          const text = selection?.text || url;
          try { editorModule?.insertHyperlink(url.trim(), text); } catch { toast.error('Failed to insert link'); }
        }
        break;
      }
      case 'image': {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: Event) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            if (file.size > 5 * 1024 * 1024) { toast.error('Image must be < 5MB'); return; }
            const reader = new FileReader();
            reader.onload = () => {
              try { editor.editor?.insertImage(reader.result as string, 400, 300); } catch { toast.error('Failed to insert image'); }
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
        break;
      }
      case 'imagePosition':
        if (value && editor.selection) {
          const alignMap: Record<string, string> = { left: 'Left', center: 'Center', right: 'Right', inline: 'Left', top: 'Center', bottom: 'Center', behind: 'Center', front: 'Center' };
          if (alignMap[value]) editor.selection.paragraphFormat.textAlignment = alignMap[value] as any;
        }
        break;
      case 'table': {
        const rows = window.prompt('Rows (1-20):', '3');
        const cols = window.prompt('Columns (1-20):', '3');
        if (rows && cols) {
          const r = parseInt(rows), c = parseInt(cols);
          if (r > 0 && r <= 20 && c > 0 && c <= 20) editorModule?.insertTable(r, c);
        }
        break;
      }
      case 'insertRow': try { editor.editor.insertRow(); } catch { } break;
      case 'insertColumn': try { editor.editor.insertColumn(); } catch { } break;
      case 'deleteRow': try { editor.editor.deleteRow(); } catch { } break;
      case 'deleteColumn': try { editor.editor.deleteColumn(); } catch { } break;
      case 'comment':
        if (hasSelection && selection?.text) {
          try { editorRef.current?.documentEditor?.editor?.insertComment(''); } catch { }
        }
        break;
      case 'highlight':
        if (hasSelection) {
          selection.characterFormat.highlightColor = selection.characterFormat.highlightColor === 'Yellow' ? 'NoColor' : 'Yellow';
        }
        break;
      case 'fontFamily':
        if (value && hasSelection) { selection.characterFormat.fontFamily = value; setSelectedFont(value); }
        break;
      case 'fontSize':
        if (value && hasSelection) {
          const size = parseFloat(value);
          if (size > 0 && size <= 72) { selection.characterFormat.fontSize = size; setSelectedFontSize(value); }
        }
        break;
      case 'textColor':
        if (value && hasSelection) {
          const colorMap: Record<string, string> = {
            '#000000': 'Black', '#ef4444': 'Red', '#3b82f6': 'Blue', '#10b981': 'Green',
            '#f59e0b': 'Yellow', '#8b5cf6': 'Violet', '#ec4899': 'Pink', '#6b7280': 'Gray',
          };
          selection.characterFormat.highlightColor = (colorMap[value] || 'Black') as any;
        }
        break;
      case 'quote':
        if (hasParagraph) {
          selection.paragraphFormat.leftIndent = selection.paragraphFormat.leftIndent === 36 ? 0 : 36;
        }
        break;
      case 'code':
        if (hasSelection) {
          selection.characterFormat.fontFamily = selection.characterFormat.fontFamily === 'Consolas' ? 'Inter' : 'Consolas';
        }
        break;
      case 'lineSpacing':
        if (value && hasParagraph) {
          selection.paragraphFormat.lineSpacing = parseFloat(value);
          selection.paragraphFormat.lineSpacingType = 'Multiple';
        }
        break;
      case 'ai-assist':
        window.dispatchEvent(new CustomEvent('toggleAIAssistant'));
        break;
      default:
        console.log('Unhandled action:', action);
    }
  }, []);

  const handleEditorReady = useCallback(() => {
    setIsReady(true);
    if (editorRef.current) setEditor(editorRef.current);
    editorRef.current?.documentEditor?.focusIn();
  }, [setEditor]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editorRef.current?.documentEditor) return;
      const isCtrl = e.ctrlKey || e.metaKey;
      if (!isCtrl) return;

      switch (e.key) {
        case 'b': e.preventDefault(); handleToolbarAction('bold'); break;
        case 'i': e.preventDefault(); handleToolbarAction('italic'); break;
        case 'u': e.preventDefault(); handleToolbarAction('underline'); break;
        case 's': e.preventDefault(); handleSave(); toast.success('Document saved'); break;
        case 'z': e.preventDefault(); handleToolbarAction('undo'); break;
        case 'y': e.preventDefault(); handleToolbarAction('redo'); break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleToolbarAction, handleSave]);

  // Handle AI content application
  useEffect(() => {
    const handler = (event: Event) => {
      const content = (event as CustomEvent<{ content: string }>).detail?.content;
      if (content && editorRef.current?.documentEditor) {
        editorRef.current.documentEditor.editor?.insertText(content);
        toast.success('AI content applied');
      }
    };
    window.addEventListener('applyToDocument', handler);
    return () => window.removeEventListener('applyToDocument', handler);
  }, []);

  // Save before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSaved) {
        e.preventDefault();
        e.returnValue = '';
        performAutoSave();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSaved, performAutoSave]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
  }, []);

  if (isMobile) return <MobileAIChat />;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div className="flex-shrink-0"><Topbar /></div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-col"><SidebarLeft /></div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-shrink-0 border-b border-border bg-background">
            <MainToolbar
              onAction={handleToolbarAction}
              activeFormats={activeFormats}
              selectedFont={selectedFont}
              selectedFontSize={selectedFontSize}
            />
          </div>

          <div className="flex-1 min-h-0 bg-background">
            <div className="h-full w-full flex items-center justify-center p-4">
              <div className="w-full h-full max-w-6xl rounded-lg shadow-xl overflow-hidden bg-card">
                <DocumentEditorContainerComponent
                  ref={editorRef}
                  id="documentEditor"
                  style={{ display: 'block', height: '100%', direction: 'ltr' }}
                  enableToolbar={false}
                  showPropertiesPane={false}
                  enableLocalPaste={true}
                  enableSpellCheck={false}
                  enableComment={true}
                  enableTrackChanges={false}
                  created={handleEditorReady}
                  contentChange={handleContentChange}
                />
              </div>
            </div>
          </div>

          <StatusBar
            currentPage={currentPage}
            totalPages={totalPages}
            wordCount={wordCount}
            characterCount={characterCount}
            documentName={documentName}
            isSaved={isSaved}
            isTyping={isTyping}
            isAutoSaving={isAutoSaving}
            lastSaved={lastSaved}
          />
        </div>

        <div className="flex flex-col"><SidebarRight /></div>
      </div>
    </div>
  );
};

export default DocumentEditor;
