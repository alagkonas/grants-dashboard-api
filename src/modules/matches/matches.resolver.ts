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
    try {
      console.log('Resolver called with:', {
        organizationContext,
        filter,
        sort,
        limit,
        offset,
      });
      if (!organizationContext?.id) {
        throw new UnauthorizedException('Organization context is required');
      }

      const matches = await this.matchesService.getMatches({
        organizationContext,
        filter,
        sort,
        limit,
        offset, // add default offset to 0 in the query at FE
      });
      return matches || [];
    } catch (error) {
      console.error('Error in getMatches:', error);
      return [];
    }
  }
}
