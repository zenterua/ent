import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTariffDetail5bComponent } from './admin-tariff-detail5b.component';

describe('AdminTariffDetail5bComponent', () => {
  let component: AdminTariffDetail5bComponent;
  let fixture: ComponentFixture<AdminTariffDetail5bComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTariffDetail5bComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTariffDetail5bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
