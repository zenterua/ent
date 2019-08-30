import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../_shared/services/auth.service';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugElement;
  let email = 'test@mail.com';    
  let password = 'aaa@A12321';
  let AuthServiceStub = {
      logout:() => of(''),
      getToken:() => of(''),
  };     
    
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, RouterTestingModule, BrowserAnimationsModule ],
      providers: [
          { provide: AuthService, useValue: AuthServiceStub }
      ]    
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;   
    fixture.detectChanges();
  });
    
  afterAll(() => {
    debugElement.nativeElement.remove();
  });    

  it('should create', () => {
    expect(component).toBeTruthy();
  });
     
  it('should email valid', () => {
    component.componentForm.get('email').setValue(email);  
    expect(component.componentForm.get('email').valid).toBe(true);
    component.componentForm.get('email').setValue('email.test');  
    expect(component.componentForm.get('email').valid).toBe(false);  
  });     
    
  it('should password not empty', () => {
    component.componentForm.get('password').setValue(password);    
    expect(component.componentForm.get('password').valid).toBe(true); 
    component.componentForm.get('password').setValue(null);    
    expect(component.componentForm.get('password').valid).toBe(false);
  });
    
  it('should login form is valid', () => {
    component.componentForm.get('email').setValue(email);
    component.componentForm.get('password').setValue(password);   
    expect(component.componentForm.valid).toBe(true); 
    component.componentForm.get('email').setValue('email.test');
    component.componentForm.get('password').setValue(null);
    expect(component.componentForm.valid).toBe(false);  
  }); 
    
  it('should Remember Me is checked', () => {
    debugElement.query(By.css('input[formControlName="remember"]')).triggerEventHandler('click'); 
    expect(component.componentForm.get('remember').valid).toBe(true);  
  });     
    
});
