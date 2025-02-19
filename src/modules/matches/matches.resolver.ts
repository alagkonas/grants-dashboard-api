import { Resolver, Query, Args, Int, Context } from '@nestjs/graphql';
import { MatchesService } from './matches.service';
import { Match, MatchFilter, MatchSort } from '../../shared/types/graphql';
import { MatchFilterType } from './classes/match-filter-type';
import { MatchSortType } from './classes/match-sort';
import { OrganizationContext } from '../../shared/types/multitenancy-context';
import { UnauthorizedException } from '@nestjs/common';

@Resolver('Match')
export class MatchesResolver {
  constructor(private readonly matchesService: MatchesService) {}

  @Query('getMatches')
  async getMatches(
    @Context('organization') organizationContext: OrganizationContext,
    @Args('filter', { nullable: true, type: () => MatchFilterType })
    filter?: MatchFilter,
    @Args('sort', { nullable: true, type: () => [MatchSortType] })
    sort?: MatchSort[],
    @Args('limit', { nullable: true, type: () => Int }) limit?: number,
    @Args('offset', { nullable: true, type: () => Int }) offset?: number,
  ): Promise<Match[]> {
    if (!organizationContext?.id) {
      throw new UnauthorizedException('Organization context is required');
    }

    return await this.matchesService.getMatches({
      organizationContext,
      filter,
      sort,
      limit,
      offset, // TODO: investigate why filtering doesnt work for some cases when not "offset" field is passed
    });
  }
}
