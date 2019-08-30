import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOwnersDashboardComponent } from './admin-owners-dashboard.component';

describe('AdminOwnersDashboardComponent', () => {
  let component: AdminOwnersDashboardComponent;
  let fixture: ComponentFixture<AdminOwnersDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOwnersDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOwnersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
