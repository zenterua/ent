import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminAuthRoutingModule } from './admin-auth-routing.module';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminForgotPasswordComponent } from './admin-forgot-password/admin-forgot-password.component';
import {SharedModule} from '../../_shared/shared.module';
import { AdminResetPasswordComponent } from './admin-reset-password/admin-reset-password.component';
import {AdminAuthService} from './admin-auth.service';

@NgModule({
  declarations: [AdminLoginComponent, AdminForgotPasswordComponent, AdminResetPasswordComponent],
  imports: [
    CommonModule,
    AdminAuthRoutingModule,
    SharedModule
  ],
  providers: [
    AdminAuthService
  ]
})
export class AdminAuthModule { }
