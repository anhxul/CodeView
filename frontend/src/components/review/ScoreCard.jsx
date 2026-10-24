import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn, scoreColor } from '@/lib/utils';

export default function ScoreCard({ score, summary, maintainability }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="glass">
      <CardContent className="flex flex-col items-center gap-6 pt-6 sm:flex-row">
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
          <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={scoreColor(score)}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={cn('text-3xl font-extrabold', scoreColor(score))}>{score}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Overall Code Quality</h3>
          <p className="mt-1 text-sm text-muted-foreground">{summary}</p>
          {maintainability && (
            <div className="mt-3 flex items-center justify-center gap-2 sm:justify-start">
              <span className="text-xs font-medium text-muted-foreground">Maintainability:</span>
              <span className={cn('text-sm font-bold', scoreColor(maintainability.score))}>
                {maintainability.score}/100
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}