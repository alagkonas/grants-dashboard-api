import { Module } from '@nestjs/common';
import { MatchesResolver } from './matches.resolver';
import { MatchesService } from './matches.service';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [OrganizationsModule],
  exports: [MatchesService],
  providers: [MatchesResolver, MatchesService],
})
export class MatchesModule {}
