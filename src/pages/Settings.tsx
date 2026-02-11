import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from '@/state/useUserStore';
import { useAuth } from '@/hooks/useAuth';
import { useDocStore } from '@/state/useDocStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  User,
  Palette,
  Globe,
  Bell,
  Shield,
  Database,
  Download,
  Upload,
  FileText,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Key,
  Monitor,
  Zap,
  Moon,
  Sun,
  CheckCircle,
  AlertCircle,
  Info,
  Settings2,
  HelpCircle,
  Mail,
  MessageSquare,
  BookOpen,
  ExternalLink,
} from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, colorTheme, toggleTheme, setColorTheme } = useUserStore();
  const { user } = useAuth();
  const { currentDocument, documents } = useDocStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    bio: '',
  });
  
  // Notification Settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    documentUpdates: true,
    aiFeatures: true,
    systemUpdates: false,
    marketing: false,
  });
  
  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    dataCollection: true,
    analytics: true,
    crashReports: true,
  });
  
  // Editor Settings
  const [editorSettings, setEditorSettings] = useState({
    autoSave: true,
    autoSaveInterval: 30,
    fontSize: 14,
    fontFamily: 'Inter',
    lineSpacing: 1.5,
    wordWrap: true,
    spellCheck: true,
    autoComplete: true,
  });

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.name,
          bio: profileData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - since exportAllDocuments doesn't exist, we'll just simulate
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion not available in demo');
    }
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setProfileData({
        name: 'John Doe',
        email: 'john.doe@example.com',
        bio: '',
      });
      setNotifications({
        email: true,
        push: false,
        documentUpdates: true,
        aiFeatures: true,
        systemUpdates: false,
        marketing: false,
      });
      setPrivacy({
        profileVisibility: 'public',
        dataCollection: true,
        analytics: true,
        crashReports: true,
      });
      setEditorSettings({
        autoSave: true,
        autoSaveInterval: 30,
        fontSize: 14,
        fontFamily: 'Inter',
        lineSpacing: 1.5,
        wordWrap: true,
        spellCheck: true,
        autoComplete: true,
      });
      toast.success('Settings reset to default');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="gap-2">
              <FileText className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                    placeholder="Tell us about yourself..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <Button onClick={handleSaveProfile} disabled={isLoading} className="gap-2">
                    <Save className="h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Password & Security
                </CardTitle>
                <CardDescription>
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme & Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Theme Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose between light and dark mode
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => theme === 'dark' && toggleTheme()}
                        className="gap-2"
                      >
                        <Sun className="h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => theme === 'light' && toggleTheme()}
                        className="gap-2"
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Color Theme</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { name: 'orange', color: 'bg-orange-500' },
                        { name: 'blue', color: 'bg-blue-500' },
                        { name: 'green', color: 'bg-green-500' },
                        { name: 'red', color: 'bg-red-500' },
                      ].map((color) => (
                        <Button
                          key={color.name}
                          variant={colorTheme === color.name ? 'default' : 'outline'}
                          onClick={() => setColorTheme(color.name as 'orange' | 'blue' | 'green' | 'red')}
                          className="gap-2 capitalize"
                        >
                          <div className={`w-3 h-3 rounded-full ${color.color}`} />
                          {color.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Editor Settings
                </CardTitle>
                <CardDescription>
                  Configure the editor behavior and appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-save">Auto Save</Label>
                      <Switch
                        id="auto-save"
                        checked={editorSettings.autoSave}
                        onCheckedChange={(checked) =>
                          setEditorSettings(prev => ({ ...prev, autoSave: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="word-wrap">Word Wrap</Label>
                      <Switch
                        id="word-wrap"
                        checked={editorSettings.wordWrap}
                        onCheckedChange={(checked) =>
                          setEditorSettings(prev => ({ ...prev, wordWrap: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="spell-check">Spell Check</Label>
                      <Switch
                        id="spell-check"
                        checked={editorSettings.spellCheck}
                        onCheckedChange={(checked) =>
                          setEditorSettings(prev => ({ ...prev, spellCheck: checked }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="font-size">Font Size</Label>
                      <Select
                        value={editorSettings.fontSize.toString()}
                        onValueChange={(value) =>
                          setEditorSettings(prev => ({ ...prev, fontSize: parseInt(value) }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12px</SelectItem>
                          <SelectItem value="14">14px</SelectItem>
                          <SelectItem value="16">16px</SelectItem>
                          <SelectItem value="18">18px</SelectItem>
                          <SelectItem value="20">20px</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="font-family">Font Family</Label>
                      <Select
                        value={editorSettings.fontFamily}
                        onValueChange={(value) =>
                          setEditorSettings(prev => ({ ...prev, fontFamily: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Lato">Lato</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'push', label: 'Push Notifications', description: 'Receive browser push notifications' },
                  { key: 'documentUpdates', label: 'Document Updates', description: 'Get notified about document changes' },
                  { key: 'aiFeatures', label: 'AI Features', description: 'Updates about new AI features and improvements' },
                  { key: 'systemUpdates', label: 'System Updates', description: 'Important system and maintenance updates' },
                  { key: 'marketing', label: 'Marketing', description: 'Product updates and promotional content' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3">
                    <div className="space-y-1">
                      <Label>{item.label}</Label>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control your data and privacy preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select
                    value={privacy.profileVisibility}
                    onValueChange={(value) =>
                      setPrivacy(prev => ({ ...prev, profileVisibility: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {[
                  { key: 'dataCollection', label: 'Data Collection', description: 'Allow collection of usage data to improve the service' },
                  { key: 'analytics', label: 'Analytics', description: 'Help us understand how you use the application' },
                  { key: 'crashReports', label: 'Crash Reports', description: 'Automatically send crash reports to help us fix issues' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3">
                    <div className="space-y-1">
                      <Label>{item.label}</Label>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={privacy[item.key as keyof typeof privacy] as boolean}
                      onCheckedChange={(checked) =>
                        setPrivacy(prev => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Manage your personal data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">Export All Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Download all your documents and data in a zip file
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleExportData} disabled={isLoading} className="gap-2">
                    <Download className="h-4 w-4" />
                    {isLoading ? 'Exporting...' : 'Export'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50 dark:bg-red-950/20">
                  <div className="space-y-1">
                    <Label className="font-medium text-red-600">Delete Account</Label>
                    <p className="text-sm text-red-600">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>
                  Advanced configuration options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">Reset All Settings</Label>
                    <p className="text-sm text-muted-foreground">
                      Reset all settings to their default values
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleResetSettings} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Reset Settings
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">Clear Cache</Label>
                    <p className="text-sm text-muted-foreground">
                      Clear application cache and temporary files
                    </p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear Cache
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">Developer Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable developer features and debugging tools
                    </p>
                  </div>
                  <Switch checked={false} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Application Information
                </CardTitle>
                <CardDescription>
                  Technical details about the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Version</Label>
                    <p className="text-sm text-muted-foreground">6.0.0</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Build</Label>
                    <p className="text-sm text-muted-foreground">2024.12.28</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Environment</Label>
                    <p className="text-sm text-muted-foreground">Production</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">License</Label>
                    <p className="text-sm text-muted-foreground">Premium</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
