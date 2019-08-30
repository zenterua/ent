import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';
import { HeaderComponent } from '../header/header.component';

import { AuthService } from '../_shared/services/auth.service';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
	SharedModule  
  ],
  exports:[HeaderComponent],
  providers: [ 
	AuthService
  ]
})
export class HeaderModule { }
