import { Test } from '@nestjs/testing';
import { ApplicationsService } from '../applications.service';
import { ApplicationsResolver } from '../applications.resolver';
import { ApplicationsModule } from '../applications.module';

describe('ApplicationsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [ApplicationsModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(ApplicationsService)).toBeInstanceOf(ApplicationsService);
    expect(module.get(ApplicationsResolver)).toBeInstanceOf(
      ApplicationsResolver,
    );
  });
});
