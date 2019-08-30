import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportsDashboardComponent } from './admin-reports-dashboard.component';

describe('AdminReportsDashboardComponent', () => {
  let component: AdminReportsDashboardComponent;
  let fixture: ComponentFixture<AdminReportsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReportsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReportsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
