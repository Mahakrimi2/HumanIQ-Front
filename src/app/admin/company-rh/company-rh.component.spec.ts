import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRHComponent } from './company-rh.component';

describe('CompanyRHComponent', () => {
  let component: CompanyRHComponent;
  let fixture: ComponentFixture<CompanyRHComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyRHComponent]
    });
    fixture = TestBed.createComponent(CompanyRHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
