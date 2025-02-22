import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from '../organizations.service';
import { mockOrganizations } from '../../../shared/mocks/mocks';

describe('OrganizationsService', () => {
  let service: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationsService],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  describe('getOrganizations', () => {
    it('should return all organizations', async () => {
      const result = await service.getOrganizations();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBeTruthy();
      expect(result).toEqual(mockOrganizations);
    });

    it('should return a copy of organizations array', async () => {
      const result = await service.getOrganizations();
      expect(result).not.toBe(mockOrganizations);
    });
  });

  describe('getMatchesByOrganizationId', () => {
    it('should return matches for valid organization id', async () => {
      const orgId = mockOrganizations[0].id;
      const orgName = mockOrganizations[0].name;
      const result = await service.getMatchesByOrganizationId({
        id: orgId,
        name: orgName,
      });
      expect(result).toEqual(mockOrganizations[0].matches);
    });

    it('should return empty array for invalid organization id', async () => {
      const result = await service.getMatchesByOrganizationId({
        id: 'random-id',
        name: 'random-name',
      });
      expect(result).toEqual([]);
    });

    it('should handle undefined matches property', async () => {
      const orgWithoutMatches = { ...mockOrganizations[0], matches: undefined };
      jest
        .spyOn(service, 'getOrganizations')
        .mockResolvedValue([orgWithoutMatches]);

      const result = await service.getMatchesByOrganizationId({
        id: orgWithoutMatches.id,
        name: orgWithoutMatches.name,
      });
      expect(result).toEqual([]);
    });
  });
});
