import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminImpersonationDashboardComponent } from './admin-impersonation-dashboard.component';

describe('AdminImpersonationDashboardComponent', () => {
  let component: AdminImpersonationDashboardComponent;
  let fixture: ComponentFixture<AdminImpersonationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminImpersonationDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminImpersonationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
