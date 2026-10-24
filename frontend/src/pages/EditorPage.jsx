import React, { useState } from 'react';
import { Github, MessageSquare, X } from 'lucide-react';
import CodeEditor, { DEFAULT_SNIPPETS } from '@/components/editor/CodeEditor';
import ReviewPanel from '@/components/review/ReviewPanel';
import ChatPanel from '@/components/chat/ChatPanel';
import GithubAnalyzeDialog from '@/components/editor/GithubAnalyzeDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { createReview, explainCode as explainCodeApi } from '@/api/review.api';
import { sendMessage as sendChatMessage } from '@/api/chat.api';
import { generateReport, getDownloadUrl } from '@/api/report.api';
import { useToast } from '@/hooks/use-toast';

export default function EditorPage() {
  const [code, setCode] = useState(DEFAULT_SNIPPETS.javascript);
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [githubOpen, setGithubOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const { toast } = useToast();

  const handleReview = async () => {
    setReviewLoading(true);
    setExplanation('');
    try {
      const res = await createReview({ code, language });
      setReview(res.data.data.review);
      toast({ title: 'Review complete', description: 'AI analysis finished successfully.' });
    } catch (err) {
      toast({
        title: 'Review failed',
        description: err.response?.data?.message || 'Something went wrong while reviewing your code.',
        variant: 'destructive',
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const handleExplain = async () => {
  setExplainLoading(true);
  try {
    const res = await explainCodeApi({ code, language });
    setExplanation(res.data.data.explanation);
  } catch (err) {
    toast({
      title: 'Explanation failed',
      description: err.response?.data?.message || 'Could not generate explanation.',
      variant: 'destructive',
    });
  } finally {
    setExplainLoading(false);
  }
};

  const handleExportPDF = async () => {
    if (!review?._id) return;
    setExportLoading(true);
    try {
      const res = await generateReport(review._id);
      const reportId = res.data.data.report._id;
      const url = getDownloadUrl(reportId);
      window.open(url, '_blank');
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

  const handleGithubAnalyzed = (analyzedReview) => {
    setReview(analyzedReview);
    setCode(analyzedReview.code);
    setLanguage(analyzedReview.language);
    setExplanation('');
  };

  const handleSendChat = async (message) => {
    setChatMessages((prev) => [...prev, { role: 'user', content: message }]);
    setChatLoading(true);
    try {
      const res = await sendChatMessage({
        message,
        chatId: chatId || undefined,
        reviewId: review?._id || undefined,
      });
      setChatId(res.data.data.chatId);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: res.data.data.reply }]);
    } catch (err) {
      toast({
        title: 'Chat error',
        description: err.response?.data?.message || 'Could not get a response from AI.',
        variant: 'destructive',
      });
      setChatMessages((prev) => prev.slice(0, -1));
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:px-6">
        <div>
          <h1 className="text-lg font-bold">Code Editor</h1>
          <p className="text-sm text-muted-foreground">Write or paste code, then run an AI review.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setGithubOpen(true)}>
            <Github className="mr-2 h-4 w-4" /> Analyze GitHub Repo
          </Button>
          <Button
            variant={chatOpen ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setChatOpen((prev) => !prev)}
          >
            {chatOpen ? <X className="mr-2 h-4 w-4" /> : <MessageSquare className="mr-2 h-4 w-4" />}
            AI Chat
          </Button>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-2 lg:p-6">
        <div className="flex flex-col gap-4 overflow-y-auto lg:overflow-visible">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            onReview={handleReview}
            onExplain={handleExplain}
            reviewLoading={reviewLoading}
            explainLoading={explainLoading}
          />
        </div>

        <div className="overflow-y-auto rounded-xl border border-border bg-card/40">
          {chatOpen ? (
            <Tabs defaultValue="review" className="flex h-full flex-col">
              <div className="border-b border-border px-4 pt-3">
                <TabsList>
                  <TabsTrigger value="review">Review</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="review" className="flex-1 overflow-y-auto m-0">
                <ReviewPanel
                  review={review}
                  language={language}
                  explanation={explanation}
                  explainLoading={explainLoading}
                  onExportPDF={handleExportPDF}
                  exportLoading={exportLoading}
                />
              </TabsContent>
              <TabsContent value="chat" className="flex-1 m-0 h-full">
                <ChatPanel messages={chatMessages} onSend={handleSendChat} loading={chatLoading} />
              </TabsContent>
            </Tabs>
          ) : (
            <ReviewPanel
              review={review}
              language={language}
              explanation={explanation}
              explainLoading={explainLoading}
              onExportPDF={handleExportPDF}
              exportLoading={exportLoading}
            />
          )}
        </div>
      </div>

      <GithubAnalyzeDialog open={githubOpen} onOpenChange={setGithubOpen} onAnalyzed={handleGithubAnalyzed} />
    </div>
  );
}