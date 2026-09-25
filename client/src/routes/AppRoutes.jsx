import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { JobFeedPage } from '../pages/JobFeedPage';
import { JobDetailsPage } from '../pages/JobDetailsPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { WorkerDashboardPage } from '../pages/worker/WorkerDashboardPage';
import { WorkerProfilePage } from '../pages/worker/WorkerProfilePage';
import { EmployerDashboardPage } from '../pages/employer/EmployerDashboardPage';
import { PostJobPage } from '../pages/employer/PostJobPage';
import { JobApplicantsPage } from '../pages/employer/JobApplicantsPage';
import { EmployerProfilePage } from '../pages/employer/EmployerProfilePage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs" element={<JobFeedPage />} />
      <Route path="/jobs/:id" element={<JobDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Worker Pages */}
      <Route
        path="/worker/dashboard"
        element={
          <ProtectedRoute allowedRoles={['worker', 'admin']}>
            <WorkerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/profile"
        element={
          <ProtectedRoute allowedRoles={['worker', 'admin']}>
            <WorkerProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected Employer Pages */}
      <Route
        path="/employer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['employer', 'admin']}>
            <EmployerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/post-job"
        element={
          <ProtectedRoute allowedRoles={['employer', 'admin']}>
            <PostJobPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/jobs/:jobId/applicants"
        element={
          <ProtectedRoute allowedRoles={['employer', 'admin']}>
            <JobApplicantsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/profile"
        element={
          <ProtectedRoute allowedRoles={['employer', 'admin']}>
            <EmployerProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
