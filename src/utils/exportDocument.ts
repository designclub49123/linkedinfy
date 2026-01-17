import React from 'react';
import { Document as DocType } from '@/state/useDocStore';
import { toast } from 'sonner';
import { useEditorStore } from '@/state/useEditorStore';

/**
 * Get the Syncfusion Document Editor instance
 */
function getEditor() {
  const editorStore = useEditorStore.getState();
  const editor = editorStore.editor?.documentEditor;
  
  if (!editor) {
    throw new Error('Document editor not available. Please make sure the editor is loaded.');
  }
  
  return editor;
}

/**
 * Export with timeout promise
 */
function exportWithTimeout(promise: Promise<Blob>, timeoutMs: number = 5000): Promise<Blob> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Export timeout - please try again')), timeoutMs);
    })
  ]);
}

/**
 * Export document content to PDF using Syncfusion's built-in export
 * @param doc - Document to export
 * @param contentRef - Reference to the content div in the editor (not used, kept for compatibility)
 * @param onProgress - Optional progress callback (0-100)
 */
export async function exportToPDF(
  doc: DocType,
  contentRef: React.RefObject<HTMLDivElement>,
  onProgress?: (progress: number) => void
): Promise<void> {
  const toastId = toast.loading('Preparing PDF export...');
  
  try {
    onProgress?.(10);
    
    const editor = getEditor();
    
    // Ensure editor has content by adding sample text if empty
    const content = editor.serialize();
    if (!content || content.trim() === '<p></p>' || content.trim() === '') {
      editor.editor.insertText('This is a sample document created with PaperMorph.\n\nStart typing to add your content here.');
      // Wait a moment for content to be inserted
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    onProgress?.(50);
    
    // Use Syncfusion's built-in PDF export with 5-second timeout
    const blob = await exportWithTimeout(
      new Promise<Blob>((resolve, reject) => {
        try {
          editor.saveAsBlob('pdf' as any).then(resolve).catch(reject);
        } catch (error) {
          reject(error);
        }
      }),
      5000
    );
    
    onProgress?.(80);
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onProgress?.(100);
    toast.success('PDF exported successfully!', { id: toastId });
    
  } catch (error) {
    console.error('PDF export failed:', error);
    const message = error instanceof Error && error.message.includes('timeout') 
      ? 'Export timeout - please try again' 
      : 'Failed to export PDF';
    toast.error(message, { id: toastId });
    throw error;
  }
}

/**
 * Export document content to DOCX using Syncfusion's built-in export
 * @param doc - Document to export
 * @param contentRef - Reference to the content div in the editor (not used, kept for compatibility)
 */
export async function exportToDOCX(
  doc: DocType,
  contentRef: React.RefObject<HTMLDivElement>
): Promise<void> {
  const toastId = toast.loading('Preparing DOCX export...');
  
  try {
    const editor = getEditor();
    
    // Ensure editor has content
    const content = editor.serialize();
    if (!content || content.trim() === '<p></p>' || content.trim() === '') {
      editor.editor.insertText('This is a sample document created with PaperMorph.\n\nStart typing to add your content here.');
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Use Syncfusion's built-in Word export with 5-second timeout
    const blob = await exportWithTimeout(
      new Promise<Blob>((resolve, reject) => {
        try {
          editor.saveAsBlob('Docx').then(resolve).catch(reject);
        } catch (error) {
          reject(error);
        }
      }),
      5000
    );
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('DOCX exported successfully!', { id: toastId });
    
  } catch (error) {
    console.error('DOCX export failed:', error);
    const message = error instanceof Error && error.message.includes('timeout') 
      ? 'Export timeout - please try again' 
      : 'Failed to export DOCX';
    toast.error(message, { id: toastId });
    throw error;
  }
}

/**
 * Export document content to HTML format using Syncfusion's built-in export
 * @param doc - Document to export
 * @param contentRef - Reference to the content div in the editor (not used, kept for compatibility)
 */
export async function exportToHTML(
  doc: DocType,
  contentRef: React.RefObject<HTMLDivElement>
): Promise<void> {
  const toastId = toast.loading('Preparing HTML export...');
  
  try {
    const editor = getEditor();
    
    // Ensure editor has content
    const content = editor.serialize();
    if (!content || content.trim() === '<p></p>' || content.trim() === '') {
      editor.editor.insertText('This is a sample document created with PaperMorph.\n\nStart typing to add your content here.');
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Use Syncfusion's built-in HTML export with 5-second timeout
    const blob = await exportWithTimeout(
      new Promise<Blob>((resolve, reject) => {
        try {
          editor.saveAsBlob('html' as any).then(resolve).catch(reject);
        } catch (error) {
          reject(error);
        }
      }),
      5000
    );
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('HTML exported successfully!', { id: toastId });
    
  } catch (error) {
    console.error('HTML export failed:', error);
    const message = error instanceof Error && error.message.includes('timeout') 
      ? 'Export timeout - please try again' 
      : 'Failed to export HTML';
    toast.error(message, { id: toastId });
    throw error;
  }
}

/**
 * Export document content to plain text format
 * @param doc - Document to export
 * @param contentRef - Reference to the content div in the editor (not used, kept for compatibility)
 */
export async function exportToTXT(
  doc: DocType,
  contentRef: React.RefObject<HTMLDivElement>
): Promise<void> {
  const toastId = toast.loading('Preparing TXT export...');
  
  try {
    const editor = getEditor();
    
    // Ensure editor has content
    const content = editor.serialize();
    if (!content || content.trim() === '<p></p>' || content.trim() === '') {
      editor.editor.insertText('This is a sample document created with PaperMorph.\n\nStart typing to add your content here.');
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Use Syncfusion's built-in text export with 5-second timeout
    const blob = await exportWithTimeout(
      new Promise<Blob>((resolve, reject) => {
        try {
          editor.saveAsBlob('Txt').then(resolve).catch(reject);
        } catch (error) {
          reject(error);
        }
      }),
      5000
    );
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('TXT exported successfully!', { id: toastId });
    
  } catch (error) {
    console.error('TXT export failed:', error);
    const message = error instanceof Error && error.message.includes('timeout') 
      ? 'Export timeout - please try again' 
      : 'Failed to export TXT';
    toast.error(message, { id: toastId });
    throw error;
  }
}
