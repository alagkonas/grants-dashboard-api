import { MatchFilter, MatchSort } from './graphql';
import { OrganizationContext } from './multitenancy-context';

export type GetMatchesArgs = {
  organizationContext: OrganizationContext;
  filter?: MatchFilter;
  sort?: MatchSort[];
  limit?: number;
  offset?: number;
};
