import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminAuthGuardService} from './admin-shared/admin.auth.guard.service';

const routes: Routes = [
  { path: 'admin', loadChildren: './admin-auth/admin-auth.module#AdminAuthModule',
    data: { animation: 'admin'} },
  { path: 'admin/dashboard',
    loadChildren: './admin-dashboard/admin-dashboard.module#AdminDashboardModule', data: { animation: 'adminLogin' }, canActivate: [AdminAuthGuardService] },
  { path: 'admin/user-management',
    loadChildren: './admin-user-management/admin-user-management.module#AdminUserManagementModule',
    canActivate: [AdminAuthGuardService],
    data: { animation: 'adminUserManagement' } },
  { path: 'admin/owner-accounts',
    loadChildren: './admin-owner-accounts/admin-owner-accounts.module#AdminOwnerAccountsModule',
    canActivate: [AdminAuthGuardService],
    data: { animation: 'adminOwnerAccounts' } },
  { path: 'admin/impersonation',
    loadChildren: './admin-impersonation/admin-impersonation.module#AdminImpersonationModule',
    canActivate: [AdminAuthGuardService],
    data: { animation: 'adminImpersonation' } },
  { path: 'admin/payment-history',
    loadChildren: './admin-payment-history/admin-payment-history.module#AdminPaymentHistoryModule',
    canActivate: [AdminAuthGuardService],
    data: { animation: 'adminPaymentHistory' } },
  { path: 'admin/reports',
    loadChildren: './admin-reports/admin-reports.module#AdminReportsModule',
    canActivate: [AdminAuthGuardService],
    data: { animation: 'adminReports' } },
  { path: 'admin/accounts',
    loadChildren: './admin-accounts/admin-accounts.module#AdminAccountsModule',
    canActivate: [AdminAuthGuardService],
    data: { animation: 'adminAccounts' } },
  { path: 'admin/reminders',
    loadChildren: './admin-reminders/admin-reminders.module#AdminRemindersModule',
    canActivate: [AdminAuthGuardService],
    data: { animation: 'adminReminders' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
