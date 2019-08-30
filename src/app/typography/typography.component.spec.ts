import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TyphographyComponent } from './typhography.component';

describe('TyphographyComponent', () => {
  let component: TyphographyComponent;
  let fixture: ComponentFixture<TyphographyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyphographyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyphographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
