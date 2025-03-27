import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointageListComponent } from './pointage-list.component';

describe('PointageListComponent', () => {
  let component: PointageListComponent;
  let fixture: ComponentFixture<PointageListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PointageListComponent]
    });
    fixture = TestBed.createComponent(PointageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
