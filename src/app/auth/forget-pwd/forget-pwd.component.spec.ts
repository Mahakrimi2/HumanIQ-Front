import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPwdComponent } from './forget-pwd.component';

describe('ForgetPwdComponent', () => {
  let component: ForgetPwdComponent;
  let fixture: ComponentFixture<ForgetPwdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetPwdComponent]
    });
    fixture = TestBed.createComponent(ForgetPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
