import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/schemas/**/*.graphql'],
  path: join(process.cwd(), 'src/shared/types/graphql.ts'),
  watch: true,
  skipResolverArgs: false,
});
