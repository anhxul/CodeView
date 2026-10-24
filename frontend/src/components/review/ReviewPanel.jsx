import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Lightbulb, Download, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ScoreCard from './ScoreCard';
import BugList from './BugList';
import SecurityList from './SecurityList';
import PerformanceList from './PerformanceList';
import ReadabilityList from './ReadabilityList';
import ComplexityCard from './ComplexityCard';
import RefactoredCode from './RefactoredCode';
import InterviewQuestions from './InterviewQuestions';

export default function ReviewPanel({ review, language, explanation, explainLoading, onExportPDF, exportLoading }) {
  if (!review) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-12 text-center">
        <div className="glass mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
          <Lightbulb className="h-8 w-8 text-accent" />
        </div>
        <h3 className="text-lg font-semibold">No review yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Write or paste your code in the editor, then click <strong>Review Code</strong> to get a full
          AI-powered analysis.
        </p>
      </div>
    );
  }

  const { result } = review;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Review Results</h2>
        {onExportPDF && (
          <Button variant="outline" size="sm" onClick={onExportPDF} disabled={exportLoading}>
            {exportLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export PDF
          </Button>
        )}
      </div>

      <ScoreCard score={result.overallScore} summary={result.summary} maintainability={result.maintainability} />

      {explanation && (
  <Card className="glass">
    <CardHeader>
      <CardTitle className="text-base">Code Explanation</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="prose prose-invert prose-sm max-w-none
        prose-headings:text-foreground
        prose-headings:font-bold
        prose-h2:text-lg
        prose-h2:mt-6
        prose-h2:mb-3
        prose-p:text-muted-foreground
        prose-p:leading-relaxed
        prose-strong:text-foreground
        prose-code:text-accent
        prose-code:bg-secondary/50
        prose-code:px-1.5
        prose-code:py-0.5
        prose-code:rounded
        prose-pre:bg-secondary/50
        prose-pre:border
        prose-pre:border-border
        prose-li:text-muted-foreground
        prose-ul:list-disc
        prose-ol:list-decimal
      ">
        <ReactMarkdown>{explanation}</ReactMarkdown>
      </div>
    </CardContent>
  </Card>
)}

      {explainLoading && !explanation && (
        <Card className="glass">
          <CardContent className="flex items-center gap-2 pt-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Generating explanation...
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="complexity">Complexity</TabsTrigger>
          <TabsTrigger value="maintainability">Maintainability</TabsTrigger>
          <TabsTrigger value="refactor">Refactor</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <BugList title="Bug Analysis" issues={result.bugs} emptyMessage="No bugs detected." />
          <SecurityList issues={result.securityIssues} />
          <PerformanceList issues={result.performanceIssues} />
          <ReadabilityList issues={result.readabilityIssues} />
        </TabsContent>

        <TabsContent value="complexity">
          <ComplexityCard complexity={result.complexity} />
        </TabsContent>

        <TabsContent value="maintainability" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">Maintainability Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{result.maintainability?.analysis}</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">Best Practice Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {(result.bestPractices || []).map((bp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {bp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refactor">
          <RefactoredCode
            refactoredCode={result.refactoredCode}
            alternativeApproach={result.alternativeApproach}
            language={language}
          />
        </TabsContent>

        <TabsContent value="learn">
          <InterviewQuestions
            interviewQuestions={result.interviewQuestions}
            learningResources={result.learningResources}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}