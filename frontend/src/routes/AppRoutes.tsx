import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';

import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { StudentListPage } from '@/features/students/pages/StudentListPage';
import { StudentDetailPage } from '@/features/students/pages/StudentDetailPage';
import { ProfessorListPage } from '@/features/professors/pages/ProfessorListPage';
import { DepartmentListPage } from '@/features/departments/pages/DepartmentListPage';
import { CourseListPage } from '@/features/courses/pages/CourseListPage';
import { AttendancePage } from '@/features/attendance/pages/AttendancePage';
import { ExaminationPage } from '@/features/examinations/pages/ExaminationPage';
import { FeeListPage } from '@/features/fees/pages/FeeListPage';
import { LibraryPage } from '@/features/library/pages/LibraryPage';
import { LeaveListPage } from '@/features/leave/pages/LeaveListPage';
import { TimetablePage } from '@/features/timetable/pages/TimetablePage';
import { NoticeBoardPage } from '@/features/notices/pages/NoticeBoardPage';
import { ReportsPage } from '@/features/reports/pages/ReportsPage';
import { AuditLogsPage } from '@/features/users/pages/AuditLogsPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes inside App Shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentListPage />} />
          <Route path="/students/:id" element={<StudentDetailPage />} />
          <Route path="/professors" element={<ProfessorListPage />} />
          <Route path="/departments" element={<DepartmentListPage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/examinations" element={<ExaminationPage />} />
          <Route path="/fees" element={<FeeListPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/leave" element={<LeaveListPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/notices" element={<NoticeBoardPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};


