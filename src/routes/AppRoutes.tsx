import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AdminRoute } from '../components/auth/AdminRoute';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TodosPage } from '../pages/TodosPage';
import { UsersPage } from '../pages/UsersPage';
import { RolesPage } from '../pages/RolesPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PermissionRoute } from '../components/auth/PermissionRoute';
import { MODULES, SUB_MODULES, PERMISSIONS } from '../constants/modulesAndPermissions';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes within Enterprise Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="todos" element={<TodosPage />} />
        <Route
          path="users"
          element={
            <PermissionRoute
              module={MODULES.USER_MANAGEMENT}
              subModule={SUB_MODULES.USER_MANAGEMENT}
              permission={PERMISSIONS.USER_MANAGEMENT.LIST}
            >
              <UsersPage />
            </PermissionRoute>
          }
        />
        <Route
          path="roles"
          element={
            <PermissionRoute
              module={MODULES.ROLES_MANAGEMENT}
              subModule={SUB_MODULES.ROLES_MANAGEMENT}
              permission={PERMISSIONS.ROLES_MANAGEMENT.LIST}
            >
              <RolesPage />
            </PermissionRoute>
          }
        />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
