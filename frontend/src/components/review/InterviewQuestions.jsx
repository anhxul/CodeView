import React from 'react';
import { HelpCircle, BookOpen, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InterviewQuestions({ interviewQuestions = [], learningResources = [] }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="h-5 w-5 text-accent" />
            Interview Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {interviewQuestions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No interview questions generated.</p>
          ) : (
            interviewQuestions.map((qa, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-secondary/30 p-4">
                <p className="text-sm font-semibold">
                  Q{idx + 1}. {qa.question}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{qa.answer}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-5 w-5 text-accent" />
            Learning Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {learningResources.length === 0 ? (
            <p className="text-sm text-muted-foreground">No learning resources suggested.</p>
          ) : (
            learningResources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:border-primary/40"
              >
                <div>
                  <p className="text-sm font-semibold">{resource.title}</p>
                  <Badge variant="secondary" className="mt-1 capitalize">
                    {resource.type}
                  </Badge>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              </a>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}