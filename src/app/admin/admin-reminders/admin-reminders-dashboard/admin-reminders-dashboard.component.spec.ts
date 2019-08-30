import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRemindersDashboardComponent } from './admin-reminders-dashboard.component';

describe('AdminRemindersDashboardComponent', () => {
  let component: AdminRemindersDashboardComponent;
  let fixture: ComponentFixture<AdminRemindersDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRemindersDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRemindersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
