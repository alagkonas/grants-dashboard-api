import { Module } from '@nestjs/common';
import { ApplicationsResolver } from './applications.resolver';
import { ApplicationsService } from './applications.service';
import { MatchesModule } from '../matches/matches.module';

@Module({
  imports: [MatchesModule],
  providers: [ApplicationsResolver, ApplicationsService],
})
export class ApplicationsModule {}
