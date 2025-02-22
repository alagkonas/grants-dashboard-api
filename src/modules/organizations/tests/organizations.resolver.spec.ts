import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsResolver } from '../organizations.resolver';
import { OrganizationsService } from '../organizations.service';

describe('OrganizationsResolver', () => {
  let resolver: OrganizationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsResolver,
        {
          provide: OrganizationsService,
          useValue: {
            getOrganizations: jest.fn(),
            getMatchesByOrganizationId: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<OrganizationsResolver>(OrganizationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
