import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Document {
  id: string;
  title: string;
  content?: string;
  content_html?: string;
  status: 'draft' | 'published' | 'archived';
  word_count: number;
  character_count: number;
  is_favorite: boolean;
  is_pinned: boolean;
  workspace_id?: string | null;
  template_id?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DocState {
  currentDocument: Document | null;
  documents: Document[];
  saveStatus: 'saved' | 'saving' | 'unsaved';
  isLoading: boolean;

  setCurrentDocument: (doc: Document | null) => void;
  updateDocumentTitle: (title: string) => void;
  updateDocument: (updates: Partial<Document>) => void;
  createNewDocument: (userId: string) => Promise<Document | null>;
  saveDocument: () => Promise<void>;
  loadDocument: (id: string) => Promise<void>;
  loadAllDocuments: (userId: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  autoSave: () => (() => void) | void;
}

function mapRow(row: any): Document {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    content_html: row.content_html,
    status: row.status,
    word_count: row.word_count ?? 0,
    character_count: row.character_count ?? 0,
    is_favorite: row.is_favorite ?? false,
    is_pinned: row.is_pinned ?? false,
    workspace_id: row.workspace_id,
    template_id: row.template_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export const useDocStore = create<DocState>((set, get) => ({
  currentDocument: null,
  documents: [],
  saveStatus: 'saved',
  isLoading: false,

  setCurrentDocument: (doc) => set({ currentDocument: doc }),

  updateDocumentTitle: (title) => {
    const current = get().currentDocument;
    if (current) {
      set({
        currentDocument: { ...current, title, updatedAt: new Date() },
        saveStatus: 'unsaved',
      });
    }
  },

  updateDocument: (updates) => {
    const current = get().currentDocument;
    if (current) {
      set({
        currentDocument: { ...current, ...updates, updatedAt: new Date() },
        saveStatus: 'unsaved',
      });
    }
  },

  createNewDocument: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: userId,
          title: 'Untitled Document',
          content: '',
          status: 'draft' as const,
        })
        .select()
        .single();

      if (error) throw error;

      const newDoc = mapRow(data);
      set((state) => ({
        currentDocument: newDoc,
        documents: [newDoc, ...state.documents],
        saveStatus: 'saved',
      }));
      return newDoc;
    } catch (error) {
      console.error('Failed to create document:', error);
      return null;
    }
  },

  saveDocument: async () => {
    const { currentDocument } = get();
    if (!currentDocument) return;

    set({ saveStatus: 'saving' });

    try {
      // Count words and characters from content
      const text = (currentDocument.content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      const wordCount = text ? text.split(' ').length : 0;
      const charCount = text.length;

      const { error } = await supabase
        .from('documents')
        .update({
          title: currentDocument.title,
          content: currentDocument.content,
          content_html: currentDocument.content_html,
          word_count: wordCount,
          character_count: charCount,
          status: currentDocument.status,
          is_favorite: currentDocument.is_favorite,
          is_pinned: currentDocument.is_pinned,
        })
        .eq('id', currentDocument.id);

      if (error) throw error;

      set((state) => ({
        saveStatus: 'saved',
        currentDocument: state.currentDocument
          ? { ...state.currentDocument, word_count: wordCount, character_count: charCount, updatedAt: new Date() }
          : null,
        documents: state.documents.map((doc) =>
          doc.id === currentDocument.id
            ? { ...currentDocument, word_count: wordCount, character_count: charCount, updatedAt: new Date() }
            : doc
        ),
      }));
    } catch (error) {
      console.error('Save failed:', error);
      set({ saveStatus: 'unsaved' });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('documentSaveError', {
            detail: {
              message: error instanceof Error ? error.message : 'Failed to save document',
              documentId: currentDocument.id,
            },
          })
        );
      }
      throw error;
    }
  },

  loadDocument: async (id: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      set({ currentDocument: data ? mapRow(data) : null, isLoading: false, saveStatus: 'saved' });
    } catch (error) {
      console.error('Load document failed:', error);
      set({ isLoading: false, currentDocument: null });
    }
  },

  loadAllDocuments: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      set({ documents: (data || []).map(mapRow), isLoading: false });
    } catch (error) {
      console.error('Load all documents failed:', error);
      set({ documents: [], isLoading: false });
    }
  },

  deleteDocument: async (id: string) => {
    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;

      set((state) => ({
        documents: state.documents.filter((d) => d.id !== id),
        currentDocument: state.currentDocument?.id === id ? null : state.currentDocument,
      }));
    } catch (error) {
      console.error('Delete document failed:', error);
      throw error;
    }
  },

  autoSave: () => {
    const { currentDocument, saveStatus } = get();
    if (!currentDocument || saveStatus === 'saved' || saveStatus === 'saving') return;

    const saveTimeout = setTimeout(async () => {
      try {
        await get().saveDocument();
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 3000);

    return () => clearTimeout(saveTimeout);
  },
}));
