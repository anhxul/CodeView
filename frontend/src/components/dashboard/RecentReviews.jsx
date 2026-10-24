import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCode, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, scoreColor, formatDate } from '@/lib/utils';

export default function RecentReviews({ reviews = [] }) {
  const navigate = useNavigate();

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-base">Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {reviews.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No reviews yet. Head to the editor to run your first AI code review.
          </p>
        ) : (
          reviews.map((review) => (
            <button
              key={review._id}
              onClick={() => navigate(`/history?reviewId=${review._id}`)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/30 p-3 text-left transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                  <FileCode className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium line-clamp-1">{review.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {review.language}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-sm font-bold', scoreColor(review.result?.overallScore || 0))}>
                  {review.result?.overallScore ?? '-'}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          ))
        )}
      </CardContent>
    </Card>
  );
}