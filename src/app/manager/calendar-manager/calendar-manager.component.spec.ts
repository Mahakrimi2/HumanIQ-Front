import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarManagerComponent } from './calendar-manager.component';

describe('CalendarManagerComponent', () => {
  let component: CalendarManagerComponent;
  let fixture: ComponentFixture<CalendarManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarManagerComponent]
    });
    fixture = TestBed.createComponent(CalendarManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
