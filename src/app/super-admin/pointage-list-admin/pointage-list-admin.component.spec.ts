import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointageListAdminComponent } from './pointage-list-admin.component';

describe('PointageListAdminComponent', () => {
  let component: PointageListAdminComponent;
  let fixture: ComponentFixture<PointageListAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PointageListAdminComponent]
    });
    fixture = TestBed.createComponent(PointageListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
