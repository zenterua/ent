import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReminderDetailComponent } from './admin-reminder-detail.component';

describe('AdminReminderDetailComponent', () => {
  let component: AdminReminderDetailComponent;
  let fixture: ComponentFixture<AdminReminderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReminderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReminderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
