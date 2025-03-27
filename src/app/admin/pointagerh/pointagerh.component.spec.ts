import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointagerhComponent } from './pointagerh.component';

describe('PointagerhComponent', () => {
  let component: PointagerhComponent;
  let fixture: ComponentFixture<PointagerhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PointagerhComponent]
    });
    fixture = TestBed.createComponent(PointagerhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
