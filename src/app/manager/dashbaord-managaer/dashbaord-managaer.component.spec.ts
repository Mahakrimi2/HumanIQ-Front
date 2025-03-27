import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbaordManagaerComponent } from './dashbaord-managaer.component';

describe('DashbaordManagaerComponent', () => {
  let component: DashbaordManagaerComponent;
  let fixture: ComponentFixture<DashbaordManagaerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashbaordManagaerComponent]
    });
    fixture = TestBed.createComponent(DashbaordManagaerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
