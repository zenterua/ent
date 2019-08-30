import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminLoginComponent} from './admin-login/admin-login.component';
import {AdminForgotPasswordComponent} from './admin-forgot-password/admin-forgot-password.component';
import {AdminResetPasswordComponent} from './admin-reset-password/admin-reset-password.component';
import {AdminRedirectGuard} from './admin-redirect.guard';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: AdminLoginComponent, data: { animation: 'login' }, canActivate: [AdminRedirectGuard]},
  {path: 'forgotpassword', component: AdminForgotPasswordComponent, data: {animation: 'forgotpassword'}, canActivate: [AdminRedirectGuard]},
  {path: 'resetpassword', component: AdminResetPasswordComponent, data: {animation: 'resetpassword'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAuthRoutingModule { }
