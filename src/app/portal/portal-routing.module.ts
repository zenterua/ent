import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortalComponent } from './portal.component';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { RedirectGuard } from '../_shared/services/redirect.guard';
import { RegisterComponent } from './register/register.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

const routes: Routes = [
    { path: '', component:PortalComponent,   
    children: [
        { path: 'login', component: LoginComponent, canActivate: [RedirectGuard] },
        { path: 'forgotpassword', component: ForgotpasswordComponent, canActivate: [RedirectGuard] },
        { path: 'resetpassword', component: ResetpasswordComponent, canActivate: [RedirectGuard] },
        { path: 'confirmation', component: ConfirmationComponent, canActivate: [RedirectGuard] },
        { path: 'register', component: RegisterComponent, canActivate: [RedirectGuard] },
		{ path: '', redirectTo: '/auth/login', pathMatch: 'full' },
     ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
