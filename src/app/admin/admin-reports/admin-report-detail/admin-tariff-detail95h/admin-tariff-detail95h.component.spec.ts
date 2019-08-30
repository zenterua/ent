import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTariffDetail95hComponent } from './admin-tariff-detail95h.component';

describe('AdminTariffDetail95hComponent', () => {
  let component: AdminTariffDetail95hComponent;
  let fixture: ComponentFixture<AdminTariffDetail95hComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTariffDetail95hComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTariffDetail95hComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
