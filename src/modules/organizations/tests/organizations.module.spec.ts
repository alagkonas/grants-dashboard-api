import { Test } from '@nestjs/testing';
import { OrganizationsModule } from '../organizations.module';
import { OrganizationsService } from '../organizations.service';
import { OrganizationsResolver } from '../organizations.resolver';

describe('OrganizationsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [OrganizationsModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(OrganizationsService)).toBeInstanceOf(
      OrganizationsService,
    );
    expect(module.get(OrganizationsResolver)).toBeInstanceOf(
      OrganizationsResolver,
    );
  });
});
