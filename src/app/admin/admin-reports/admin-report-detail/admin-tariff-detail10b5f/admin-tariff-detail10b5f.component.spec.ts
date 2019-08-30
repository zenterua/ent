import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTariffDetail10b5fComponent } from './admin-tariff-detail10b5f.component';

describe('AdminTariffDetail10b5fComponent', () => {
  let component: AdminTariffDetail10b5fComponent;
  let fixture: ComponentFixture<AdminTariffDetail10b5fComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTariffDetail10b5fComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTariffDetail10b5fComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
