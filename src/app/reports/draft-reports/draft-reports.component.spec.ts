import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftReportsComponent } from './draft-reports.component';

describe('DraftReportsComponent', () => {
  let component: DraftReportsComponent;
  let fixture: ComponentFixture<DraftReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
