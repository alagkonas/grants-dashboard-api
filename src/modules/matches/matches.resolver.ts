import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { MatchesService } from './matches.service';
import { Match, MatchFilter, MatchSort } from '../../shared/types/graphql';
import { MatchFilterType } from '../../shared/classes/filter-type';
import { MatchSortType } from '../../shared/classes/match-sort';

@Resolver('Match')
export class MatchesResolver {
  constructor(private readonly matchesService: MatchesService) {}

  @Query('getMatches')
  async getMatches(
    @Args('filter', { nullable: true, type: () => MatchFilterType })
    filter?: MatchFilter,
    @Args('sort', { nullable: true, type: () => [MatchSortType] })
    sort?: MatchSort[],
    @Args('limit', { nullable: true, type: () => Int }) limit?: number,
    @Args('offset', { nullable: true, type: () => Int }) offset?: number,
  ): Promise<Match[]> {
    try {
      console.log('Resolver called with:', { filter, sort, limit, offset });
      const matches = await this.matchesService.getMatches(
        filter,
        sort,
        limit,
        offset, // add default offset to 0 in the query at FE
      );
      return matches || [];
    } catch (error) {
      console.error('Error in getMatches:', error);
      return [];
    }
  }
}
