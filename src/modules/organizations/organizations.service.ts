import { Injectable } from '@nestjs/common';
import { Match, Organization } from '../../shared/types/graphql';
import { OrganizationContext } from '../../shared/types/multitenancy-context';
import { mockOrganizations } from '../../shared/mocks/mocks';

@Injectable()
export class OrganizationsService {
  private mockOrganizations: Organization[] = mockOrganizations;

  async getOrganizations(): Promise<Organization[]> {
    return [...this.mockOrganizations];
  }

  async getMatchesByOrganizationId(
    organizationContext: OrganizationContext,
  ): Promise<Match[]> {
    const organizations = await this.getOrganizations();
    return (
      organizations.find(
        (organization) => organization.id === organizationContext.id,
      )?.matches ?? []
    );
  }
}
