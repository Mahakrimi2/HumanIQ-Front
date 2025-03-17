import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayRequestComponent } from './holiday-request.component';

describe('HolidayRequestComponent', () => {
  let component: HolidayRequestComponent;
  let fixture: ComponentFixture<HolidayRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HolidayRequestComponent]
    });
    fixture = TestBed.createComponent(HolidayRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
