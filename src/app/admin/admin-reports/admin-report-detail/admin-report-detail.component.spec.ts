import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportDetailComponent } from './admin-report-detail.component';

describe('AdminReportDetailComponent', () => {
  let component: AdminReportDetailComponent;
  let fixture: ComponentFixture<AdminReportDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReportDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
