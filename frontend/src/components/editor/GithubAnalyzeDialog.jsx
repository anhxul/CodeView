import React, { useState } from 'react';
import { Github, Loader2, FileCode } from 'lucide-react';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { listRepoFiles, analyzeRepoFile } from '@/api/github.api';
import { useToast } from '@/hooks/use-toast';

export default function GithubAnalyzeDialog({ open, onOpenChange, onAnalyzed }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [files, setFiles] = useState([]);
  const [repoInfo, setRepoInfo] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [analyzingPath, setAnalyzingPath] = useState(null);
  const { toast } = useToast();

  const handleFetchFiles = async (e) => {
    e.preventDefault();
    setLoadingFiles(true);
    setFiles([]);
    try {
      const res = await listRepoFiles(repoUrl);
      setFiles(res.data.data.files);
      setRepoInfo({ owner: res.data.data.owner, repo: res.data.data.repo });
    } catch (err) {
      toast({
        title: 'Failed to fetch repository',
        description: err.response?.data?.message || 'Check the URL and try again',
        variant: 'destructive',
      });
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleAnalyzeFile = async (file) => {
    setAnalyzingPath(file.path);
    try {
      const res = await analyzeRepoFile({
        repoUrl,
        filePath: file.path,
        sha: file.sha,
        language: file.language,
      });
      toast({ title: 'Analysis complete', description: `${file.path} reviewed successfully.` });
      onAnalyzed(res.data.data.review);
      onOpenChange(false);
      setFiles([]);
      setRepoUrl('');
      setRepoInfo(null);
    } catch (err) {
      toast({
        title: 'Analysis failed',
        description: err.response?.data?.message || 'Could not analyze this file',
        variant: 'destructive',
      });
    } finally {
      setAnalyzingPath(null);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Analyze GitHub Repository"
      description="Paste a public repository URL to list and review its source files."
      className="max-w-2xl"
    >
      <form onSubmit={handleFetchFiles} className="flex gap-2">
        <div className="flex-1 space-y-2">
          <Label htmlFor="repoUrl" className="sr-only">
            Repository URL
          </Label>
          <Input
            id="repoUrl"
            placeholder="https://github.com/owner/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            required
          />
        </div>
        <Button type="submit" variant="gradient" disabled={loadingFiles}>
          {loadingFiles ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
          <span className="ml-2">Fetch</span>
        </Button>
      </form>

      {repoInfo && (
        <p className="text-sm text-muted-foreground">
          Found {files.length} analyzable files in{' '}
          <span className="font-medium text-foreground">
            {repoInfo.owner}/{repoInfo.repo}
          </span>
        </p>
      )}

      <div className="max-h-80 space-y-2 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.path}
            className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <FileCode className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate text-sm">{file.path}</span>
              <Badge variant="secondary" className="shrink-0 capitalize">
                {file.language}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAnalyzeFile(file)}
              disabled={analyzingPath !== null}
            >
              {analyzingPath === file.path ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                'Analyze'
              )}
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
}