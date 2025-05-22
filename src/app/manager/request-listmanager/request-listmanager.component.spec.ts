import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestListmanagerComponent } from './request-listmanager.component';

describe('RequestListmanagerComponent', () => {
  let component: RequestListmanagerComponent;
  let fixture: ComponentFixture<RequestListmanagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestListmanagerComponent]
    });
    fixture = TestBed.createComponent(RequestListmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
