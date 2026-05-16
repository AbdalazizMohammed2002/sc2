'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Check,
  X,
  Clock,
  Search,
  Filter,
  Download,
  Printer,
  MoreVertical,
  TrendingUp,
  Calendar,
  AlertCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { usePermissions } from '@/hooks/use-permissions';
import { useAuthStore } from '@/store/auth-store';

// Mock attendance data
const mockAttendance = [
  {
    id: '1',
    date: '2024-05-20',
    subject: 'Mathematics',
    status: 'PRESENT',
    teacher: 'Mr. Hadj',
    class: '3AS-Math',
  },
  {
    id: '2',
    date: '2024-05-20',
    subject: 'Physics',
    status: 'PRESENT',
    teacher: 'Mrs. Amrani',
    class: '3AS-Math',
  },
  {
    id: '3',
    date: '2024-05-19',
    subject: 'Mathematics',
    status: 'LATE',
    teacher: 'Mr. Hadj',
    class: '3AS-Math',
  },
  {
    id: '4',
    date: '2024-05-19',
    subject: 'French',
    status: 'PRESENT',
    teacher: 'Mrs. Martin',
    class: '3AS-Math',
  },
  {
    id: '5',
    date: '2024-05-18',
    subject: 'Chemistry',
    status: 'ABSENT',
    teacher: 'Mr. Benali',
    class: '3AS-Math',
    justification: 'Doctor appointment',
  },
  {
    id: '6',
    date: '2024-05-17',
    subject: 'English',
    status: 'PRESENT',
    teacher: 'Mr. Smith',
    class: '3AS-Math',
  },
  {
    id: '7',
    date: '2024-05-16',
    subject: 'Mathematics',
    status: 'ABSENT',
    teacher: 'Mr. Hadj',
    class: '3AS-Math',
  },
];

// Mock student records for teacher view
const mockStudentRecords = [
  {
    id: '1',
    student: { firstName: 'Ahmed', lastName: 'Bennaoum', avatar: 'AB' },
    presentCount: 18,
    absentCount: 2,
    lateCount: 1,
    totalClasses: 21,
  },
  {
    id: '2',
    student: { firstName: 'Fatima', lastName: 'Mohamed', avatar: 'FM' },
    presentCount: 20,
    absentCount: 1,
    lateCount: 0,
    totalClasses: 21,
  },
  {
    id: '3',
    student: { firstName: 'Hassan', lastName: 'Ali', avatar: 'HA' },
    presentCount: 17,
    absentCount: 3,
    lateCount: 1,
    totalClasses: 21,
  },
];

