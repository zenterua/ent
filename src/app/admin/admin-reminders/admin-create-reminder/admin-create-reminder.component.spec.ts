import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateReminderComponent } from './admin-create-reminder.component';

describe('AdminCreateReminderComponent', () => {
  let component: AdminCreateReminderComponent;
  let fixture: ComponentFixture<AdminCreateReminderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCreateReminderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreateReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
