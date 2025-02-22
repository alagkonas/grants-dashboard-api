import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from '../applications.service';
import {
  ApplicationStatus,
  ApplicationSortField,
  SortDirection,
  Match,
} from '../../../shared/types/graphql';
import { mockOrganizations } from '../../../shared/mocks/mocks';

jest.mock('@nestjs/graphql', () => ({
  registerEnumType: jest.fn(),
}));

export const testOrganizationContext = {
  id: mockOrganizations[0].id,
  name: mockOrganizations[0].name,
};
export const testApplications = [
  {
    id: '1',
    status: ApplicationStatus.PRE_APPLICATION,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    match: {
      id: '1',
      organization: { id: '1' },
      grant: { id: '1', grantName: 'Test Grant' },
      matchDate: '2025-01-01T00:00:00Z',
    },
  },
  {
    id: '2',
    status: ApplicationStatus.IN_PROGRESS,
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-02-01T00:00:00Z',
    match: {
      id: '2',
      organization: { id: '1' },
      grant: { id: '2', grantName: 'Test Grant 2' },
      matchDate: '2025-02-01T00:00:00Z',
    },
  },
];

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationsService],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (service as any).applications = testApplications;
  });

  describe('getApplications', () => {
    it('should return applications for organization', async () => {
      const result = await service.getApplications({
        organizationContext: testOrganizationContext,
      });
      expect(result).toHaveLength(2);
    });

    describe('filtering', () => {
      it('should filter by matchId', async () => {
        const result = await service.getApplications({
          organizationContext: testOrganizationContext,
          filter: { matchId: '1' },
        });
        expect(result).toHaveLength(1);
        expect(result[0].match.id).toBe('1');
      });

      it('should filter by status', async () => {
        const result = await service.getApplications({
          organizationContext: testOrganizationContext,
          filter: { status: ApplicationStatus.IN_PROGRESS },
        });
        expect(result).toHaveLength(1);
        expect(result[0].status).toBe(ApplicationStatus.IN_PROGRESS);
      });

      it('should filter by date range', async () => {
        const result = await service.getApplications({
          organizationContext: testOrganizationContext,
          filter: {
            createdAtFrom: '2025-01-15T00:00:00Z',
            createdAtTo: '2025-02-15T00:00:00Z',
          },
        });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('2');
      });
    });

    describe('sorting', () => {
      it('should sort by created date', async () => {
        const result = await service.getApplications({
          organizationContext: testOrganizationContext,
          sort: [
            {
              field: ApplicationSortField.CREATED_AT,
              direction: SortDirection.DESC,
            },
          ],
        });
        expect(result[0].id).toBe('2');
        expect(result[1].id).toBe('1');
      });
    });
  });

  describe('createApplication', () => {
    it('should create new application', async () => {
      const match = testApplications[0].match;
      const result = await service.createApplication(match as Match);

      expect(result.status).toBe(ApplicationStatus.PRE_APPLICATION);
      expect(result.match).toBe(match);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });
  });

  describe('updateApplicationStatus', () => {
    it('should update application status', async () => {
      const result = await service.updateApplicationStatus(
        testOrganizationContext,
        '1',
        ApplicationStatus.IN_PROGRESS,
      );

      expect(result.status).toBe(ApplicationStatus.IN_PROGRESS);
      expect(result.id).toBe('1');
    });

    it('should throw UnauthorizedException for invalid application', async () => {
      await expect(
        service.updateApplicationStatus(
          testOrganizationContext,
          'invalid-id',
          ApplicationStatus.IN_PROGRESS,
        ),
      ).rejects.toThrow('Application not found or not accessible');
    });
  });
});
