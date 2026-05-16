'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  BookMarked,
  DollarSign,
  Calendar,
  MessageSquare,
  Check,
  X,
  Archive,
  MoreVertical,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePermissions } from '@/hooks/use-permissions';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'GRADE',
    title: 'New Grade Posted',
    message: 'Your Mathematics midterm exam has been graded. Score: 85/100',
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    icon: BookMarked,
    color: 'bg-blue-500',
  },
  {
    id: '2',
    type: 'ATTENDANCE',
    title: 'Attendance Alert',
    message: 'You were marked absent in Physics class on 2024-05-15',
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    icon: AlertCircle,
    color: 'bg-orange-500',
  },
  {
    id: '3',
    type: 'PAYMENT',
    title: 'Payment Due',
    message: 'Your tuition payment is due by 2024-06-01. Amount: $500',
    isRead: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    icon: DollarSign,
    color: 'bg-red-500',
  },
  {
    id: '4',
    type: 'SCHEDULE',
    title: 'Schedule Change',
    message: 'Your class schedule has been updated. French class moved from Tuesday 10:00 to Wednesday 14:00',
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    icon: Calendar,
    color: 'bg-purple-500',
  },
  {
    id: '5',
    type: 'GENERAL',
    title: 'New Announcement',
    message: 'School will be closed on May 20, 2024 for Memorial Day',
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    icon: MessageSquare,
    color: 'bg-green-500',
  },
  {
    id: '6',
    type: 'GRADE',
    title: 'Assignment Feedback',
    message: 'Your Physics project has been reviewed. Great work! +10 bonus points',
    isRead: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    icon: CheckCircle,
    color: 'bg-blue-500',
  },
];

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('unread');

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesTab =
      (activeTab === 'unread' && !notif.isRead) ||
      (activeTab === 'read' && notif.isRead) ||
      activeTab === 'all';

    return matchesSearch && matchesType && matchesTab;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: false } : notif
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      setNotifications([]);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GRADE':
        return 'bg-blue-100 text-blue-800';
      case 'ATTENDANCE':
        return 'bg-orange-100 text-orange-800';
      case 'PAYMENT':
        return 'bg-red-100 text-red-800';
      case 'SCHEDULE':
        return 'bg-purple-100 text-purple-800';
      case 'GENERAL':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('notifications.title') || 'Notifications'}
        description={t('notifications.description') || 'Stay updated with your notifications'}
      >
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              {t('notifications.markAllAsRead') || 'Mark All as Read'}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleClearAll} disabled={notifications.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t('notifications.clearAll') || 'Clear All'}
          </Button>
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('notifications.searchPlaceholder') || 'Search notifications...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('common.filter')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all') || 'All Types'}</SelectItem>
            <SelectItem value="GRADE">{t('notifications.grades') || 'Grades'}</SelectItem>
            <SelectItem value="ATTENDANCE">{t('notifications.attendance') || 'Attendance'}</SelectItem>
            <SelectItem value="PAYMENT">{t('notifications.payments') || 'Payments'}</SelectItem>
            <SelectItem value="SCHEDULE">{t('notifications.schedule') || 'Schedule'}</SelectItem>
            <SelectItem value="GENERAL">{t('notifications.general') || 'General'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="unread">
            {t('notifications.unread') || 'Unread'}
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">{t('notifications.read') || 'Read'}</TabsTrigger>
          <TabsTrigger value="all">{t('common.all') || 'All'}</TabsTrigger>
        </TabsList>

        {/* Unread Tab */}
        <TabsContent value="unread" className="mt-6">
          {filteredNotifications.filter((n) => !n.isRead).length === 0 ? (
            <Card className="py-8 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{t('notifications.noUnread') || 'No unread notifications'}</p>
            </Card>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredNotifications
                  .filter((n) => !n.isRead)
                  .map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAsUnread={handleMarkAsUnread}
                      onDelete={handleDelete}
                      formatTime={formatTime}
                      getTypeColor={getTypeColor}
                    />
                  ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        {/* Read Tab */}
        <TabsContent value="read" className="mt-6">
          {filteredNotifications.filter((n) => n.isRead).length === 0 ? (
            <Card className="py-8 text-center">
              <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{t('notifications.noRead') || 'No read notifications'}</p>
            </Card>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredNotifications
                  .filter((n) => n.isRead)
                  .map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAsUnread={handleMarkAsUnread}
                      onDelete={handleDelete}
                      formatTime={formatTime}
                      getTypeColor={getTypeColor}
                    />
                  ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        {/* All Tab */}
        <TabsContent value="all" className="mt-6">
          {filteredNotifications.length === 0 ? (
            <Card className="py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{t('notifications.noNotifications') || 'No notifications'}</p>
            </Card>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAsUnread={handleMarkAsUnread}
                    onDelete={handleDelete}
                    formatTime={formatTime}
                    getTypeColor={getTypeColor}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  formatTime,
  getTypeColor,
}: any) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`cursor-pointer transition-all hover:shadow-md ${
          !notification.isRead ? 'border-primary/50 bg-primary/5' : ''
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`rounded-full p-3 ${notification.color} text-white flex-shrink-0`}>
              <notification.icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold ${!notification.isRead ? 'font-bold' : ''}`}>
                      {notification.title}
                    </h4>
                    <Badge className={getTypeColor(notification.type)}>
                      {notification.type}
                    </Badge>
                    {!notification.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!notification.isRead ? (
                  <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Read
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onMarkAsUnread(notification.id)}>
                    <X className="mr-2 h-4 w-4" />
                    Mark as Unread
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(notification.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
