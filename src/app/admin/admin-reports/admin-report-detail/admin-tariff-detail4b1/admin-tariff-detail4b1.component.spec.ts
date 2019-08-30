import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTariffDetail4b1Component } from './admin-tariff-detail4b1.component';

describe('AdminTariffDetail4b1Component', () => {
  let component: AdminTariffDetail4b1Component;
  let fixture: ComponentFixture<AdminTariffDetail4b1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTariffDetail4b1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTariffDetail4b1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
