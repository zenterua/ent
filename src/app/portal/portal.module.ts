import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../_shared/shared.module';

import { PortalRoutingModule } from './portal-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { PortalComponent } from './portal.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

import { portalApis } from './portal.apis';

@NgModule({
  declarations: [LoginComponent, ForgotpasswordComponent, ResetpasswordComponent, PortalComponent, RegisterComponent, ConfirmationComponent],
  imports: [
    CommonModule,
    PortalRoutingModule,
	SharedModule  
  ],
  providers: [ 
	portalApis
  ]	
})
export class PortalModule { }
