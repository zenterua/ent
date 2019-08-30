import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOwnerDetailComponent } from './admin-owner-detail.component';

describe('AdminOwnerDetailComponent', () => {
  let component: AdminOwnerDetailComponent;
  let fixture: ComponentFixture<AdminOwnerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOwnerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOwnerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
