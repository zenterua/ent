import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTariffDetail4a15jComponent } from './admin-tariff-detail4a15j.component';

describe('AdminTariffDetail4a15jComponent', () => {
  let component: AdminTariffDetail4a15jComponent;
  let fixture: ComponentFixture<AdminTariffDetail4a15jComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTariffDetail4a15jComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTariffDetail4a15jComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