export default function AttendancePage() {
  const { t } = useTranslation();
  const { can, isStudent, isTeacher } = usePermissions();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('3AS-Math');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [attendance, setAttendance] = useState(mockAttendance);
  const [studentRecords, setStudentRecords] = useState(mockStudentRecords);

  const calculateAttendanceRate = () => {
    const present = attendance.filter((a) => a.status === 'PRESENT').length;
    const total = attendance.length;
    return total > 0 ? Math.round((present / total) * 100) : 0;
  };

  const calculateStudentRate = (student: any) => {
    return student.totalClasses > 0
      ? Math.round((student.presentCount / student.totalClasses) * 100)
      : 0;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <Badge className="bg-green-500">{t('attendance.present') || 'Present'}</Badge>;
      case 'ABSENT':
        return <Badge className="bg-red-500">{t('attendance.absent') || 'Absent'}</Badge>;
      case 'LATE':
        return <Badge className="bg-yellow-500">{t('attendance.late') || 'Late'}</Badge>;
      case 'EXCUSED':
        return <Badge className="bg-blue-500">{t('attendance.excused') || 'Excused'}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'border-green-500/50 bg-green-50';
      case 'ABSENT':
        return 'border-red-500/50 bg-red-50';
      case 'LATE':
        return 'border-yellow-500/50 bg-yellow-50';
      default:
        return 'border-blue-500/50 bg-blue-50';
    }
  };

  const handleMarkAttendance = (studentId: string, status: string) => {
    console.log(`[v0] Marking student ${studentId} as ${status}`);
  };

  const filteredAttendance = attendance
    .filter((record) =>
      record.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('attendance.title') || 'Attendance'}
        description={isStudent ? t('attendance.studentDescription') || 'View your attendance records' : t('attendance.teacherDescription') || 'Manage class attendance'}
      >
        {isTeacher && can('attendance.create') && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('attendance.markAttendance') || 'Mark Attendance'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{t('attendance.markAttendance') || 'Mark Attendance'}</DialogTitle>
                <DialogDescription>
                  {t('attendance.markAttendanceDescription') || 'Record attendance for your class'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>{t('common.date')}</Label>
                    <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t('attendance.class') || 'Class'}</Label>
                    <Select value={selectedClass}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3AS-Math">3AS-Math</SelectItem>
                        <SelectItem value="2AS-Math">2AS-Math</SelectItem>
                        <SelectItem value="1AS-A">1AS-A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 max-h-[400px] overflow-y-auto">
                  {mockStudentRecords.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{student.student.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.student.firstName} {student.student.lastName}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleMarkAttendance(student.id, 'PRESENT')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-yellow-600 hover:text-yellow-700"
                          onClick={() => handleMarkAttendance(student.id, 'LATE')}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleMarkAttendance(student.id, 'ABSENT')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  {t('attendance.saveAttendance') || 'Save Attendance'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      {/* Statistics */}
      {isStudent && (
        <div className="grid gap-4 sm:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">{t('attendance.attendanceRate') || 'Attendance Rate'}</p>
                  <p className="text-3xl font-bold text-green-600">{calculateAttendanceRate()}%</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">{t('attendance.present') || 'Present'}</p>
                  <p className="text-3xl font-bold text-green-600">
                    {attendance.filter((a) => a.status === 'PRESENT').length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">{t('attendance.absent') || 'Absent'}</p>
                  <p className="text-3xl font-bold text-red-600">
                    {attendance.filter((a) => a.status === 'ABSENT').length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">{t('attendance.late') || 'Late'}</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {attendance.filter((a) => a.status === 'LATE').length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Teacher View - Student Records */}
      {isTeacher && (
        <Tabs defaultValue="records">
          <TabsList>
            <TabsTrigger value="records">{t('attendance.records') || 'Records'}</TabsTrigger>
            <TabsTrigger value="mark">{t('attendance.mark') || 'Mark Today'}</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('attendance.classRecords') || 'Class Attendance Records'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentRecords.map((record) => {
                    const rate = calculateStudentRate(record);
                    const rateColor = rate >= 90 ? 'text-green-600' : rate >= 70 ? 'text-yellow-600' : 'text-red-600';

                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{record.student.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{record.student.firstName} {record.student.lastName}</p>
                              <p className="text-sm text-muted-foreground">
                                Present: {record.presentCount} | Absent: {record.absentCount} | Late: {record.lateCount}
                              </p>
                            </div>
                          </div>
                          <div className={`text-2xl font-bold ${rateColor}`}>
                            {rate}%
                          </div>
                        </div>
                        <Progress value={rate} className="h-2" />
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mark" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('attendance.markToday') || 'Mark Today&apos;s Attendance'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="grid gap-2">
                    <Label>{t('common.date')}</Label>
                    <Input type="date" defaultValue={selectedDate} />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t('attendance.class') || 'Class'}</Label>
                    <Select defaultValue={selectedClass}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3AS-Math">3AS-Math</SelectItem>
                        <SelectItem value="2AS-Math">2AS-Math</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-3">
                  {mockStudentRecords.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{student.student.avatar}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{student.student.firstName} {student.student.lastName}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-green-600">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-yellow-600">
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-6">
                  {t('attendance.saveAttendance') || 'Save Attendance'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Student View - Attendance History */}
      {isStudent && (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('attendance.searchPlaceholder') || 'Search subjects...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredAttendance.map((record) => (
                <motion.div
                  key={record.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`border-2 transition-all hover:shadow-md ${getStatusColor(record.status)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{record.subject}</h4>
                            {getStatusBadge(record.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <p className="text-xs">{t('common.date')}</p>
                              <p className="font-medium">
                                {new Date(record.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs">{t('attendance.teacher') || 'Teacher'}</p>
                              <p className="font-medium">{record.teacher}</p>
                            </div>
                          </div>
                          {record.justification && (
                            <p className="text-sm text-muted-foreground mt-2">
                              <span className="font-medium">{t('attendance.justification') || 'Justification'}:</span> {record.justification}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
