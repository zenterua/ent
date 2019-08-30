import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTariffDetail85bComponent } from './admin-tariff-detail85b.component';

describe('AdminTariffDetail85bComponent', () => {
  let component: AdminTariffDetail85bComponent;
  let fixture: ComponentFixture<AdminTariffDetail85bComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTariffDetail85bComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTariffDetail85bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
