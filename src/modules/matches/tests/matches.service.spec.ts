import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from '../matches.service';
import {
  Match,
  MatchSortField,
  SortDirection,
} from '../../../shared/types/graphql';

export const testMatches: Match[] = [
  {
    id: '1',
    matchDate: '2025-01-01T00:00:00Z',
    grant: {
      id: '1',
      grantName: 'Alpha Grant',
      foundationName: 'Alpha Foundation',
      avgAmount: 10000,
      deadline: '2025-03-01T00:00:00Z',
      updateDate: '2025-01-01T00:00:00Z',
    },
    organization: {
      id: '1',
      name: 'Org Alpha',
    },
    applications: [],
  },
  {
    id: '2',
    matchDate: '2025-02-01T00:00:00Z',
    grant: {
      id: '2',
      grantName: 'Beta Grant',
      foundationName: 'Beta Foundation',
      avgAmount: 20000,
      deadline: '2025-04-01T00:00:00Z',
      updateDate: '2025-02-01T00:00:00Z',
    },
    organization: {
      id: '2',
      name: 'Org Beta',
    },
    applications: [],
  },
];

describe('MatchesService', () => {
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchesService],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  describe('getMatches', () => {
    it('should return all matches when no filters or sorts are applied', async () => {
      const result = await service.getMatches({ matches: testMatches });
      expect(result).toHaveLength(testMatches.length);
      expect(result).toEqual(testMatches);
    });

    describe('filtering', () => {
      it('should filter by organizationId', async () => {
        const result = await service.getMatches({
          matches: testMatches,
          filter: { organizationId: '1' },
        });
        expect(result).toHaveLength(1);
        expect(result[0].organization.id).toBe('1');
      });

      it('should filter by grantId', async () => {
        const result = await service.getMatches({
          matches: testMatches,
          filter: { grantId: '2' },
        });
        expect(result).toHaveLength(1);
        expect(result[0].grant.id).toBe('2');
      });

      it('should filter by date range', async () => {
        const result = await service.getMatches({
          matches: testMatches,
          filter: {
            matchDateFrom: '2025-01-15T00:00:00Z',
            matchDateTo: '2025-02-15T00:00:00Z',
          },
        });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('2');
      });
    });

    describe('sorting', () => {
      it('should sort by match date', async () => {
        const result = await service.getMatches({
          matches: testMatches,
          sort: [
            { field: MatchSortField.MATCH_DATE, direction: SortDirection.DESC },
          ],
        });
        expect(result[0].id).toBe('2');
        expect(result[1].id).toBe('1');
      });

      it('should sort by grant name', async () => {
        const result = await service.getMatches({
          matches: testMatches,
          sort: [
            { field: MatchSortField.GRANT_NAME, direction: SortDirection.ASC },
          ],
        });
        expect(result[0].grant.grantName).toBe('Alpha Grant');
        expect(result[1].grant.grantName).toBe('Beta Grant');
      });
    });

    describe('pagination', () => {
      it('should apply offset and limit', async () => {
        const result = await service.getMatches({
          matches: testMatches,
          offset: 1,
          limit: 1,
        });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('2');
      });
    });
  });

  describe('getMatchById', () => {
    it('should return match by id', async () => {
      const result = await service.getMatchById(testMatches, '1');
      expect(result.id).toBe('1');
    });

    it('should throw UnauthorizedException when match not found', async () => {
      await expect(
        service.getMatchById(testMatches, 'invalid'),
      ).rejects.toThrow();
    });
  });
});
