import { Resolver, Query, Args, Int, Context } from '@nestjs/graphql';
import { MatchesService } from './matches.service';
import { Match, MatchFilter, MatchSort } from '../../shared/types/graphql';
import { MatchFilterType } from './classes/match-filter-type';
import { MatchSortType } from './classes/match-sort';
import { OrganizationContext } from '../../shared/types/multitenancy-context';
import { UnauthorizedException } from '@nestjs/common';
import { OrganizationsService } from '../organizations/organizations.service';

@Resolver('Match')
export class MatchesResolver {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Query('getMatches')
  async getMatches(
    @Context('organization') organizationContext: OrganizationContext,
    @Args('filter', { nullable: true, type: () => MatchFilterType })
    filter?: MatchFilter,
    @Args('sort', { nullable: true, type: () => [MatchSortType] })
    sort?: MatchSort[],
    @Args('limit', { defaultValue: 20, nullable: true, type: () => Int })
    limit?: number,
    @Args('offset', { defaultValue: 0, nullable: true, type: () => Int })
    offset?: number,
  ): Promise<Match[]> {
    if (!organizationContext?.id) {
      throw new UnauthorizedException('Organization context is required');
    }

    const matches =
      await this.organizationsService.getMatchesByOrganizationId(
        organizationContext,
      );

    return await this.matchesService.getMatches({
      matches,
      filter,
      sort,
      limit,
      offset,
    });
  }
}
