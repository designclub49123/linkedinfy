import { cn } from '@/lib/utils';
import { Copy, RotateCcw, MessageCircle, Check, ThumbsUp, ThumbsDown, Zap, Star, Edit3 } from 'lucide-react';
import type { Message } from '@/state/useAISidebar';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { exportDocumentToPdf } from '@/utils/exportPdf';
import { prepareHTMLForEditorInsertion } from '@/utils/contentFormatter';
import { TypingIndicator } from './TypingIndicator';
import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DOMPurify from 'dompurify';

// Helper to extract placeholders like [Your Name], [Date], [start date]
function extractPlaceholders(html: string) {
  const set = new Set<string>();
  if (!html) return [] as string[];
  const re = /\[([^\]]+)\]/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const key = m[1].trim();
    if (key) set.add(key);
  }
  return Array.from(set);
}

interface AIChatBubbleProps {
  message: Message;
  onRegenerate?: () => void;
  isGenerating?: boolean;
}

export function AIChatBubble({ message, onRegenerate, isGenerating }: AIChatBubbleProps) {
  const isUser = message.role === 'user';
  const [showPreview, setShowPreview] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [downloadFilename, setDownloadFilename] = useState('ai-preview.pdf');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showFillDetails, setShowFillDetails] = useState(false);
  const [placeholders, setPlaceholders] = useState<Record<string,string>>({});
  const [filledContent, setFilledContent] = useState<string | null>(null);
  const { user } = useAuth();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReaction = (type: string) => {
    setReaction(reaction === type ? null : type);
  };

  const suggestedFollowUps = [
    `Explain this in simpler terms`,
    `Make it more concise`,
    `Add more detail`,
    `Change the tone`,
  ];

  return (
    <div className={cn('w-full animate-fade-in group flex flex-col')}> 
      {/* Message Bubble */}
      <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
        <div
          className={cn(
            'max-w-[85%] rounded-[8px] px-3.5 py-2 text-sm transition-all duration-200 hover:shadow-md',
            isUser 
              ? 'rounded-br-[2px] bg-primary text-primary-foreground' 
              : 'rounded-bl-[2px] bg-card border border-border text-foreground'
          )}
        >
          {isGenerating && !message.content ? (
            <TypingIndicator className="text-muted-foreground" />
          ) : (
            <>
              <p className={cn(
                "whitespace-pre-wrap leading-normal break-words",
                message.isError ? "text-red-500 font-medium" : ""
              )}>{message.content}</p>
              
              {!isUser && message.applyContent && (
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs gap-1"
                    onClick={() => {
                      const tokens = extractPlaceholders(message.applyContent || '');
                      const initial: Record<string,string> = {};
                      tokens.forEach(t => {
                        // Prefill common fields from user profile when available
                        if (/your name/i.test(t) && user?.user_metadata?.full_name) initial[t] = user.user_metadata.full_name;
                        else if (/email|contact/i.test(t) && user?.email) initial[t] = user.email;
                        else if (/date/i.test(t)) initial[t] = new Date().toLocaleDateString();
                        else initial[t] = '';
                      });
                      setPlaceholders(initial);
                      setFilledContent(null);
                      setShowPreview(true);
                    }}
                  >
                    <Check className="h-3 w-3" />
                    Apply
                  </Button>

                  {/* Preview Dialog */}
                  <Dialog open={showPreview} onOpenChange={setShowPreview}>
                    <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                      <DialogHeader>
                        <DialogTitle>Preview before applying</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        Review the content below. Click "Apply" to insert into the document.
                      </DialogDescription>

                      <div className="flex-1 overflow-auto">
                        <div className="max-h-40 overflow-auto rounded border border-border p-3 bg-background text-sm">
                          <div 
                            className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-li:my-1 prose-table:my-2 prose-td:px-2 prose-td:py-1"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(filledContent ?? message.applyContent ?? '') }}
                          />
                        </div>

                        {/* Fill details section - show detected placeholders */}
                        {showFillDetails && (
                          <div className="mt-3 p-3 border rounded bg-muted max-h-60 overflow-auto">
                            <div className="mb-2 font-semibold text-sm sticky top-0 bg-muted pb-2 border-b">Fill details to replace placeholders</div>
                            <div className="space-y-3">
                              {Object.keys(placeholders).map((ph) => (
                                <div key={ph} className="flex items-center gap-3">
                                  <label className="w-40 text-sm text-right font-medium text-muted-foreground flex-shrink-0 truncate" title={ph}>{ph}:</label>
                                  <input
                                    className="flex-1 min-w-0 px-3 py-2 text-sm bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    value={placeholders[ph] || ''}
                                    onChange={(e) => setPlaceholders(prev => ({ ...prev, [ph]: e.target.value }))}
                                    placeholder={`Enter ${ph}`}
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-3 sticky bottom-0 bg-muted pt-2 border-t">
                              <Button size="sm" onClick={() => {
                                // Replace placeholders in the applyContent and set filledContent
                                let content = message.applyContent || '';
                                Object.keys(placeholders).forEach((ph) => {
                                  const val = placeholders[ph] || '';
                                  const re = new RegExp(`\\[\\s*${ph.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*\\]`, 'gi');
                                  content = content.replace(re, val);
                                });
                                setFilledContent(content);
                                setShowFillDetails(false);
                              }}>Apply Details</Button>
                              <Button size="sm" variant="ghost" onClick={() => setShowFillDetails(false)}>Cancel</Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <DialogFooter className="mt-4">
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              className="input-base flex-1"
                              value={downloadFilename}
                              onChange={e => setDownloadFilename(e.target.value)}
                              placeholder="Enter filename (e.g. LetterToHOD.pdf)"
                              disabled={isDownloading}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isDownloading}
                              onClick={async () => {
                                setIsDownloading(true);
                                try {
                                  const source = filledContent ?? message.applyContent ?? '';
                                  const prepared = prepareHTMLForEditorInsertion(source);
                                  const wrapper = document.createElement('div');
                                  wrapper.style.width = '210mm';
                                  wrapper.style.minHeight = '297mm';
                                  wrapper.style.boxSizing = 'border-box';
                                  wrapper.style.padding = '20mm';
                                  wrapper.style.background = '#ffffff';
                                  wrapper.innerHTML = DOMPurify.sanitize(`<div class="prose prose-sm max-w-none">${prepared}</div>`);
                                  document.body.appendChild(wrapper);
                                  await exportDocumentToPdf(wrapper, downloadFilename || `ai-preview-${Date.now()}.pdf`);
                                  document.body.removeChild(wrapper);
                                } catch (err: any) {
                                  console.error('Download preview PDF failed', err);
                                  const msg = err?.message || String(err);
                                  toast({ title: 'Download failed', description: msg });
                                }
                                setIsDownloading(false);
                              }}
                            >
                              {isDownloading ? (
                                <span className="animate-spin mr-2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full inline-block" />
                              ) : null}
                              Download
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowPreview(false)}
                              disabled={isDownloading}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              disabled={isDownloading}
                                  onClick={() => {
                                    const contentToApply = filledContent ?? message.applyContent;
                                    const event = new CustomEvent('applyToDocument', { detail: { content: contentToApply } });
                                    window.dispatchEvent(event);
                                    setShowPreview(false);
                                  }}
                            >
                              <Check className="h-3.5 w-3.5 mr-2" />
                              Apply
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setShowCustomize(true)}
                              disabled={isDownloading}
                            >
                              Customize
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowFillDetails(true)}
                              disabled={isDownloading || Object.keys(placeholders).length === 0}
                            >
                              Fill Details
                            </Button>
                          </div>
                        </div>
                      </DialogFooter>
                      {showCustomize && (
                        <div className="mt-4 p-3 border rounded bg-muted">
                          <div className="mb-2 font-semibold text-sm">Customize your request or style:</div>
                          <textarea
                            className="input-base w-full min-h-[60px]"
                            placeholder="Type your own instructions or style here..."
                            onBlur={e => {/* handle custom input, e.g. send to AI or update preview */}}
                          />
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" onClick={() => setShowCustomize(false)}>Close</Button>
                            {/* Optionally add a submit button to send custom instructions to AI */}
                          </div>
                        </div>
                      )}
                      <DialogClose />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Action Bar - Shows on hover for AI messages only */}
      {!isUser && (
        <div className="flex items-center gap-0.5 mt-1 ml-0 opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs">
          {/* Copy Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={handleCopy}
            title="Copy"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>

          {/* Bookmark */}
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-5 w-5', isBookmarked && 'text-yellow-500')}
            onClick={() => setIsBookmarked(!isBookmarked)}
            title="Bookmark"
          >
            <Star className="h-3 w-3" fill={isBookmarked ? 'currentColor' : 'none'} />
          </Button>

          {/* Reactions */}
          <div className="flex items-center gap-0.5 border-l border-border pl-0.5 ml-0.5">
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-5 w-5', reaction === 'helpful' && 'bg-primary/10')}
              onClick={() => handleReaction('helpful')}
              title="Helpful"
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-5 w-5', reaction === 'unhelpful' && 'bg-destructive/10')}
              onClick={() => handleReaction('unhelpful')}
              title="Not helpful"
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>

          {/* Regenerate Button */}
          {onRegenerate && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={onRegenerate}
              title="Regenerate"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}

          {/* Follow-up Suggestions */}
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => setShowSuggestions(!showSuggestions)}
            title="Suggestions"
          >
            <Zap className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Follow-up Suggestions Dropdown */}
      {!isUser && showSuggestions && (
        <div className="mt-1.5 ml-0 space-y-1 animate-slide-in-left">
          {suggestedFollowUps.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => {
                const event = new CustomEvent('suggestedFollowUp', { detail: { text: suggestion } });
                window.dispatchEvent(event);
                setShowSuggestions(false);
              }}
              className="block w-full px-2 py-1 text-xs text-left rounded bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
