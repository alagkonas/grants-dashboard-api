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
import { MatchesService } from '../matches/matches.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Resolver('Application')
export class ApplicationsResolver {
  constructor(
    private applicationsService: ApplicationsService,
    private matchesService: MatchesService,
    private organizationsService: OrganizationsService,
  ) {}

  @Query('getApplications')
  async getApplications(
    @Context('organization') organizationContext: OrganizationContext,
    @Args('filter', { nullable: true, type: () => ApplicationFilterType })
    filter?: ApplicationFilter,
    @Args('sort', { nullable: true, type: () => [ApplicationSortType] })
    sort?: ApplicationSort[],
    @Args('limit', { defaultValue: 20, nullable: true, type: () => Int })
    limit?: number,
    @Args('offset', { defaultValue: 0, nullable: true, type: () => Int })
    offset?: number,
  ): Promise<Application[]> {
    if (!organizationContext?.id) {
      throw new UnauthorizedException('Organization context is required');
    }

    return this.applicationsService.getApplications({
      organizationContext,
      filter,
      sort,
      limit,
      offset,
    });
  }

  @Mutation('createApplication')
  async createApplication(
    @Context('organization') organizationContext: OrganizationContext,
    @Args('matchId') matchId: string,
  ): Promise<Application> {
    if (!organizationContext?.id) {
      throw new UnauthorizedException('Organization context is required');
    }

    const matches =
      await this.organizationsService.getMatchesByOrganizationId(
        organizationContext,
      );

    const match = await this.matchesService.getMatchById(matches, matchId);

    return this.applicationsService.createApplication(match);
  }

  @Mutation('updateApplicationStatus')
  async updateApplicationStatus(
    @Context('organization') organizationContext: OrganizationContext,
    @Args('applicationId') applicationId: string,
    @Args('status') status: ApplicationStatus,
  ): Promise<Application> {
    if (!organizationContext?.id) {
      throw new UnauthorizedException('Organization context is required');
    }
    return this.applicationsService.updateApplicationStatus(
      organizationContext,
      applicationId,
      status,
    );
  }
}
