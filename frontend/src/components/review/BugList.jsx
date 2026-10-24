import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { severityColor } from '@/lib/utils';

export default function IssueList({ title, icon: Icon, issues = [], emptyMessage }) {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {Icon && <Icon className="h-5 w-5 text-accent" />}
          {title}
          <Badge variant="secondary" className="ml-auto">
            {issues.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {issues.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {emptyMessage || 'No issues found. Great job!'}
          </div>
        ) : (
          issues.map((issue, idx) => (
            <div key={idx} className={`rounded-lg border p-4 ${severityColor(issue.severity)}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <h4 className="font-semibold">{issue.title}</h4>
                </div>
                <Badge variant="outline" className="shrink-0 capitalize">
                  {issue.severity}
                </Badge>
              </div>
              <p className="mt-2 text-sm opacity-90">{issue.description}</p>
              {issue.line !== null && issue.line !== undefined && (
                <p className="mt-1 text-xs opacity-70">Line {issue.line}</p>
              )}
              {issue.suggestion && (
                <div className="mt-2 rounded-md bg-background/30 p-2 text-xs">
                  <span className="font-semibold">Suggestion: </span>
                  {issue.suggestion}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}