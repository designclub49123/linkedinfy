import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AutosaveConfig {
  documentId: string | null;
  content: string;
  contentHtml: string;
  title: string;
  interval?: number; // in milliseconds
  enabled?: boolean;
}

interface AutosaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  error: string | null;
}

export function useAutosave({
  documentId,
  content,
  contentHtml,
  title,
  interval = 5000, // Default 5 seconds
  enabled = true,
}: AutosaveConfig) {
  const [state, setState] = useState<AutosaveState>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    error: null,
  });

  const lastSavedContent = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSaveRef = useRef<boolean>(false);

  // Calculate word count
  const calculateWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Save function
  const save = useCallback(async () => {
    if (!documentId || !enabled) return;
    
    // Capture the current content at save time to avoid race conditions
    const contentToSave = content;
    if (contentToSave === lastSavedContent.current) return;

    setState(prev => ({ ...prev, isSaving: true, error: null }));
    pendingSaveRef.current = false;

    try {
      const wordCount = calculateWordCount(contentToSave);
      const characterCount = contentToSave.length;

      const { error } = await supabase
        .from('documents')
        .update({
          content: contentToSave,
          content_html: contentHtml,
          title,
          word_count: wordCount,
          character_count: characterCount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);

      if (error) throw error;

      lastSavedContent.current = contentToSave;
      setState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      }));
    } catch (err) {
      console.error('Autosave failed:', err);
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: 'Failed to save. Your work is preserved locally.',
      }));
    }
  }, [documentId, content, contentHtml, title, enabled]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    await save();
  }, [save]);

  // Debounced autosave
  useEffect(() => {
    if (!enabled || !documentId) return;

    // Check if content changed
    if (content !== lastSavedContent.current) {
      setState(prev => ({ ...prev, hasUnsavedChanges: true }));

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        save();
      }, interval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, documentId, enabled, interval, save]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        // Try to save before leaving
        save();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && state.hasUnsavedChanges) {
        save();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.hasUnsavedChanges, save]);

  return {
    ...state,
    saveNow,
    setLastSavedContent: (content: string) => {
      lastSavedContent.current = content;
    },
  };
}

export default useAutosave;
