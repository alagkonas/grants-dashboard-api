import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsResolver } from '../applications.resolver';
import { ApplicationsService } from '../applications.service';
import { MatchesService } from '../../matches/matches.service';
import { OrganizationsService } from '../../organizations/organizations.service';
import { UnauthorizedException } from '@nestjs/common';
import {
  testApplications,
  testOrganizationContext,
} from './applications.service.spec';
import { ApplicationStatus } from '../../../shared/types/graphql';

describe('ApplicationsResolver', () => {
  let resolver: ApplicationsResolver;
  let applicationsService: ApplicationsService;
  let matchesService: MatchesService;
  let organizationsService: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsResolver,
        {
          provide: ApplicationsService,
          useValue: {
            getApplications: jest.fn().mockResolvedValue(testApplications),
            createApplication: jest.fn(),
            updateApplicationStatus: jest.fn(),
          },
        },
        {
          provide: MatchesService,
          useValue: {
            getMatchById: jest.fn(),
          },
        },
        {
          provide: OrganizationsService,
          useValue: {
            getMatchesByOrganizationId: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ApplicationsResolver>(ApplicationsResolver);
    applicationsService = module.get<ApplicationsService>(ApplicationsService);
    matchesService = module.get<MatchesService>(MatchesService);
    organizationsService =
      module.get<OrganizationsService>(OrganizationsService);
  });

  describe('getApplications', () => {
    it('should throw UnauthorizedException when no organization context', async () => {
      // eslint-disable-next-line
      // @ts-ignore
      await expect(resolver.getApplications(null)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return applications with filters', async () => {
      const filter = { status: ApplicationStatus.IN_PROGRESS };
      await resolver.getApplications(testOrganizationContext, filter);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(applicationsService.getApplications).toHaveBeenCalledWith({
        organizationContext: testOrganizationContext,
        filter,
        sort: undefined,
        limit: undefined,
        offset: undefined,
      });
    });
  });

  describe('createApplication', () => {
    it('should create application for valid match', async () => {
      const matchId = '1';
      const mockMatch = { id: matchId };

      (
        organizationsService.getMatchesByOrganizationId as jest.Mock
      ).mockResolvedValue([mockMatch]);
      (matchesService.getMatchById as jest.Mock).mockResolvedValue(mockMatch);

      await resolver.createApplication(testOrganizationContext, matchId);

      expect(
        // eslint-disable-next-line @typescript-eslint/unbound-method
        organizationsService.getMatchesByOrganizationId,
      ).toHaveBeenCalledWith(testOrganizationContext);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(matchesService.getMatchById).toHaveBeenCalledWith(
        [mockMatch],
        matchId,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(applicationsService.createApplication).toHaveBeenCalledWith(
        mockMatch,
      );
    });
  });

  describe('updateApplicationStatus', () => {
    it('should update application status', async () => {
      const applicationId = '1';
      const newStatus = ApplicationStatus.IN_PROGRESS;

      await resolver.updateApplicationStatus(
        testOrganizationContext,
        applicationId,
        newStatus,
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(applicationsService.updateApplicationStatus).toHaveBeenCalledWith(
        testOrganizationContext,
        applicationId,
        newStatus,
      );
    });
  });
});
