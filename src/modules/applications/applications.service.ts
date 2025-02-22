import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  Application,
  ApplicationFilter,
  ApplicationSort,
  ApplicationSortField,
  ApplicationStatus,
  Match,
  SortDirection,
} from '../../shared/types/graphql';
import { GetApplicationsArgs } from '../../shared/types/applications.types';
import { OrganizationContext } from '../../shared/types/multitenancy-context';
import { mockApplications } from '../../shared/mocks/mocks';

@Injectable()
export class ApplicationsService {
  private applications: Application[] = mockApplications;

  private applyFilters(
    applications: Application[],
    filter: ApplicationFilter,
  ): Application[] {
    let filtered = applications;

    if (filter.matchId) {
      filtered = filtered.filter((app) => app.match.id === filter.matchId);
    }

    if (filter.status) {
      filtered = filtered.filter((app) => app.status === filter.status);
    }

    if (filter.createdAtFrom) {
      filtered = filtered.filter(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        (app) => new Date(app.createdAt) >= new Date(filter.createdAtFrom),
      );
    }

    if (filter.createdAtTo) {
      filtered = filtered.filter(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        (app) => new Date(app.createdAt) <= new Date(filter.createdAtTo),
      );
    }

    return filtered;
  }

  private compareValues = (
    a: Application,
    b: Application,
    field: ApplicationSortField,
  ): number => {
    switch (field) {
      case ApplicationSortField.CREATED_AT:
        return (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case ApplicationSortField.UPDATED_AT:
        return (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
      case ApplicationSortField.STATUS:
        return (a.status as string).localeCompare(b.status as string);
      default:
        return 0;
    }
  };

  private applySorting(
    applications: Application[],
    sort: ApplicationSort[],
  ): Application[] {
    return applications.sort((a, b) => {
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

  private async getApplicationsByOrganizationId(
    organizationContext: OrganizationContext,
  ): Promise<Application[]> {
    return [...this.applications].filter(
      (application) =>
        application.match.organization.id === organizationContext.id,
    );
  }

  private async getApplicationById(
    organizationContext: OrganizationContext,
    applicationId: string,
  ): Promise<Application> {
    const applications =
      await this.getApplicationsByOrganizationId(organizationContext);
    const foundApplication = applications.find(
      (application) => application.id === applicationId,
    );
    if (!foundApplication) {
      throw new UnauthorizedException(
        'Application not found or not accessible',
      );
    }
    return foundApplication;
  }

  async getApplications({
    organizationContext,
    offset = 0, // assuming default first page
    sort,
    limit = 20, // assuming default page size
    filter,
  }: GetApplicationsArgs): Promise<Application[]> {
    try {
      let filteredApplications =
        await this.getApplicationsByOrganizationId(organizationContext);

      if (filter) {
        filteredApplications = this.applyFilters(filteredApplications, filter);
      }

      if (sort?.length) {
        filteredApplications = this.applySorting(filteredApplications, sort);
      }

      filteredApplications = filteredApplications.slice(offset, offset + limit);

      return filteredApplications;
    } catch (error) {
      console.error('Error in getApplications:', error);
      return [];
    }
  }

  async createApplication(match: Match): Promise<Application> {
    const newApplication: Application = {
      id: (this.applications.length + 1).toString(),
      match,
      status: ApplicationStatus.PRE_APPLICATION,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.applications.push(newApplication);
    return newApplication;
  }

  async updateApplicationStatus(
    organizationContext: OrganizationContext,
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<Application> {
    const application = await this.getApplicationById(
      organizationContext,
      applicationId,
    );

    application.status = status;
    application.updatedAt = new Date().toISOString();

    return application;
  }
}
