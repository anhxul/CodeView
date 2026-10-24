import React from 'react';
import { Copy, Maximize2, Minimize2, Sun, Moon, Sparkles, MessageSquareText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSelector from './LanguageSelector';
import { useToast } from '@/hooks/use-toast';

export default function EditorToolbar({
  language,
  onLanguageChange,
  editorTheme,
  onToggleTheme,
  isFullscreen,
  onToggleFullscreen,
  code,
  onReview,
  onExplain,
  reviewLoading,
  explainLoading,
}) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: 'Copied!', description: 'Code copied to clipboard.' });
    } catch (err) {
      toast({ title: 'Copy failed', description: 'Could not access clipboard.', variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/40 px-4 py-3">
      <div className="flex items-center gap-2">
        <LanguageSelector value={language} onChange={onLanguageChange} />
        <Button variant="ghost" size="icon" onClick={onToggleTheme} title="Toggle editor theme">
          {editorTheme === 'vs-dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy code">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleFullscreen} title="Toggle fullscreen">
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExplain} disabled={explainLoading || !code.trim()}>
          {explainLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MessageSquareText className="mr-2 h-4 w-4" />
          )}
          Explain Code
        </Button>
        <Button variant="gradient" size="sm" onClick={onReview} disabled={reviewLoading || !code.trim()}>
          {reviewLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Review Code
        </Button>
      </div>
    </div>
  );
}