import { Field, ID, InputType } from '@nestjs/graphql';
import { ApplicationStatus } from '../../../shared/types/graphql';

@InputType()
export class ApplicationFilterType {
  @Field(() => ID, { nullable: true })
  matchId?: string | null;

  @Field(() => ApplicationStatus, { nullable: true })
  status?: ApplicationStatus | null;

  @Field(() => Date, { nullable: true })
  matchDateFrom?: Date | null;

  @Field(() => Date, { nullable: true })
  matchDateTo?: Date | null;
}
