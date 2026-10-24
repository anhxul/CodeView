import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LANGUAGES } from '@/components/editor/LanguageSelector';
import { useToast } from '@/hooks/use-toast';

function CodeBlock({ code, language, height = '300px' }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const monacoLanguage = LANGUAGES.find((l) => l.value === language)?.monaco || 'plaintext';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ title: 'Copied!', description: 'Code copied to clipboard.' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground capitalize">{language}</span>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <Editor
        height={height}
        language={monacoLanguage}
        theme="vs-dark"
        value={code}
        options={{
          readOnly: true,
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      />
    </div>
  );
}

export default function RefactoredCode({ refactoredCode, alternativeApproach, language }) {
  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Refactored Version</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={refactoredCode || '// No refactored code available'} language={language} />
        </CardContent>
      </Card>

      {alternativeApproach?.code && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">
              Alternative Approach: {alternativeApproach.title}
            </CardTitle>
            {alternativeApproach.description && (
              <p className="text-sm text-muted-foreground">{alternativeApproach.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <CodeBlock code={alternativeApproach.code} language={language} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}