import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountsDashboardComponent } from './admin-accounts-dashboard.component';

describe('AdminAccountsDashboardComponent', () => {
  let component: AdminAccountsDashboardComponent;
  let fixture: ComponentFixture<AdminAccountsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccountsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
