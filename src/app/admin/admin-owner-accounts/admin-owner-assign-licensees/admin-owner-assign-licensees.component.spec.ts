import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOwnerAssignLicenseesComponent } from './admin-owner-assign-licensees.component';

describe('AdminOwnerAssignLicenseesComponent', () => {
  let component: AdminOwnerAssignLicenseesComponent;
  let fixture: ComponentFixture<AdminOwnerAssignLicenseesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOwnerAssignLicenseesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOwnerAssignLicenseesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
