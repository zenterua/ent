import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTariffComponent } from './assign-tariff.component';

describe('AssignTariffComponent', () => {
  let component: AssignTariffComponent;
  let fixture: ComponentFixture<AssignTariffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignTariffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
