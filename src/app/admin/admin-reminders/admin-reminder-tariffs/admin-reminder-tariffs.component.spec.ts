import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReminderTariffsComponent } from './admin-reminder-tariffs.component';

describe('AdminReminderTariffsComponent', () => {
  let component: AdminReminderTariffsComponent;
  let fixture: ComponentFixture<AdminReminderTariffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReminderTariffsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReminderTariffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
