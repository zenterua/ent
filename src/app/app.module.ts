import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './_shared/services/auth.interceptor';
import { CanDeactivateGuard } from './_shared/services/protect.guard';

import { RouterUrlService } from './_shared/services/router.url.service';
import { AuthService } from './_shared/services/auth.service';

import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { HeaderModule } from './header/header.module';
import { TariffsModule } from './tariffs/tariffs.module';
import { ReportDetailTemplatesModule } from './reports/report-detail-templates/report-detail-templates.module';
import { ImpersonationHeaderComponent } from './impersonation-header/impersonation-header.component';

@NgModule({
  declarations: [
    AppComponent,
    ImpersonationHeaderComponent
  ],
  imports: [
    BrowserModule,
	AdminModule,  
    AppRoutingModule,
	HeaderModule,  
	TariffsModule,
	ReportDetailTemplatesModule,  
	  
	BrowserAnimationsModule,  
	HttpClientModule
  ],
  providers: [
	    RouterUrlService,
        AuthService,
	    CanDeactivateGuard,
	  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
