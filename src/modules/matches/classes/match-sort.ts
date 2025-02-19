import { Field, InputType } from '@nestjs/graphql';
import { MatchSortField, SortDirection } from '../../../shared/types/graphql';

@InputType()
export class MatchSortType {
  @Field(() => MatchSortField)
  field: MatchSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
}
