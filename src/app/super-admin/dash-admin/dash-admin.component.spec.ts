import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashAdminComponent } from './dash-admin.component';

describe('DashAdminComponent', () => {
  let component: DashAdminComponent;
  let fixture: ComponentFixture<DashAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashAdminComponent]
    });
    fixture = TestBed.createComponent(DashAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
