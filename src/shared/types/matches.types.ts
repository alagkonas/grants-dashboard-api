import { Match, MatchFilter, MatchSort } from './graphql';

export type GetMatchesArgs = {
  matches: Match[];
  filter?: MatchFilter;
  sort?: MatchSort[];
  limit?: number;
  offset?: number;
};
