import React from 'react';
import { Eye } from 'lucide-react';
import IssueList from './BugList';

export default function ReadabilityList({ issues }) {
  return (
    <IssueList
      title="Readability Issues"
      icon={Eye}
      issues={issues}
      emptyMessage="Code is clear and readable."
    />
  );
}