import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class MatchFilterType {
  @Field(() => ID, { nullable: true })
  organizationId?: string | null;

  @Field(() => ID, { nullable: true })
  grantId?: string | null;

  @Field(() => Date, { nullable: true })
  matchDateFrom?: Date | null;

  @Field(() => Date, { nullable: true })
  matchDateTo?: Date | null;
}
