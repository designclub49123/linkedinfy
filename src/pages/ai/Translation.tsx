import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/state/useUserStore';
import { useEditorStore } from '@/state/useEditorStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Languages, ArrowLeftRight, Loader2, Copy, CheckCircle, Globe2, Zap } from 'lucide-react';
import { toast } from 'sonner';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
];

export default function TranslationPage() {
  const navigate = useNavigate();
  const { contentRef } = useEditorStore();
  const { theme } = useUserStore();
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('hi');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleSwap = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    if (translatedText) {
      setSourceText(translatedText);
      setTranslatedText('');
    }
  };

  const handleTranslate = () => {
    if (!sourceText.trim()) {
      toast.error('Please enter some text to translate');
      return;
    }
    setIsTranslating(true);
    setTranslatedText('');

    // Simulated translation
    setTimeout(() => {
      const prefix = `[${fromLang.toUpperCase()} → ${toLang.toUpperCase()}]`;
      const fake = `${prefix} ${sourceText}`;
      setTranslatedText(fake);
      setIsTranslating(false);
      toast.success('Translation complete (demo)');
    }, 1200);
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    toast.success('Translated text copied');
  };

  const handleApplyToDoc = () => {
    if (!translatedText) return;
    if (contentRef?.current) {
      contentRef.current.innerText = translatedText;
      toast.success('Translated text applied to document');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
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
                <Languages className="h-6 w-6 text-primary" />
                AI Translation
              </h1>
              <p className="text-muted-foreground text-sm">Translate your content between multiple languages (demo)</p>
            </div>
          </div>
          <Badge variant="default" className="gap-1">
            <Globe2 className="h-3 w-3" />
            Live
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  Source Text
                </span>
                <div className="flex items-center gap-2">
                  <Select value={fromLang} onValueChange={setFromLang}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleSwap}
                    title="Swap languages"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                  <Select value={toLang} onValueChange={setToLang}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Type or paste the text you want to translate..."
                className="min-h-[220px] resize-none"
              />
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleTranslate}
                  disabled={isTranslating || !sourceText.trim()}
                  className="gap-2"
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Translate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Translated Text</span>
                <Badge variant="outline" className="text-xs">
                  {fromLang.toUpperCase()} → {toLang.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[220px] rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
                {translatedText || <span className="text-muted-foreground">Translation will appear here...</span>}
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!translatedText}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  onClick={handleApplyToDoc}
                  disabled={!translatedText}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Apply to Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
