import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { MatchesResolver } from './modules/matches/matches.resolver';
import { ApplicationsResolver } from './modules/applications/applications.resolver';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe('GraphQL Configuration', () => {
    it('should configure GraphQL with correct context', () => {
      const graphqlModule = module.get(GraphQLModule);
      expect(graphqlModule).toBeDefined();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const options = (graphqlModule as any).options;

      expect(options).toMatchObject({
        driver: ApolloDriver,
        typePaths: ['./src/schemas/**/*.graphql'],
        definitions: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          path: expect.any(String),
          skipResolverArgs: false,
        },
      });

      const mockRequest = {
        headers: {
          'x-organization-id': '123',
          'x-organization-name': 'Test Org',
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      const context = options.context({ req: mockRequest });
      expect(context).toEqual({
        organization: {
          id: '123',
          name: 'Test Org',
        },
      });
    });
  });

  describe('Module Imports', () => {
    it('should import MatchesModule', () => {
      const matchesResolver = module.get(MatchesResolver);
      expect(matchesResolver).toBeDefined();
    });

    it('should import ApplicationsModule', () => {
      const applicationsResolver = module.get(ApplicationsResolver);
      expect(applicationsResolver).toBeDefined();
    });
  });
});
