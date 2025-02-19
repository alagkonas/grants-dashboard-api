import { Injectable } from '@nestjs/common';
import {
  Match,
  MatchFilter,
  MatchSort,
  MatchSortField,
  SortDirection,
} from '../../shared/types/graphql';
import { mockMatches } from './mock';

@Injectable()
export class MatchesService {
  private mockMatches: Match[] = mockMatches;

  private compareValues = (
    a: Match,
    b: Match,
    field: MatchSortField,
  ): number => {
    switch (field) {
      case MatchSortField.MATCH_DATE:
        return (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
        );
      case MatchSortField.GRANT_NAME:
        return a.grant.grantName.localeCompare(b.grant.grantName);
      case MatchSortField.ORGANIZATION_NAME:
        return a.organization.name.localeCompare(b.organization.name);
      default:
        return 0;
    }
  };

  async getMatches(
    filter?: MatchFilter,
    sort?: MatchSort[],
    limit?: number,
    offset?: number,
  ): Promise<Match[]> {
    try {
      let matches = [...this.mockMatches];

      if (filter) {
        if (filter?.grantId) {
          matches = matches.filter(
            (match) => match.grant.id === filter?.grantId,
          );
        }
        if (filter?.matchDateFrom) {
          console.log('FILTER FROM: ', filter?.matchDateFrom);
          matches = matches.filter(
            (match) =>
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              new Date(match?.matchDate) >= new Date(filter?.matchDateFrom),
          );
        }
        if (filter?.matchDateTo) {
          matches = matches.filter(
            (match) =>
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              new Date(match?.matchDate) <= new Date(filter?.matchDateTo),
          );
        }
      }

      if (sort?.length) {
        matches = matches.sort((a, b) => {
          let result = 0;

          sort?.forEach(({ field, direction }) => {
            if (result === 0) {
              const comparison = this.compareValues(a, b, field);
              if (comparison !== 0) {
                result =
                  direction === SortDirection.ASC ? comparison : -comparison;
              }
            }
          });

          return result;
        });
      }

      if (offset !== undefined) {
        matches = matches.slice(offset);
      }
      if (limit !== undefined) {
        matches = matches.slice(0, limit);
      }

      return matches;
    } catch (error) {
      console.error('Error in MatchesService:', error);
      return [];
    }
  }
}
