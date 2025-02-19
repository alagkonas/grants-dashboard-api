import { MatchSortField } from '../types/graphql';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(MatchSortField, {
  name: 'MatchSortField',
});
