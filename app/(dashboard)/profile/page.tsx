'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  Users,
  BookOpen,
  Edit,
  Save,
  X,
  Upload,
  User,
  Loader,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

// Mock student profile data
const studentProfile = {
  id: '1',
  user: {
    firstName: 'Ahmed',
    lastName: 'Bennaoum',
    email: 'ahmed@school.edu',
    phone: '+213 661 234 567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
  },
  matricule: 'MAT-2024-001',
  dateOfBirth: '2008-05-15',
  gender: 'MALE',
  address: '123 Rue de la Paix, Algiers',
  bloodType: 'O+',
  class: {
    name: '3AS-Math',
    level: '3AS',
  },
  parent: {
    firstName: 'Mohamed',
    lastName: 'Bennaoum',
    phone: '+213 671 234 567',
    email: 'parent@email.com',
    occupation: 'Engineer',
  },
  enrollmentDate: '2022-09-01',
  status: 'ACTIVE',
};

// Mock teacher profile data
const teacherProfile = {
  id: '2',
  user: {
    firstName: 'Mr.',
    lastName: 'Hadj',
    email: 'hadj@school.edu',
    phone: '+213 661 234 567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hadj',
  },
  employeeId: 'EMP-2020-001',
  degree: 'Master in Mathematics',
  specialization: 'Advanced Calculus',
  hireDate: '2020-09-01',
  contractType: 'Full-time',
  subjects: ['Mathematics', 'Algebra', 'Geometry'],
  classes: ['3AS-Math', '2AS-Math', '1AS-A'],
  yearsOfExperience: 4,
  certifications: ['Advanced Teaching Methods', 'Educational Technology'],
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { isStudent, isTeacher } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [editData, setEditData] = useState<any>(isStudent ? studentProfile : teacherProfile);

  const profile = isStudent ? studentProfile : teacherProfile;

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleAvatarUpload = async () => {
    setIsUploadingAvatar(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsUploadingAvatar(false);
  };

  const getRoleBadge = () => {
    if (isStudent) return <Badge className="bg-blue-600">Student</Badge>;
    if (isTeacher) return <Badge className="bg-green-600">Teacher</Badge>;
    return <Badge>User</Badge>;
  };

  const getStatusColor = () => {
    if (profile.status === 'ACTIVE') return 'bg-green-500';
    if (profile.status === 'SUSPENDED') return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('profile.title') || 'Profile'}
        description={t('profile.description') || 'View and manage your profile information'}
      >
        <Button
          variant={isEditing ? 'outline' : 'default'}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel')}
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              {t('common.edit')}
            </>
          )}
        </Button>
      </PageHeader>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.user.avatar} />
                  <AvatarFallback>
                    {profile.user.firstName[0]}{profile.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full"
                        onClick={handleAvatarUpload}
                      >
                        {isUploadingAvatar ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('profile.uploadAvatar') || 'Upload Avatar'}</DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center justify-center w-full p-8 border-2 border-dashed rounded-lg">
                        <Input type="file" accept="image/*" className="hidden" />
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            {t('common.dragDropOrClick') || 'Drag and drop your image here'}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  {profile.user.firstName} {profile.user.lastName}
                </h2>
                <div className="flex gap-2 mt-2 justify-center">
                  {getRoleBadge()}
                  <Badge className={getStatusColor()}>
                    {profile.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex-1 grid gap-4 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('common.email')}</p>
                  <p className="font-medium">{profile.user.email}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('common.phone')}</p>
                  <p className="font-medium">{profile.user.phone}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('profile.address') || 'Address'}</p>
                  <p className="font-medium">{profile.user.address || 'Not set'}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('profile.dateOfBirth') || 'Date of Birth'}</p>
                  <p className="font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Tabs */}
      <Tabs defaultValue={isStudent ? 'student' : 'teacher'} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {isStudent && <TabsTrigger value="student">{t('profile.studentInfo') || 'Student Info'}</TabsTrigger>}
          {isTeacher && <TabsTrigger value="teacher">{t('profile.teacherInfo') || 'Teacher Info'}</TabsTrigger>}
          <TabsTrigger value="documents">{t('profile.documents') || 'Documents'}</TabsTrigger>
        </TabsList>

        {/* Student Tab */}
        {isStudent && (
          <TabsContent value="student">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {t('profile.academicInfo') || 'Academic Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {isEditing ? (
                    <>
                      <div className="grid gap-2">
                        <Label>{t('profile.class') || 'Class'}</Label>
                        <Select defaultValue={editData.class?.name}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1AM">1AM</SelectItem>
                            <SelectItem value="2AM">2AM</SelectItem>
                            <SelectItem value="3AM">3AM</SelectItem>
                            <SelectItem value="3AS-Math">3AS-Math</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('profile.matricule') || 'Matricule'}</p>
                        <p className="font-medium">{profile.matricule}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('profile.class') || 'Class'}</p>
                        <p className="font-medium">{profile.class.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('profile.enrollmentDate') || 'Enrollment Date'}</p>
                        <p className="font-medium">{new Date(profile.enrollmentDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('profile.gender') || 'Gender'}</p>
                        <p className="font-medium">{profile.gender}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('profile.parentInfo') || 'Parent Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('common.name')}</p>
                      <p className="font-medium">{profile.parent.firstName} {profile.parent.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('common.email')}</p>
                      <p className="font-medium">{profile.parent.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('common.phone')}</p>
                      <p className="font-medium">{profile.parent.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('profile.occupation') || 'Occupation'}</p>
                      <p className="font-medium">{profile.parent.occupation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Teacher Tab */}
        {isTeacher && (
          <TabsContent value="teacher">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {t('profile.professionalInfo') || 'Professional Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('profile.employeeId') || 'Employee ID'}</p>
                      <p className="font-medium">{profile.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('profile.hireDate') || 'Hire Date'}</p>
                      <p className="font-medium">{new Date(profile.hireDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('profile.contractType') || 'Contract Type'}</p>
                      <p className="font-medium">{profile.contractType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('profile.experience') || 'Experience'}</p>
                      <p className="font-medium">{profile.yearsOfExperience} years</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {t('profile.qualifications') || 'Qualifications'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('profile.degree') || 'Degree'}</p>
                    <p className="font-medium">{profile.degree}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('profile.specialization') || 'Specialization'}</p>
                    <p className="font-medium">{profile.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('profile.subjects') || 'Subjects'}</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary">{subject}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('profile.certifications') || 'Certifications'}</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.certifications.map((cert) => (
                        <Badge key={cert} variant="outline">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('profile.classes') || 'Classes'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.classes.map((cls) => (
                      <Badge key={cls}>{cls}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.documents') || 'Documents'}</CardTitle>
              <CardDescription>{t('profile.documentsDescription') || 'Your uploaded documents and certificates'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>{t('profile.noDocuments') || 'No documents uploaded yet'}</p>
                {isEditing && (
                  <Button variant="outline" className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    {t('common.upload')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('common.save')}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
