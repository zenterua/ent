import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditAccountComponent } from './admin-edit-account.component';

describe('AdminEditAccountComponent', () => {
  let component: AdminEditAccountComponent;
  let fixture: ComponentFixture<AdminEditAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
