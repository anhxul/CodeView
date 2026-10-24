import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader } from '@/components/common/Loader';
import { LANGUAGES } from '@/components/editor/LanguageSelector';
import { getSettings, updateSettings } from '@/api/report.api';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        setSettings(res.data.data.settings);
      } catch (err) {
        toast({
          title: 'Failed to load settings',
          description: err.response?.data?.message || 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateSettings({
        theme: settings.theme,
        defaultLanguage: settings.defaultLanguage,
        editor: settings.editor,
        notifications: settings.notifications,
      });
      setSettings(res.data.data.settings);
      setTheme(res.data.data.settings.theme);
      toast({ title: 'Settings saved', description: 'Your preferences have been updated.' });
    } catch (err) {
      toast({
        title: 'Save failed',
        description: err.response?.data?.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader size="lg" label="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Customize your CodeView AI experience.</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Choose how CodeView looks for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, theme: value }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Editor Preferences</CardTitle>
          <CardDescription>Defaults applied to the Monaco code editor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Default Language</Label>
            <Select
              value={settings.defaultLanguage}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, defaultLanguage: value }))}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>Editor Theme</Label>
            <Select
              value={settings.editor.editorTheme}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, editor: { ...prev.editor, editorTheme: value } }))
              }
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vs-dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="hc-black">High Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>Word Wrap</Label>
            <Switch
              checked={settings.editor.wordWrap}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, editor: { ...prev.editor, wordWrap: checked } }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Minimap</Label>
            <Switch
              checked={settings.editor.minimap}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, editor: { ...prev.editor, minimap: checked } }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>Manage email notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label>Email me when a review completes</Label>
            <Switch
              checked={settings.notifications.emailOnReviewComplete}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, emailOnReviewComplete: checked },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="gradient" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}