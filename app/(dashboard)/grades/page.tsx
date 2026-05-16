'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  MoreVertical,
  TrendingUp,
  BarChart3,
  Edit,
  Trash2,
  Save,
  Loader,
  BarChart2,
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
import { Progress } from '@/components/ui/progress';
import { usePermissions } from '@/hooks/use-permissions';
import { useAuthStore } from '@/store/auth-store';

// Mock grades data
const mockStudentGrades = [
  {
    id: '1',
    subject: 'Mathematics',
    type: 'EXAM',
    value: 85,
    maxValue: 100,
    term: 2,
    teacher: 'Mr. Hadj',
    date: '2024-05-15',
    comment: 'Great performance, keep it up!',
  },
  {
    id: '2',
    subject: 'Mathematics',
    type: 'HOMEWORK',
    value: 92,
    maxValue: 100,
    term: 2,
    teacher: 'Mr. Hadj',
    date: '2024-05-10',
  },
  {
    id: '3',
    subject: 'Physics',
    type: 'QUIZ',
    value: 78,
    maxValue: 100,
    term: 2,
    teacher: 'Mrs. Amrani',
    date: '2024-05-12',
  },
  {
    id: '4',
    subject: 'Physics',
    type: 'EXAM',
    value: 88,
    maxValue: 100,
    term: 2,
    teacher: 'Mrs. Amrani',
    date: '2024-05-18',
    comment: 'Good understanding of concepts',
  },
  {
    id: '5',
    subject: 'Chemistry',
    type: 'PROJECT',
    value: 95,
    maxValue: 100,
    term: 2,
    teacher: 'Mr. Benali',
    date: '2024-05-14',
    comment: 'Excellent project work!',
  },
  {
    id: '6',
    subject: 'French',
    type: 'COMPOSITION',
    value: 82,
    maxValue: 100,
    term: 2,
    teacher: 'Mrs. Martin',
    date: '2024-05-20',
  },
];

// Mock grades for teacher view
const mockClassGrades = [
  {
    id: '1',
    student: { firstName: 'Ahmed', lastName: 'Bennaoum', avatar: 'AB' },
    subject: 'Mathematics',
    average: 87.5,
    grades: [85, 92, 90],
  },
  {
    id: '2',
    student: { firstName: 'Fatima', lastName: 'Mohamed', avatar: 'FM' },
    subject: 'Mathematics',
    average: 91.2,
    grades: [95, 88, 90],
  },
  {
    id: '3',
    student: { firstName: 'Hassan', lastName: 'Ali', avatar: 'HA' },
    subject: 'Mathematics',
    average: 75.8,
    grades: [72, 78, 78],
  },
];

