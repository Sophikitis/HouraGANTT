import { TestBed, inject } from '@angular/core/testing';

import { RessourcesService } from './ressources.service';

describe('RessourcesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RessourcesService]
    });
  });

  it('should be created', inject([RessourcesService], (service: RessourcesService) => {
    expect(service).toBeTruthy();
  }));
});
