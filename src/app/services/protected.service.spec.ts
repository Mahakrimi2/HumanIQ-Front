import { TestBed } from '@angular/core/testing';

import { ProtectedService } from './protected.service';

describe('ProtectedService', () => {
  let service: ProtectedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtectedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
