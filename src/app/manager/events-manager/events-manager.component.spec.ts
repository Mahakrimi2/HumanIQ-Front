import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsManagerComponent } from './events-manager.component';

describe('EventsManagerComponent', () => {
  let component: EventsManagerComponent;
  let fixture: ComponentFixture<EventsManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventsManagerComponent]
    });
    fixture = TestBed.createComponent(EventsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
