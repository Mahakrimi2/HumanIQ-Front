import { TestBed } from '@angular/core/testing';

import { PointageNotificationServiceService } from './pointage-notification-service.service';

describe('PointageNotificationServiceService', () => {
  let service: PointageNotificationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointageNotificationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
