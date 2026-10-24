import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import EditorToolbar from './EditorToolbar';
import { LANGUAGES } from './LanguageSelector';
import { cn } from '@/lib/utils';

const DEFAULT_SNIPPETS = {
  javascript: `function greet(name) {\n  console.log("Hello, " + name);\n}\n\ngreet("World");`,
  typescript: `function greet(name: string): void {\n  console.log("Hello, " + name);\n}\n\ngreet("World");`,
  python: `def greet(name):\n    print(f"Hello, {name}")\n\ngreet("World")`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World");\n    }\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World\\n");\n    return 0;\n}`,
  cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World" << std::endl;\n    return 0;\n}`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World")\n}`,
  rust: `fn main() {\n    println!("Hello, World");\n}`,
  php: `<?php\n\necho "Hello, World";\n`,
  kotlin: `fun main() {\n    println("Hello, World")\n}`,
  swift: `import Foundation\n\nprint("Hello, World")`,
};

export default function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
  onReview,
  onExplain,
  reviewLoading,
  explainLoading,
}) {
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const monacoLanguage = LANGUAGES.find((l) => l.value === language)?.monaco || 'plaintext';

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    // If editor is empty or still has a default snippet, swap to the new language's snippet
    const isDefaultSnippet = Object.values(DEFAULT_SNIPPETS).includes(code) || !code.trim();
    if (isDefaultSnippet) {
      setCode(DEFAULT_SNIPPETS[newLang] || '');
    }
  };

  const toggleEditorTheme = () => {
    setEditorTheme((prev) => (prev === 'vs-dark' ? 'light' : 'vs-dark'));
  };

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-border bg-card/40',
        isFullscreen && 'fixed inset-0 z-[60] rounded-none'
      )}
    >
      <EditorToolbar
        language={language}
        onLanguageChange={handleLanguageChange}
        editorTheme={editorTheme}
        onToggleTheme={toggleEditorTheme}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
        code={code}
        onReview={onReview}
        onExplain={onExplain}
        reviewLoading={reviewLoading}
        explainLoading={explainLoading}
      />
      <div className={cn('flex-1', isFullscreen ? 'h-[calc(100vh-57px)]' : 'h-[500px] min-h-[500px]')}>
  <Editor
    height="100%"
          language={monacoLanguage}
          theme={editorTheme}
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            fontFamily: "'JetBrains Mono', monospace",
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}

export { DEFAULT_SNIPPETS };