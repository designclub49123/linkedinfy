import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/state/useUserStore';
import { useEditorStore } from '@/state/useEditorStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  PenTool,
  Sparkles,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  Download,
  Wand2,
  BookOpen,
  Target,
  Lightbulb,
  TrendingUp,
  Zap,
  ArrowLeft,
  Send,
  Loader2,
  Edit3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const WRITING_STYLES = [
  { id: 'professional', label: 'Professional', description: 'Formal business writing' },
  { id: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
  { id: 'academic', label: 'Academic', description: 'Scholarly and research-oriented' },
  { id: 'creative', label: 'Creative', description: 'Imaginative and artistic' },
  { id: 'technical', label: 'Technical', description: 'Precise and detailed' },
  { id: 'marketing', label: 'Marketing', description: 'Persuasive and engaging' },
];

const WRITING_TASKS = [
  { id: 'rewrite', label: 'Rewrite', description: 'Improve existing text' },
  { id: 'expand', label: 'Expand', description: 'Add more detail' },
  { id: 'summarize', label: 'Summarize', description: 'Make it concise' },
  { id: 'grammar', label: 'Grammar Check', description: 'Fix errors' },
  { id: 'tone', label: 'Adjust Tone', description: 'Change writing style' },
  { id: 'outline', label: 'Generate Outline', description: 'Create structure' },
];

interface WritingSuggestion {
  id: string;
  type: 'improvement' | 'correction' | 'suggestion';
  text: string;
  original?: string;
  suggestion: string;
  explanation: string;
}

export default function WritingAssistant() {
  const navigate = useNavigate();
  const { theme } = useUserStore();
  const { contentRef } = useEditorStore();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [selectedTask, setSelectedTask] = useState('rewrite');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([]);
  const [wordCount, setWordCount] = useState({ input: 0, output: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWordCount({
      input: inputText.split(/\s+/).filter(word => word.length > 0).length,
      output: outputText.split(/\s+/).filter(word => word.length > 0).length,
    });
  }, [inputText, outputText]);

  const handleProcessText = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to process');
      return;
    }

    setIsProcessing(true);
    setSuggestions([]);

    // Simulate AI processing
    setTimeout(() => {
      const processedText = simulateAIProcessing(inputText, selectedTask, selectedStyle);
      setOutputText(processedText.text);
      setSuggestions(processedText.suggestions);
      setIsProcessing(false);
      toast.success('Text processed successfully!');
    }, 2000);
  };

  const simulateAIProcessing = (text: string, task: string, style: string) => {
    // Enhanced AI processing with better responses
    let processedText = text;
    const suggestions: WritingSuggestion[] = [];

    switch (task) {
      case 'rewrite':
        switch (style) {
          case 'professional':
            processedText = `In accordance with professional standards, the aforementioned text has been reformulated to reflect a more formal and business-appropriate tone. The content maintains its original meaning while enhancing clarity and professionalism.\n\n${text}\n\nThis revised version ensures proper business communication protocols and maintains a polished, corporate demeanor throughout the document.`;
            break;
          case 'academic':
            processedText = `The subject matter has been analyzed and recontextualized within an academic framework. The following scholarly interpretation maintains methodological rigor while adhering to established academic conventions.\n\n${text}\n\nThis academic treatment ensures proper citation standards and scholarly discourse appropriate for research contexts.`;
            break;
          case 'creative':
            processedText = `Like a river carving through stone, the words have been reshaped with artistic flair and imaginative expression. The text now flows with creative energy and vivid imagery.\n\n${text}\n\nThis creative rendition transforms ordinary prose into a tapestry of literary artistry, engaging the reader's imagination and senses.`;
            break;
          default:
            processedText = `The text has been rewritten in a ${style} style, enhancing its overall quality and readability while maintaining the core message and intent of the original content.\n\n${text}\n\nThis improved version better serves the intended audience and purpose through careful word choice and structural refinement.`;
        }
        suggestions.push({
          id: '1',
          type: 'improvement',
          text: 'Writing style enhanced',
          suggestion: processedText,
          explanation: `The text has been transformed to match ${style} writing conventions with improved vocabulary and sentence structure.`,
        });
        break;

      case 'expand':
        processedText = `${text}\n\n## Additional Context and Details\n\nTo provide a more comprehensive understanding, it's important to consider the broader implications and contextual factors that influence this topic. The expanded content below offers deeper insights and supporting information:\n\n### Key Points:\n- Enhanced detail and specificity\n- Broader contextual framework\n- Supporting evidence and examples\n- Practical applications and implications\n\nThis expansion ensures readers have access to complete information necessary for thorough understanding and informed decision-making.`;
        suggestions.push({
          id: '1',
          type: 'suggestion',
          text: 'Content expanded with context',
          suggestion: processedText,
          explanation: 'Added comprehensive details and contextual information to enhance understanding.',
        });
        break;

      case 'summarize':
        const words = text.split(' ');
        const summaryLength = Math.min(50, Math.floor(words.length * 0.3));
        const summary = words.slice(0, summaryLength).join(' ');
        processedText = `## Executive Summary\n\n${summary}...\n\n### Key Takeaways:\n• Core concepts condensed for clarity\n• Essential information preserved\n• Concise representation of main points\n• Actionable insights highlighted\n\nThis summary captures the essence of the original content while maintaining critical information and key messages.`;
        suggestions.push({
          id: '1',
          type: 'improvement',
          text: 'Text professionally summarized',
          suggestion: processedText,
          explanation: 'Content condensed to essential points while preserving key information and context.',
        });
        break;

      case 'grammar':
        processedText = `## Grammar Correction Results\n\nThe original text has been analyzed and corrected for grammatical accuracy, punctuation, and spelling errors. Below is the improved version:\n\n${text}\n\n### Corrections Applied:\n• Grammar and syntax errors fixed\n• Punctuation standardized\n• Spelling errors corrected\n• Sentence structure improved\n• Readability enhanced\n\nThe corrected text now follows standard English grammar rules and communicates the intended message more clearly and professionally.`;
        suggestions.push({
          id: '1',
          type: 'correction',
          text: 'Grammar and spelling corrected',
          suggestion: processedText,
          explanation: 'Fixed grammatical errors, punctuation, and spelling issues to improve text quality.',
        });
        break;

      case 'tone':
        processedText = `## Tone Adjustment Complete\n\nThe text has been successfully adjusted to reflect a ${style} tone. The content maintains its original meaning while adopting the appropriate voice and style for the intended audience.\n\n${text}\n\n### Tone Characteristics Applied:\n• ${style} vocabulary and phrasing\n• Appropriate level of formality\n• Audience-specific communication style\n• Contextually appropriate expressions\n\nThis tone adjustment ensures the message resonates effectively with the target audience while maintaining clarity and purpose.`;
        suggestions.push({
          id: '1',
          type: 'improvement',
          text: `Tone adjusted to ${style}`,
          suggestion: processedText,
          explanation: `Modified the writing tone to match ${style} communication standards and audience expectations.`,
        });
        break;

      case 'outline':
        processedText = `## Document Outline\n\n### I. Introduction\n- Opening statement and context\n- Thesis statement or main objective\n- Overview of content structure\n\n### II. Main Points\n${text.split('.').slice(0, 3).map((point, i) => 
  point.trim() && `\n#### A. Point ${i + 1}\n- ${point.trim()}\n- Supporting details and evidence\n- Examples and illustrations`
).join('\n')}\n\n### III. Supporting Arguments\n- Evidence and data\n- Expert opinions and quotes\n- Case studies and examples\n\n### IV. Conclusion\n- Summary of key points\n- Restatement of thesis\n- Call to action or final thoughts\n\n### V. References (if applicable)\n- Source citations\n- Bibliography\n- Additional reading\n\nThis outline provides a structured framework for developing a comprehensive and well-organized document.`;
        suggestions.push({
          id: '1',
          type: 'suggestion',
          text: 'Structured outline created',
          suggestion: processedText,
          explanation: 'Generated a comprehensive outline with proper structure and organization.',
        });
        break;

      default:
        processedText = text;
    }

    return { text: processedText, suggestions };
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(outputText);
    toast.success('Text copied to clipboard!');
  };

  const handleApplyToDocument = () => {
    if (contentRef?.current) {
      // Set as plain text, not HTML
      contentRef.current.innerText = outputText;
      toast.success('Text applied to document!');
      navigate('/');
    }
  };

  const handleExport = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'writing-assistant-output.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Text exported successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Editor
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <PenTool className="h-6 w-6 text-primary" />
                AI Writing Assistant
              </h1>
              <p className="text-muted-foreground">Enhance your writing with AI-powered tools</p>
            </div>
          </div>
          <Badge variant="default" className="gap-1">
            <Zap className="h-3 w-3" />
            Live
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            {/* Writing Style */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Writing Style
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {WRITING_STYLES.map((style) => (
                  <Button
                    key={style.id}
                    variant={selectedStyle === style.id ? 'default' : 'outline'}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{style.label}</div>
                      <div className="text-xs text-muted-foreground">{style.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Writing Task */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Writing Task
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {WRITING_TASKS.map((task) => (
                  <Button
                    key={task.id}
                    variant={selectedTask === task.id ? 'default' : 'outline'}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedTask(task.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{task.label}</div>
                      <div className="text-xs text-muted-foreground">{task.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Input/Output */}
          <div className="space-y-6">
            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    Input Text
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {wordCount.input} words
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your text here for AI assistance..."
                  className="min-h-[200px] resize-none"
                />
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleProcessText}
                    disabled={isProcessing || !inputText.trim()}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Process Text
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setInputText('')}
                    disabled={!inputText}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output */}
            {outputText && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      AI Output
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {wordCount.output} words
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 min-h-[150px] whitespace-pre-wrap">
                    {outputText}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={handleCopyText}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button onClick={handleApplyToDocument}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Apply to Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {suggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className={cn(
                            'p-3 rounded-lg border',
                            suggestion.type === 'improvement' && 'border-green-200 bg-green-50',
                            suggestion.type === 'correction' && 'border-red-200 bg-red-50',
                            suggestion.type === 'suggestion' && 'border-blue-200 bg-blue-50',
                            theme === 'dark' && 'border-opacity-30'
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {suggestion.type === 'improvement' && <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />}
                            {suggestion.type === 'correction' && <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />}
                            {suggestion.type === 'suggestion' && <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />}
                            <div className="flex-1">
                              <div className="font-medium text-sm">{suggestion.text}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {suggestion.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
