import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  Match,
  MatchFilter,
  MatchSort,
  MatchSortField,
  SortDirection,
} from '../../shared/types/graphql';
import { GetMatchesArgs } from '../../shared/types/matches.types';
import { mockMatches } from '../../shared/mocks/mocks';

@Injectable()
export class MatchesService {
  private mockMatches: Match[] = mockMatches;

  private applyFilters(matches: Match[], filter: MatchFilter): Match[] {
    let filtered = matches;

    if (filter?.organizationId) {
      filtered = filtered.filter(
        (match) => match.organization.id === filter?.organizationId,
      );
    }
    if (filter?.grantId) {
      filtered = filtered.filter((match) => match.grant.id === filter?.grantId);
    }
    if (filter?.matchDateFrom) {
      filtered = filtered.filter(
        (match) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          new Date(match?.matchDate) >= new Date(filter?.matchDateFrom),
      );
    }
    if (filter?.matchDateTo) {
      filtered = filtered.filter(
        (match) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          new Date(match?.matchDate) <= new Date(filter?.matchDateTo),
      );
    }
    return filtered;
  }

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

  private applySorting(matches: Match[], sort: MatchSort[]): Match[] {
    return matches.sort((a, b) => {
      let result = 0;
      sort?.forEach(({ field, direction }) => {
        if (result === 0) {
          const comparison = this.compareValues(a, b, field);
          if (comparison !== 0) {
            result = direction === SortDirection.ASC ? comparison : -comparison;
          }
        }
      });
      return result;
    });
  }

  async getMatches({
    matches,
    filter,
    offset,
    sort,
    limit,
  }: GetMatchesArgs): Promise<Match[]> {
    try {
      let filteredMatches = [...matches];

      if (filter) {
        filteredMatches = this.applyFilters(filteredMatches, filter);
      }

      if (sort?.length) {
        filteredMatches = this.applySorting(filteredMatches, sort);
      }

      if (offset !== undefined) {
        filteredMatches = filteredMatches.slice(offset);
      }
      if (limit !== undefined) {
        filteredMatches = filteredMatches.slice(0, limit);
      }

      return filteredMatches;
    } catch (error) {
      console.error('Error in OrganizationsService:', error);
      return [];
    }
  }

  async getMatchById(matches: Match[], matchId: string): Promise<Match> {
    const foundMatch = matches.find((match) => match.id === matchId);
    if (!foundMatch) {
      throw new UnauthorizedException('Match not found or not accessible');
    }
    return foundMatch;
  }
}
