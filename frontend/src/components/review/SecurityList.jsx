import React from 'react';
import { ShieldAlert } from 'lucide-react';
import IssueList from './BugList';

export default function SecurityList({ issues }) {
  return (
    <IssueList
      title="Security Issues"
      icon={ShieldAlert}
      issues={issues}
      emptyMessage="No security vulnerabilities detected."
    />
  );
}