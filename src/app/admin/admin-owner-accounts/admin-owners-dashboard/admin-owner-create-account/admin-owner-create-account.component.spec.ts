import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOwnerCreateAccountComponent } from './admin-owner-create-account.component';

describe('AdminOwnerCreateAccountComponent', () => {
  let component: AdminOwnerCreateAccountComponent;
  let fixture: ComponentFixture<AdminOwnerCreateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOwnerCreateAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOwnerCreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
