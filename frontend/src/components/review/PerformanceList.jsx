import React from 'react';
import { Gauge } from 'lucide-react';
import IssueList from './BugList';

export default function PerformanceList({ issues }) {
  return (
    <IssueList
      title="Performance Issues"
      icon={Gauge}
      issues={issues}
      emptyMessage="No performance issues detected."
    />
  );
}