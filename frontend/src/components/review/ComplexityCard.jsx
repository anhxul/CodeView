import React from 'react';
import { Clock, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ComplexityCard({ complexity }) {
  if (!complexity) return null;

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-base">Complexity Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time Complexity</p>
              <p className="text-xl font-bold font-mono">{complexity.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15">
              <Database className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Space Complexity</p>
              <p className="text-xl font-bold font-mono">{complexity.space}</p>
            </div>
          </div>
        </div>
        {complexity.explanation && (
          <p className="mt-4 text-sm text-muted-foreground">{complexity.explanation}</p>
        )}
      </CardContent>
    </Card>
  );
}