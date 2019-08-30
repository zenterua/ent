import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordHintComponent } from './password-hint.component';

describe('PasswordHintComponent', () => {
  let component: PasswordHintComponent;
  let fixture: ComponentFixture<PasswordHintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordHintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
