import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Trash2, FileCode, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Modal from '@/components/common/Modal';
import { Loader } from '@/components/common/Loader';
import ReviewPanel from '@/components/review/ReviewPanel';
import { LANGUAGES } from '@/components/editor/LanguageSelector';
import { getHistory } from '@/api/history.api';
import { getReviewById, deleteReview } from '@/api/review.api';
import { generateReport, getDownloadUrl } from '@/api/report.api';
import { cn, scoreColor, formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (languageFilter !== 'all') params.language = languageFilter;
      const res = await getHistory(params);
      setItems(res.data.data.items);
    } catch (err) {
      toast({
        title: 'Failed to load history',
        description: err.response?.data?.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [search, languageFilter, toast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Open review from query param (e.g. linked from dashboard)
  useEffect(() => {
    const reviewId = searchParams.get('reviewId');
    if (reviewId) {
      handleOpenReview(reviewId);
      searchParams.delete('reviewId');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenReview = async (id) => {
    setReviewLoading(true);
    setSelectedReview({ _id: id, loading: true });
    try {
      const res = await getReviewById(id);
      setSelectedReview(res.data.data.review);
    } catch (err) {
      toast({
        title: 'Failed to load review',
        description: err.response?.data?.message || 'Please try again later',
        variant: 'destructive',
      });
      setSelectedReview(null);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteReview(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast({ title: 'Review deleted' });
    } catch (err) {
      toast({
        title: 'Delete failed',
        description: err.response?.data?.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportPDF = async () => {
    if (!selectedReview?._id) return;
    setExportLoading(true);
    try {
      const res = await generateReport(selectedReview._id);
      const reportId = res.data.data.report._id;
      window.open(getDownloadUrl(reportId), '_blank');
    } catch (err) {
      toast({
        title: 'Export failed',
        description: err.response?.data?.message || 'Could not generate PDF report.',
        variant: 'destructive',
      });
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold">Review History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse and revisit your past AI code reviews.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={languageFilter} onValueChange={setLanguageFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" label="Loading history..." />
        </div>
      ) : items.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-xl py-16 text-center">
          <FileCode className="mb-4 h-10 w-10 text-muted-foreground" />
          <h3 className="font-semibold">No reviews found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters, or run a new review from the editor.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item._id}
              className="glass flex items-center justify-between rounded-xl p-4 transition-colors hover:border-primary/40"
            >
              <button
                className="flex flex-1 items-center gap-3 text-left overflow-hidden"
                onClick={() => handleOpenReview(item._id)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                  <FileCode className="h-5 w-5 text-primary" />
                </div>
                <div className="overflow-hidden">
                  <p className="truncate font-medium">{item.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {item.language}
                    </Badge>
                    <Badge variant={item.status === 'completed' ? 'success' : item.status === 'failed' ? 'destructive' : 'warning'} className="capitalize">
                      {item.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </button>
              <div className="flex shrink-0 items-center gap-3">
                {item.status === 'completed' && (
                  <span className={cn('text-lg font-bold', scoreColor(item.result?.overallScore || 0))}>
                    {item.result?.overallScore ?? '-'}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                >
                  {deletingId === item._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!selectedReview}
        onOpenChange={(open) => !open && setSelectedReview(null)}
        title={selectedReview?.title || 'Review Details'}
        className="max-w-4xl max-h-[85vh] overflow-y-auto"
      >
        {reviewLoading || selectedReview?.loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" label="Loading review..." />
          </div>
        ) : selectedReview?.status === 'failed' ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            This review failed: {selectedReview.error || 'Unknown error'}
          </div>
        ) : (
          <ReviewPanel
            review={selectedReview}
            language={selectedReview?.language}
            onExportPDF={handleExportPDF}
            exportLoading={exportLoading}
          />
        )}
      </Modal>
    </div>
  );
}