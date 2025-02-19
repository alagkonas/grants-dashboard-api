import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ApplicationsService } from './applications.service';
import {
  Application,
  ApplicationFilter,
  ApplicationSort,
  ApplicationStatus,
} from '../../shared/types/graphql';
import { ApplicationFilterType } from './classes/application-filter-type';
import { ApplicationSortType } from './classes/application-sort';
import { OrganizationContext } from '../../shared/types/multitenancy-context';
import { UnauthorizedException } from '@nestjs/common';

@Resolver('Application')
export class ApplicationsResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query('getApplications')
  async getApplications(
    @Context('organization') organizationContext: OrganizationContext,
    @Args('filter', { nullable: true, type: () => ApplicationFilterType })
    filter?: ApplicationFilter,
    @Args('sort', { nullable: true, type: () => [ApplicationSortType] })
    sort?: ApplicationSort[],
    @Args('limit', { nullable: true, type: () => Int }) limit?: number,
    @Args('offset', { nullable: true, type: () => Int }) offset?: number,
  ): Promise<Application[]> {
    try {
      console.log('Applications Resolver called with:', {
        filter,
        sort,
        limit,
        offset,
      });

      if (!organizationContext?.id) {
        throw new UnauthorizedException('Organization context is required');
      }

      const applications = await this.applicationsService.getApplications({
        organizationContext,
        filter,
        sort,
        limit,
        offset,
      });
      return applications || [];
    } catch (error) {
      console.error('Error in getApplications:', error);
      return [];
    }
  }

  @Mutation('createApplication')
  async createApplication(
    @Context('organization') organizationContext: OrganizationContext,
    @Args('matchId') matchId: string,
  ): Promise<Application> {
    return this.applicationsService.createApplication(
      organizationContext,
      matchId,
    );
  }

  @Mutation('updateApplicationStatus')
  async updateApplicationStatus(
    @Context('organization') organizationContext: OrganizationContext,
    @Args('applicationId') applicationId: string,
    @Args('status') status: ApplicationStatus,
  ): Promise<Application> {
    return this.applicationsService.updateApplicationStatus(
      organizationContext,
      applicationId,
      status,
    );
  }
}
