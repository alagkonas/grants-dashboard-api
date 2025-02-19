import { Module } from '@nestjs/common';
import { MatchesResolver } from './matches.resolver';
import { MatchesService } from './matches.service';

@Module({
  exports: [MatchesService],
  providers: [MatchesResolver, MatchesService],
})
export class MatchesModule {}
