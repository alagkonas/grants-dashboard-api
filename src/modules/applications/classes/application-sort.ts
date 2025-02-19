import { Field, InputType } from '@nestjs/graphql';
import {
  ApplicationSortField,
  SortDirection,
} from '../../../shared/types/graphql';

@InputType()
export class ApplicationSortType {
  @Field(() => ApplicationSortField)
  field: ApplicationSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
}
