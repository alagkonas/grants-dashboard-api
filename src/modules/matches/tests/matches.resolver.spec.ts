import { Test, TestingModule } from '@nestjs/testing';
import { MatchesResolver } from '../matches.resolver';
import { MatchesService } from '../matches.service';
import { OrganizationsService } from '../../organizations/organizations.service';
import { UnauthorizedException } from '@nestjs/common';
import { mockOrganizations } from '../../../shared/mocks/mocks';
import { MatchSortField, SortDirection } from '../../../shared/types/graphql';
import { testMatches } from './matches.service.spec';

describe('MatchesResolver', () => {
  let resolver: MatchesResolver;
  let matchesService: MatchesService;
  let organizationsService: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesResolver,
        {
          provide: MatchesService,
          useValue: {
            getMatches: jest.fn().mockResolvedValue(testMatches),
            getMatchById: jest.fn(),
          },
        },
        {
          provide: OrganizationsService,
          useValue: {
            getMatchesByOrganizationId: jest
              .fn()
              .mockResolvedValue(testMatches),
          },
        },
      ],
    }).compile();

    resolver = module.get<MatchesResolver>(MatchesResolver);
    matchesService = module.get<MatchesService>(MatchesService);
    organizationsService =
      module.get<OrganizationsService>(OrganizationsService);
  });

  describe('getMatches', () => {
    const orgContext = {
      id: mockOrganizations[0].id,
      name: mockOrganizations[0].name,
    };

    it('should throw UnauthorizedException when no organization context', async () => {
      // eslint-disable-next-line
      // @ts-ignore
      await expect(resolver.getMatches(null)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should get matches for organization', async () => {
      const result = await resolver.getMatches(orgContext);
      expect(
        // eslint-disable-next-line @typescript-eslint/unbound-method
        organizationsService.getMatchesByOrganizationId,
      ).toHaveBeenCalledWith(orgContext);
      expect(result).toEqual(testMatches);
    });

    it('should apply filters and sorting', async () => {
      const filter = { organizationId: '1' };
      const sort = [
        { field: MatchSortField.MATCH_DATE, direction: SortDirection.DESC },
      ];

      await resolver.getMatches(orgContext, filter, sort);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(matchesService.getMatches).toHaveBeenCalledWith({
        matches: testMatches,
        filter,
        sort,
        limit: undefined,
        offset: undefined,
      });
    });
  });
});
