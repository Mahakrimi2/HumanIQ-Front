import { TestBed } from '@angular/core/testing';

import { PointageServiceService } from '../services/pointage-service.service';

describe('PointageServiceService', () => {
  let service: PointageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
