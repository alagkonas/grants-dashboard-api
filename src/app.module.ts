import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MatchesModule } from './modules/matches/matches.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { OrganizationContext } from './shared/types/multitenancy-context';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./src/schemas/**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/shared/types/graphql.ts'),
        skipResolverArgs: false,
      },
      context: ({ req }): { organization: OrganizationContext } => ({
        organization: {
          id: req.headers['x-organization-id'],
          name: req.headers['x-organization-name'],
        },
      }),
    }),
    MatchesModule,
    ApplicationsModule,
  ],
})
export class AppModule {}
