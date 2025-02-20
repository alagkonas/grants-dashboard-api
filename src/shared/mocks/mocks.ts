import {
  Application,
  ApplicationStatus,
  Match,
  Organization,
} from '../types/graphql';

export const mockMatches: Match[] = [
  {
    id: '1',
    matchDate: new Date('2025-01-15').toISOString(),
    grant: {
      id: '1',
      avgAmount: 25000,
      foundationName: 'Waiki Foundation',
      grantName: 'Community Development Grant',
      deadline: new Date('2025-03-01').toISOString(),
      location: 'California, USA',
      updateDate: new Date('2025-01-15').toISOString(),
    },
    organization: {
      id: '1',
      name: 'Tech For Good',
    },
    applications: [],
  },
  {
    id: '2',
    matchDate: new Date('2025-01-20').toISOString(),
    grant: {
      id: '2',
      avgAmount: 35000,
      foundationName: 'Looking Out Foundation',
      grantName: 'Education Innovation Fund',
      deadline: new Date('2025-03-15').toISOString(),
      location: 'New York, USA',
      updateDate: new Date('2025-01-20').toISOString(),
    },
    organization: {
      id: '1',
      name: 'Tech For Good',
    },
    applications: [],
  },
  {
    id: '3',
    matchDate: new Date('2025-01-25').toISOString(),
    grant: {
      id: '3',
      avgAmount: 15000,
      foundationName: 'Green Earth Initiative',
      grantName: 'Environmental Sustainability Grant',
      deadline: new Date('2025-04-01').toISOString(),
      location: 'Global',
      updateDate: new Date('2025-01-25').toISOString(),
    },
    organization: {
      id: '2',
      name: 'Eco Solutions',
    },
    applications: [],
  },
  {
    id: '4',
    matchDate: new Date('2025-02-01').toISOString(),
    grant: {
      id: '4',
      avgAmount: 50000,
      foundationName: 'Digital Future Fund',
      grantName: 'Technology Innovation Grant',
      deadline: new Date('2025-03-30').toISOString(),
      location: 'Remote',
      updateDate: new Date('2025-02-01').toISOString(),
    },
    organization: {
      id: '1',
      name: 'Tech For Good',
    },
    applications: [],
  },
  {
    id: '5',
    matchDate: new Date('2025-02-05').toISOString(),
    grant: {
      id: '5',
      avgAmount: 20000,
      foundationName: 'Arts Alliance',
      grantName: 'Creative Communities Grant',
      deadline: new Date('2025-04-15').toISOString(),
      location: 'Chicago, USA',
      updateDate: new Date('2025-02-05').toISOString(),
    },
    organization: {
      id: '3',
      name: 'Community Arts',
    },
    applications: [],
  },
  {
    id: '6',
    matchDate: new Date('2025-02-10').toISOString(),
    grant: {
      id: '6',
      avgAmount: 40000,
      foundationName: 'Healthcare Innovation Fund',
      grantName: 'Medical Research Grant',
      deadline: new Date('2025-05-01').toISOString(),
      location: 'Boston, USA',
      updateDate: new Date('2025-02-10').toISOString(),
    },
    organization: {
      id: '2',
      name: 'Eco Solutions',
    },
    applications: [],
  },
  {
    id: '7',
    matchDate: new Date('2025-02-15').toISOString(),
    grant: {
      id: '7',
      avgAmount: 30000,
      foundationName: 'Youth Empowerment Foundation',
      grantName: 'Next Generation Leaders',
      deadline: new Date('2025-04-30').toISOString(),
      location: 'Texas, USA',
      updateDate: new Date('2025-02-15').toISOString(),
    },
    organization: {
      id: '1',
      name: 'Tech For Good',
    },
    applications: [],
  },
  {
    id: '8',
    matchDate: new Date('2025-02-20').toISOString(),
    grant: {
      id: '8',
      avgAmount: 45000,
      foundationName: 'Social Impact Ventures',
      grantName: 'Community Transformation Grant',
      deadline: new Date('2025-05-15').toISOString(),
      location: 'Washington, USA',
      updateDate: new Date('2025-02-20').toISOString(),
    },
    organization: {
      id: '2',
      name: 'Eco Solutions',
    },
    applications: [],
  },
  {
    id: '9',
    matchDate: new Date('2025-02-25').toISOString(),
    grant: {
      id: '9',
      avgAmount: 28000,
      foundationName: 'Global Education Fund',
      grantName: 'Digital Learning Initiative',
      deadline: new Date('2025-04-20').toISOString(),
      location: 'International',
      updateDate: new Date('2025-02-25').toISOString(),
    },
    organization: {
      id: '2',
      name: 'Eco Solutions',
    },
    applications: [],
  },
  {
    id: '10',
    matchDate: new Date('2025-03-01').toISOString(),
    grant: {
      id: '10',
      avgAmount: 55000,
      foundationName: 'Urban Development Trust',
      grantName: 'Smart Cities Project',
      deadline: new Date('2025-05-30').toISOString(),
      location: 'Multiple Cities, USA',
      updateDate: new Date('2025-03-01').toISOString(),
    },
    organization: {
      id: '3',
      name: 'Community Arts',
    },
    applications: [],
  },
];

export const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Tech For Good',
    matches: [mockMatches[0], mockMatches[1], mockMatches[3], mockMatches[6]],
  },
  {
    id: '2',
    name: 'Eco Solutions',
    matches: [mockMatches[2], mockMatches[5], mockMatches[7], mockMatches[8]],
  },
  {
    id: '3',
    name: 'Community Arts',
    matches: [mockMatches[4], mockMatches[9]],
  },
];

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
