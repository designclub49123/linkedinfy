import React from 'react';
import { FileText, Hash, Type, Save, Clock, Zap, Circle } from 'lucide-react';

interface StatusBarProps {
  currentPage: number;
  totalPages: number;
  wordCount: number;
  characterCount: number;
  documentName: string;
  isSaved: boolean;
  isTyping: boolean;
  isAutoSaving: boolean;
  lastSaved: Date | null;
}

const StatusBar: React.FC<StatusBarProps> = ({
  currentPage,
  totalPages,
  wordCount,
  characterCount,
  documentName,
  isSaved,
  isTyping,
  isAutoSaving,
  lastSaved
}) => {
  

  const formatLastSaved = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 text-sm border-t border-border bg-background text-muted-foreground transition-colors">
      {/* Left side - Document info and status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="truncate max-w-[250px] font-medium">{documentName}</span>
        </div>
        
        {/* Save Status */}
        <div className="flex items-center gap-2">
          {isAutoSaving ? (
            <>
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-primary font-medium">Auto-saving...</span>
            </>
          ) : isTyping ? (
            <>
              <Circle className="h-2 w-2 text-accent-foreground animate-pulse" />
              <span className="text-accent-foreground font-medium">Typing...</span>
            </>
          ) : isSaved ? (
            <>
              <Save className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">Saved</span>
            </>
          ) : (
            <>
              <Circle className="h-2 w-2 text-destructive" />
              <span className="text-destructive font-medium">Unsaved</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          <span className="font-medium">Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Right side - Statistics and last saved */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          <span className="font-medium">{wordCount} words</span>
        </div>
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          <span className="font-medium">{characterCount} characters</span>
        </div>
        
        {/* Last saved info */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium">Saved: {formatLastSaved(lastSaved)}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
