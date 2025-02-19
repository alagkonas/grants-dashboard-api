import { Application, ApplicationStatus } from '../../shared/types/graphql';
import { mockMatches } from '../matches/mock';

export const mockApplications: Application[] = [
  {
    id: '1',
    match: mockMatches[0],
    status: ApplicationStatus.PRE_APPLICATION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    match: mockMatches[1],
    status: ApplicationStatus.IN_PROGRESS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
