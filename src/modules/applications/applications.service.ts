import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  Application,
  ApplicationFilter,
  ApplicationSort,
  ApplicationSortField,
  ApplicationStatus,
  SortDirection,
} from '../../shared/types/graphql';
import { mockApplications } from './mocks';
import { mockMatches } from '../matches/mock';
import { GetApplicationsArgs } from '../../shared/types/applications.types';
import { OrganizationContext } from '../../shared/types/multitenancy-context';

@Injectable()
export class ApplicationsService {
  private applications = mockApplications;

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

  async getApplications({
    organizationContext,
    offset,
    sort,
    limit,
    filter,
  }: GetApplicationsArgs): Promise<Application[]> {
    try {
      let filteredApplications = [...this.applications].filter(
        (application) =>
          application.match.organization.id === organizationContext.id,
      );

      if (filter) {
        filteredApplications = this.applyFilters(filteredApplications, filter);
      }

      if (sort?.length) {
        filteredApplications = this.applySorting(filteredApplications, sort);
      }

      if (offset !== undefined) {
        filteredApplications = filteredApplications.slice(offset);
      }
      if (limit !== undefined) {
        filteredApplications = filteredApplications.slice(0, limit);
      }

      return filteredApplications;
    } catch (error) {
      console.error('Error in getApplications:', error);
      return [];
    }
  }

  async createApplication(
    organizationContext: OrganizationContext,
    matchId: string,
  ): Promise<Application> {
    const match = mockMatches.find((m) => m.id === matchId);
    if (!match || match.organization.id !== organizationContext.id) {
      throw new UnauthorizedException('Match not found or not accessible');
    }

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
    const application = this.applications.find(
      (app) =>
        app.id === applicationId &&
        app.match.organization.id === organizationContext.id,
    );

    if (!application) {
      throw new UnauthorizedException(
        'Application not found or not accessible',
      );
    }

    application.status = status;
    application.updatedAt = new Date().toISOString();

    return application;
  }
}
