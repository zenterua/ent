import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTariffDetail11a5eComponent } from './admin-tariff-detail11a5e.component';

describe('AdminTariffDetail11a5eComponent', () => {
  let component: AdminTariffDetail11a5eComponent;
  let fixture: ComponentFixture<AdminTariffDetail11a5eComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTariffDetail11a5eComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTariffDetail11a5eComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