export default function GradesPage() {
  const { t } = useTranslation();
  const { can, isStudent, isTeacher } = usePermissions();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('2');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [grades, setGrades] = useState(mockStudentGrades);
  const [classGrades, setClassGrades] = useState(mockClassGrades);

  const calculateAverageGrade = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + (grade.value / grade.maxValue) * 100, 0);
    return Math.round(total / grades.length);
  };

  const calculateSubjectAverage = (subject: string) => {
    const subjectGrades = grades.filter((g) => g.subject === subject);
    if (subjectGrades.length === 0) return 0;
    const total = subjectGrades.reduce((sum, g) => sum + (g.value / g.maxValue) * 100, 0);
    return Math.round(total / subjectGrades.length);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EXAM':
        return '📝';
      case 'QUIZ':
        return '📋';
      case 'HOMEWORK':
        return '✏️';
      case 'PROJECT':
        return '📊';
      case 'COMPOSITION':
        return '📄';
      default:
        return '📄';
    }
  };

  const filteredGrades = grades.filter((grade) => {
    const matchesSearch = grade.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || grade.subject === selectedSubject;
    const matchesTerm = grade.term === parseInt(selectedTerm);
    return matchesSearch && matchesSubject && matchesTerm;
  });

  const subjects = Array.from(new Set(grades.map((g) => g.subject)));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('grades.title') || 'Grades'}
        description={isStudent ? t('grades.studentDescription') || 'View your academic grades' : t('grades.teacherDescription') || 'Manage student grades'}
      >
        {isTeacher && can('grades.create') && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('grades.addGrade') || 'Add Grade'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t('grades.addGrade') || 'Add Grade'}</DialogTitle>
                <DialogDescription>
                  {t('grades.addGradeDescription') || 'Enter a new grade for a student'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label>{t('common.student')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('common.selectStudent')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ahmed Bennaoum</SelectItem>
                      <SelectItem value="2">Fatima Mohamed</SelectItem>
                      <SelectItem value="3">Hassan Ali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>{t('common.subject')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('common.selectSubject')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>{t('grades.gradeType') || 'Type'}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXAM">Exam</SelectItem>
                        <SelectItem value="QUIZ">Quiz</SelectItem>
                        <SelectItem value="HOMEWORK">Homework</SelectItem>
                        <SelectItem value="PROJECT">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>{t('common.term')}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Term 1</SelectItem>
                        <SelectItem value="2">Term 2</SelectItem>
                        <SelectItem value="3">Term 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>{t('grades.score') || 'Score'}</Label>
                    <Input type="number" placeholder="85" min="0" max="100" />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t('grades.maxScore') || 'Max Score'}</Label>
                    <Input type="number" placeholder="100" defaultValue="100" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>{t('grades.comment') || 'Comment'}</Label>
                  <Input placeholder={t('grades.commentPlaceholder') || 'Add optional comment'} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  {t('grades.addGrade') || 'Add Grade'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      {/* Student View */}
      {isStudent && (
        <>
          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">{t('grades.overallAverage') || 'Overall Average'}</p>
                    <p className={`text-4xl font-bold ${getGradeColor(calculateAverageGrade()).split(' ')[0]}`}>
                      {calculateAverageGrade()}%
                    </p>
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
                    <p className="text-sm text-muted-foreground mb-2">{t('grades.totalGrades') || 'Total Grades'}</p>
                    <p className="text-4xl font-bold">{grades.length}</p>
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
                    <p className="text-sm text-muted-foreground mb-2">{t('grades.subjects') || 'Subjects'}</p>
                    <p className="text-4xl font-bold">{subjects.length}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('grades.searchPlaceholder') || 'Search subjects...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('common.subject')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all') || 'All Subjects'}</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Subject Averages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                {t('grades.subjectAverages') || 'Subject Averages'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.map((subject) => {
                  const average = calculateSubjectAverage(subject);
                  return (
                    <div key={subject}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{subject}</p>
                        <p className={`font-bold ${getGradeColor(average).split(' ')[0]}`}>
                          {average}%
                        </p>
                      </div>
                      <Progress value={average} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Grades List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t('grades.allGrades') || 'All Grades'}</h3>
            <AnimatePresence mode="popLayout">
              {filteredGrades.map((grade) => {
                const percentage = (grade.value / grade.maxValue) * 100;
                return (
                  <motion.div
                    key={grade.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={`transition-all hover:shadow-md ${getGradeColor(percentage)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{getTypeIcon(grade.type)}</span>
                              <div>
                                <h4 className="font-semibold">{grade.subject}</h4>
                                <p className="text-sm text-muted-foreground">{grade.type}</p>
                              </div>
                            </div>
                            {grade.comment && (
                              <p className="text-sm text-muted-foreground mt-2">
                                <span className="font-medium">{t('grades.comment') || 'Comment'}:</span> {grade.comment}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getGradeBadge(percentage)}>
                              {grade.value}/{grade.maxValue}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {new Date(grade.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Teacher View */}
      {isTeacher && (
        <Tabs defaultValue="records">
          <TabsList>
            <TabsTrigger value="records">{t('grades.classRecords') || 'Class Records'}</TabsTrigger>
            <TabsTrigger value="add">{t('grades.addGrade') || 'Add Grade'}</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('grades.classGrades') || 'Class Grades'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">{t('common.student')}</th>
                        <th className="text-left py-3 px-4 font-medium">{t('common.subject')}</th>
                        <th className="text-center py-3 px-4 font-medium">{t('grades.average') || 'Average'}</th>
                        <th className="text-center py-3 px-4 font-medium">{t('common.grades')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classGrades.map((record) => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{record.student.avatar}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {record.student.firstName} {record.student.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{record.subject}</td>
                          <td className={`py-3 px-4 text-center font-bold ${getGradeColor(record.average).split(' ')[0]}`}>
                            {record.average}%
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex gap-1 justify-center">
                              {record.grades.map((grade, i) => (
                                <Badge key={i} variant="secondary">
                                  {grade}
                                </Badge>
                              ))}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>{t('grades.addGrade') || 'Add Grade'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>{t('common.student')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('common.selectStudent')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ahmed Bennaoum</SelectItem>
                      <SelectItem value="2">Fatima Mohamed</SelectItem>
                      <SelectItem value="3">Hassan Ali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>{t('common.subject')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('common.selectSubject')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>{t('grades.gradeType') || 'Type'}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXAM">Exam</SelectItem>
                        <SelectItem value="QUIZ">Quiz</SelectItem>
                        <SelectItem value="HOMEWORK">Homework</SelectItem>
                        <SelectItem value="PROJECT">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>{t('common.term')}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Term 1</SelectItem>
                        <SelectItem value="2">Term 2</SelectItem>
                        <SelectItem value="3">Term 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>{t('grades.score') || 'Score'}</Label>
                    <Input type="number" placeholder="85" min="0" max="100" />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t('grades.maxScore') || 'Max Score'}</Label>
                    <Input type="number" placeholder="100" defaultValue="100" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>{t('grades.comment') || 'Comment'}</Label>
                  <Input placeholder={t('grades.commentPlaceholder') || 'Add optional comment'} />
                </div>

                <Button className="w-full">
                  {t('grades.addGrade') || 'Add Grade'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
