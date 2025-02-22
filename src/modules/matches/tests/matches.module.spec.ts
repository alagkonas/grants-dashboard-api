import { Test } from '@nestjs/testing';
import { MatchesService } from '../matches.service';
import { MatchesResolver } from '../matches.resolver';
import { MatchesModule } from '../matches.module';

describe('MatchesModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [MatchesModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(MatchesService)).toBeInstanceOf(MatchesService);
    expect(module.get(MatchesResolver)).toBeInstanceOf(MatchesResolver);
  });
});
