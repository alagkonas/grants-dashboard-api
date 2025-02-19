import { ApplicationSortField } from '../types/graphql';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(ApplicationSortField, {
  name: 'ApplicationSortField',
});
