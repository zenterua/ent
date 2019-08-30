import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaymentHistoryDashboardComponent } from './admin-payment-history-dashboard.component';

describe('AdminPaymentHistoryDashboardComponent', () => {
  let component: AdminPaymentHistoryDashboardComponent;
  let fixture: ComponentFixture<AdminPaymentHistoryDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPaymentHistoryDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPaymentHistoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
