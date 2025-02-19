import { OrganizationContext } from './multitenancy-context';
import { ApplicationFilter, ApplicationSort } from './graphql';

export type GetApplicationsArgs = {
  organizationContext: OrganizationContext;
  filter?: ApplicationFilter;
  sort?: ApplicationSort[];
  limit?: number;
  offset?: number;
};
