import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSelectTerritoriesComponent } from './admin-select-territories.component';

describe('AdminSelectTerritoriesComponent', () => {
  let component: AdminSelectTerritoriesComponent;
  let fixture: ComponentFixture<AdminSelectTerritoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSelectTerritoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSelectTerritoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
