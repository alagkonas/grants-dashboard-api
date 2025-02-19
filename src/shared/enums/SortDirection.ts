import { SortDirection } from '../types/graphql';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(SortDirection, {
  name: 'SortDirection',
});
