'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  Palette,
  Languages,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader,
  CheckCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store/auth-store';
import { usePermissions } from '@/hooks/use-permissions';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    gradeNotifications: true,
    attendanceNotifications: true,
    paymentNotifications: true,
    scheduleNotifications: true,
    announcementNotifications: true,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    allowMessages: true,
    showPhoneNumber: false,
    showAddress: false,
  });

  // Theme settings
  const [themeSettings, setThemeSettings] = useState({
    theme: 'system',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveAccount = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSavePrivacy = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsChangingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password changed successfully');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('settings.title') || 'Settings'}
        description={t('settings.description') || 'Manage your account settings and preferences'}
      />

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">{t('settings.account') || 'Account'}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.notifications') || 'Notifications'}</TabsTrigger>
          <TabsTrigger value="privacy">{t('settings.privacy') || 'Privacy'}</TabsTrigger>
          <TabsTrigger value="preferences">{t('settings.preferences') || 'Preferences'}</TabsTrigger>
        </TabsList>

        {/* Account Settings Tab */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.accountInfo') || 'Account Information'}</CardTitle>
              <CardDescription>
                {t('settings.accountInfoDescription') || 'Update your personal account details'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>{t('common.firstName')}</Label>
                  <Input
                    value={accountSettings.firstName}
                    onChange={(e) =>
                      setAccountSettings({ ...accountSettings, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t('common.lastName')}</Label>
                  <Input
                    value={accountSettings.lastName}
                    onChange={(e) =>
                      setAccountSettings({ ...accountSettings, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>{t('common.email')}</Label>
                <Input
                  type="email"
                  value={accountSettings.email}
                  onChange={(e) =>
                    setAccountSettings({ ...accountSettings, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>{t('common.phone')}</Label>
                <Input
                  value={accountSettings.phone}
                  onChange={(e) =>
                    setAccountSettings({ ...accountSettings, phone: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleSaveAccount} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.saving')}
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {t('common.saved')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('common.save')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {t('settings.changePassword') || 'Change Password'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                <DialogTrigger asChild>
                  <Button variant="outline">{t('settings.changePassword') || 'Change Password'}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('settings.changePassword') || 'Change Password'}</DialogTitle>
                    <DialogDescription>
                      {t('settings.changePasswordDescription') || 'Enter your current password and new password'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid gap-2">
                      <Label>{t('settings.currentPassword') || 'Current Password'}</Label>
                      <div className="relative">
                        <Input
                          type={showPasswords ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2"
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>{t('settings.newPassword') || 'New Password'}</Label>
                      <Input
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>{t('settings.confirmPassword') || 'Confirm Password'}</Label>
                      <Input
                        type={showPasswords ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsChangingPassword(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button onClick={handleChangePassword}>
                      {t('settings.updatePassword') || 'Update Password'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('settings.notificationChannels') || 'Notification Channels'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('settings.emailNotifications') || 'Email Notifications'}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.emailNotificationsDesc') || 'Receive notifications via email'}</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('settings.pushNotifications') || 'Push Notifications'}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.pushNotificationsDesc') || 'Receive push notifications'}</p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('settings.smsNotifications') || 'SMS Notifications'}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.smsNotificationsDesc') || 'Receive SMS notifications'}</p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notificationTypes') || 'Notification Types'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t('settings.gradeNotifications') || 'Grade Notifications'}</Label>
                <Switch
                  checked={notificationSettings.gradeNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      gradeNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>{t('settings.attendanceNotifications') || 'Attendance Notifications'}</Label>
                <Switch
                  checked={notificationSettings.attendanceNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      attendanceNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>{t('settings.paymentNotifications') || 'Payment Notifications'}</Label>
                <Switch
                  checked={notificationSettings.paymentNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      paymentNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>{t('settings.scheduleNotifications') || 'Schedule Notifications'}</Label>
                <Switch
                  checked={notificationSettings.scheduleNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      scheduleNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>{t('settings.announcementNotifications') || 'Announcement Notifications'}</Label>
                <Switch
                  checked={notificationSettings.announcementNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      announcementNotifications: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveNotifications} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                {t('common.saving')}
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('common.saved')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('common.save')}
              </>
            )}
          </Button>
        </TabsContent>

        {/* Privacy Settings Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.privacySettings') || 'Privacy Settings'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label className="mb-3">{t('settings.profileVisibility') || 'Profile Visibility'}</Label>
                  <Select value={privacySettings.profileVisibility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">{t('settings.public') || 'Public'}</SelectItem>
                      <SelectItem value="private">{t('settings.private') || 'Private'}</SelectItem>
                      <SelectItem value="classOnly">{t('settings.classOnly') || 'Class Only'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t('settings.allowMessages') || 'Allow Messages'}</Label>
                  <Switch
                    checked={privacySettings.allowMessages}
                    onCheckedChange={(checked) =>
                      setPrivacySettings({ ...privacySettings, allowMessages: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>{t('settings.showPhoneNumber') || 'Show Phone Number'}</Label>
                  <Switch
                    checked={privacySettings.showPhoneNumber}
                    onCheckedChange={(checked) =>
                      setPrivacySettings({ ...privacySettings, showPhoneNumber: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>{t('settings.showAddress') || 'Show Address'}</Label>
                  <Switch
                    checked={privacySettings.showAddress}
                    onCheckedChange={(checked) =>
                      setPrivacySettings({ ...privacySettings, showAddress: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSavePrivacy} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                {t('common.saving')}
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('common.saved')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('common.save')}
              </>
            )}
          </Button>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t('settings.displayPreferences') || 'Display Preferences'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-3">{t('settings.theme') || 'Theme'}</Label>
                <Select value={themeSettings.theme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t('settings.light') || 'Light'}</SelectItem>
                    <SelectItem value="dark">{t('settings.dark') || 'Dark'}</SelectItem>
                    <SelectItem value="system">{t('settings.system') || 'System'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-3 flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  {t('settings.language') || 'Language'}
                </Label>
                <Select value={themeSettings.language}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-3">{t('settings.dateFormat') || 'Date Format'}</Label>
                <Select value={themeSettings.dateFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-3">{t('settings.timeFormat') || 'Time Format'}</Label>
                <Select value={themeSettings.timeFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 Hour</SelectItem>
                    <SelectItem value="12h">12 Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
