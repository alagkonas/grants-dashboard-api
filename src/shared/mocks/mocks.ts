import {
  Application,
  ApplicationStatus,
  Grant,
  Match,
  Organization,
} from '../types/graphql';

const createMatch = (
  id: string,
  organizationId: string,
  grant: Grant,
): Match => ({
  id,
  matchDate: new Date().toISOString(),
  grant,
  organization: { id: organizationId, name: '' },
  applications: [],
});

const createApplication = (
  id: string,
  match: Match,
  status: ApplicationStatus,
): Application => ({
  id,
  match,
  status,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const mockGrants: Grant[] = [
  {
    id: '1',
    avgAmount: 25000,
    foundationName: 'Waiki Foundation',
    grantName: 'Community Development Grant',
    deadline: '2025-03-15T00:00:00Z',
    location: 'California, USA',
    updateDate: '2025-02-01T00:00:00Z',
  },
  {
    id: '2',
    avgAmount: 35000,
    foundationName: 'Looking Out Foundation',
    grantName: 'Education Innovation Fund',
    deadline: '2025-04-20T00:00:00Z',
    location: 'New York, USA',
    updateDate: '2025-02-01T00:00:00Z',
  },
  {
    id: '3',
    avgAmount: 45000,
    foundationName: 'Green Earth Initiative',
    grantName: 'Environmental Sustainability Grant',
    deadline: '2025-05-01T00:00:00Z',
    location: 'Global',
    updateDate: '2025-02-01T00:00:00Z',
  },
];

const org1Matches: Match[] = [
  createMatch('m1-1', '1', mockGrants[0]),
  createMatch('m1-2', '1', mockGrants[1]),
  createMatch('m1-3', '1', mockGrants[2]),
];
const org2Matches: Match[] = [
  createMatch('m2-1', '2', mockGrants[0]),
  createMatch('m2-2', '2', mockGrants[1]),
  createMatch('m2-3', '2', mockGrants[2]),
  createMatch('m2-4', '2', mockGrants[1]),
];
const org3Matches: Match[] = [
  createMatch('m3-1', '3', mockGrants[2]),
  createMatch('m3-2', '3', mockGrants[0]),
];

const org1Applications: Application[] = [
  ...Array(4)
    .fill(null)
    .map((_, i) =>
      createApplication(
        `a1-pre-${i}`,
        org1Matches[2],
        ApplicationStatus.PRE_APPLICATION,
      ),
    ),
  ...Array(2)
    .fill(null)
    .map((_, i) =>
      createApplication(
        `a1-in-${i}`,
        org1Matches[2],
        ApplicationStatus.IN_PROGRESS,
      ),
    ),
  ...Array(2)
    .fill(null)
    .map((_, i) =>
      createApplication(
        `a1-ready-${i}`,
        org1Matches[2],
        ApplicationStatus.READY,
      ),
    ),
  ...Array(2)
    .fill(null)
    .map((_, i) =>
      createApplication(
        `a1-sub-${i}`,
        org1Matches[2],
        ApplicationStatus.SUBMITTED,
      ),
    ),
];
const org2Applications: Application[] = [
  ...Array(2)
    .fill(null)
    .map((_, i) =>
      createApplication(
        `a2-pre-${i}`,
        org2Matches[3],
        ApplicationStatus.PRE_APPLICATION,
      ),
    ),
  ...Array(4)
    .fill(null)
    .map((_, i) =>
      createApplication(
        `a2-in-${i}`,
        org2Matches[3],
        ApplicationStatus.IN_PROGRESS,
      ),
    ),
  ...Array(3)
    .fill(null)
    .map((_, i) =>
      createApplication(
        `a2-ready-${i}`,
        org2Matches[3],
        ApplicationStatus.READY,
      ),
    ),
  createApplication('a2-sub-1', org2Matches[3], ApplicationStatus.SUBMITTED),
];
const org3Applications: Application[] = [
  ...Array(2)
    .fill(null)
    .map((_, i) =>
      createApplication(
        `a3-pre-${i}`,
        org3Matches[1],
        ApplicationStatus.PRE_APPLICATION,
      ),
    ),
  ...Array(2)
    .fill(null)
    .map((_, i) =>
      createApplication(
        `a3-in-${i}`,
        org3Matches[1],
        ApplicationStatus.IN_PROGRESS,
      ),
    ),
  ...Array(5)
    .fill(null)
    .map((_, i) =>
      createApplication(
        `a3-ready-${i}`,
        org3Matches[1],
        ApplicationStatus.READY,
      ),
    ),
  createApplication('a3-sub-1', org3Matches[1], ApplicationStatus.SUBMITTED),
];

export const mockApplications: Application[] = [
  ...org1Applications,
  ...org2Applications,
  ...org3Applications,
];

export const mockMatches: Match[] = [
  ...org1Matches,
  ...org2Matches,
  ...org3Matches,
];

export const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Tech For Good',
    matches: org1Matches.map((match) => ({
      ...match,
      applications: org1Applications.filter((app) => app.match.id === match.id),
    })),
  },
  {
    id: '2',
    name: 'Eco Solutions',
    matches: org2Matches.map((match) => ({
      ...match,
      applications: org2Applications.filter((app) => app.match.id === match.id),
    })),
  },
  {
    id: '3',
    name: 'Community Arts',
    matches: org3Matches.map((match) => ({
      ...match,
      applications: org3Applications.filter((app) => app.match.id === match.id),
    })),
  },
];
