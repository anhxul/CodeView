import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCode2, Gauge, ShieldAlert, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/common/Loader';
import StatsWidget from '@/components/dashboard/StatsWidget';
import LanguageChart from '@/components/dashboard/LanguageChart';
import ScoreTrendChart from '@/components/dashboard/ScoreTrendChart';
import RecentReviews from '@/components/dashboard/RecentReviews';
import { getReviewStats } from '@/api/review.api';
import { getReviews } from '@/api/review.api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reviewsRes] = await Promise.all([
          getReviewStats(),
          getReviews({ limit: 5 }),
        ]);
        setStats(statsRes.data.data);
        setRecentReviews(reviewsRes.data.data.reviews);
      } catch (err) {
        toast({
          title: 'Failed to load dashboard',
          description: err.response?.data?.message || 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader size="lg" label="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s an overview of your code review activity.
          </p>
        </div>
        <Button variant="gradient" onClick={() => navigate('/editor')}>
          <Plus className="mr-2 h-4 w-4" /> New Review
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsWidget icon={FileCode2} label="Total Reviews" value={stats?.totalReviews ?? 0} accent="text-primary" delay={0} />
        <StatsWidget icon={Gauge} label="Average Score" value={stats?.averageScore ?? 0} accent="text-accent" delay={0.05} />
        <StatsWidget icon={ShieldAlert} label="Security Issues Found" value={stats?.securityIssuesFound ?? 0} accent="text-destructive" delay={0.1} />
        <StatsWidget icon={Sparkles} label="Languages Used" value={stats?.languagesUsed?.length ?? 0} accent="text-success" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ScoreTrendChart data={stats?.scoreTrend} />
        <LanguageChart data={stats?.languagesUsed} />
      </div>

      <RecentReviews reviews={recentReviews} />
    </div>
  );
}   