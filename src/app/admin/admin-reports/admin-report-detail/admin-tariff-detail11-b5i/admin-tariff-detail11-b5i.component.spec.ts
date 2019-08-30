import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTariffDetail11B5iComponent } from './admin-tariff-detail11-b5i.component';

describe('AdminTariffDetail11B5iComponent', () => {
  let component: AdminTariffDetail11B5iComponent;
  let fixture: ComponentFixture<AdminTariffDetail11B5iComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTariffDetail11B5iComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTariffDetail11B5iComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
