import { Module } from '@nestjs/common';
import { ApplicationsResolver } from './applications.resolver';
import { ApplicationsService } from './applications.service';
import { MatchesModule } from '../matches/matches.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [MatchesModule, OrganizationsModule],
  providers: [ApplicationsResolver, ApplicationsService],
})
export class ApplicationsModule {}
