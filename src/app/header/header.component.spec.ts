import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { HeaderComponent } from './header.component';
import { PopupComponent } from '../_shared/components/popup/popup.component';
import { SlideToggleComponent } from '../_shared/components/slide-toggle/slide-toggle.component';
import { AuthService } from '../_shared/services/auth.service';
import { ApiDataService } from '../_shared/services/api.service'; 

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let debugElement;
  let data = {};     
  let authService:AuthService;
  let apiService:ApiDataService;
  let logout: jasmine.Spy;
  let spyInfo: jasmine.Spy;     
  let isLogged;
  let AuthServiceStub = {
      logout:() => of(true),
      getToken:() => of(''),
  };
  let apiServiceStub = {
      appInfo:() => of('')
  };      
    
    
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent, PopupComponent, SlideToggleComponent ],
      imports: [ CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, RouterTestingModule, BrowserAnimationsModule ],
      providers: [
          { provide: AuthService, useValue: AuthServiceStub },
          { provide: apiService, useValue: apiServiceStub }
      ],
      schemas: [
          NO_ERRORS_SCHEMA,
          CUSTOM_ELEMENTS_SCHEMA  
      ]    
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    authService = debugElement.injector.get(AuthService); 
    apiService = debugElement.injector.get(ApiDataService); 
    spyInfo = spyOn(apiService, 'appInfo').and.returnValue(of(data));
    fixture.detectChanges();
  });
    
  afterAll(() => {
      debugElement.nativeElement.remove();
  });     

  it('should create', () => {
      expect(component).toBeTruthy();
  });
    
  it('should get user first and last name', () => {
     expect(spyInfo).toHaveBeenCalled(); 
  });    
    
  it('should open user menu', () => {
      debugElement.query(By.css('.header-right-entry .icon .text')).nativeElement.click();   
      expect(component.userMenuOpened).toBe(true);
  }); 
    
  it('should open logout popup', () => {
      debugElement.query(By.css('.header-right-entry .icon .text')).nativeElement.click();   
      expect(component.userMenuOpened).toBe(true);
      debugElement.query(By.css('#logout')).nativeElement.click();
      expect(component.logoutPopupOpened).toBe(true);
  });
    
  it('should do logout', () => {
      logout = spyOn(authService, 'logout').and.returnValue(of(true));
      debugElement.query(By.css('app-popup .btn-wrapper .btn.color')).nativeElement.click();
      expect(logout).toHaveBeenCalled();
  });
    
  it('should open mobile menu', () => {
      debugElement.query(By.css('#hamburger')).nativeElement.click();
      expect(component.rsMenuOpened).toBe(true);
  });  
    
  
    
});
