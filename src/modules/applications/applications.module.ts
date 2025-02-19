import { Module } from '@nestjs/common';
import { ApplicationsResolver } from './applications.resolver';
import { ApplicationsService } from './applications.service';

@Module({
  providers: [ApplicationsResolver, ApplicationsService],
})
export class ApplicationsModule {}
