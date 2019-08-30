import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOwnerEditInfoComponent } from './admin-owner-edit-info.component';

describe('AdminOwnerEditInfoComponent', () => {
  let component: AdminOwnerEditInfoComponent;
  let fixture: ComponentFixture<AdminOwnerEditInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOwnerEditInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOwnerEditInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
