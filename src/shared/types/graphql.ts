/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */

export enum ApplicationStatus {
  PRE_APPLICATION = 'PRE_APPLICATION',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
  SUBMITTED = 'SUBMITTED',
}

export enum MatchSortField {
  MATCH_DATE = 'MATCH_DATE',
  GRANT_NAME = 'GRANT_NAME',
  ORGANIZATION_NAME = 'ORGANIZATION_NAME',
}

export enum ApplicationSortField {
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
  STATUS = 'STATUS',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface MatchFilter {
  organizationId?: Nullable<string>;
  grantId?: Nullable<string>;
  matchDateFrom?: Nullable<DateTime>;
  matchDateTo?: Nullable<DateTime>;
}

export interface MatchSort {
  field: MatchSortField;
  direction: SortDirection;
}

export interface ApplicationFilter {
  matchId?: Nullable<string>;
  status?: Nullable<ApplicationStatus>;
  createdAtFrom?: Nullable<DateTime>;
  createdAtTo?: Nullable<DateTime>;
}

export interface ApplicationSort {
  field: ApplicationSortField;
  direction: SortDirection;
}

export interface Organization {
  id: string;
  name: string;
  matches?: Nullable<Match[]>;
}

export interface Grant {
  id: string;
  avgAmount?: Nullable<number>;
  foundationName: string;
  grantName: string;
  deadline: DateTime;
  gettingStarted?: Nullable<string>;
  location?: Nullable<string>;
  updateDate: DateTime;
  matches?: Nullable<Match[]>;
}

export interface Match {
  id: string;
  matchDate: DateTime;
  grant: Grant;
  organization: Organization;
  applications?: Nullable<Application[]>;
}

export interface Application {
  id: string;
  match: Match;
  status: ApplicationStatus;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface IQuery {
  getMatches(
    filter?: Nullable<MatchFilter>,
    sort?: Nullable<MatchSort[]>,
    limit?: Nullable<number>,
    offset?: Nullable<number>,
  ): Match[] | Promise<Match[]>;

  getApplications(
    filter?: Nullable<ApplicationFilter>,
    sort?: Nullable<ApplicationSort[]>,
    limit?: Nullable<number>,
    offset?: Nullable<number>,
  ): Application[] | Promise<Application[]>;
}

export interface IMutation {
  createApplication(matchId: string): Application | Promise<Application>;

  updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
  ): Application | Promise<Application>;
}

export type DateTime = any;
type Nullable<T> = T | null;
