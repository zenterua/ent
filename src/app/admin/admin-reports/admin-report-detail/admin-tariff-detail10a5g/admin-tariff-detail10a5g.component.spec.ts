import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTariffDetail10a5gComponent } from './admin-tariff-detail10a5g.component';

describe('AdminTariffDetail10a5gComponent', () => {
  let component: AdminTariffDetail10a5gComponent;
  let fixture: ComponentFixture<AdminTariffDetail10a5gComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTariffDetail10a5gComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTariffDetail10a5gComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
