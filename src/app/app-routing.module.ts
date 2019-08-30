import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_shared/services/auth.guard.service';

const routes: Routes = [
	{ path: 'auth', loadChildren: './portal/portal.module#PortalModule'},
	{ path: 'typography', loadChildren: './typography/typography.module#TypographyModule', data: { animation: 'typography' }},
	{ path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', data: { animation: 'dashboard' }, canActivate: [AuthGuard]},
	{ path: 'account', loadChildren: './account/account.module#AccountModule', data: { animation: 'account' }, canActivate: [AuthGuard]},
	{ path: 'assign-tariff', loadChildren: './assign-tariff/assign-tariff.module#AssignTariffModule', data: { animation: 'assign-tariff' }, canActivate: [AuthGuard]},
	{ path: 'payments', loadChildren: './payments/payments.module#PaymentsModule', data: { animation: 'payments' }, canActivate: [AuthGuard]},
	{ path: 'reports', loadChildren: './reports/reports.module#ReportsModule', data: { animation: 'reports' }, canActivate: [AuthGuard]},
	{ path: 'invoices', loadChildren: './invoices/invoices.module#InvoicesModule', data: { animation: 'invoices' }, canActivate: [AuthGuard]},
	{ path: 'statements', loadChildren: './statements/statements.module#StatementsModule', data: { animation: 'statements' }, canActivate: [AuthGuard]},
	{ path: 'support', loadChildren: './support/support.module#SupportModule', data: { animation: 'support' }, canActivate: [AuthGuard]},
	{ path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'prefix' },
	{ path: '**', redirectTo: '/auth/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]	
})
export class AppRoutingModule { }
