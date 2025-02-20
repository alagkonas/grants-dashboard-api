import { Resolver } from '@nestjs/graphql';
import { OrganizationsService } from './organizations.service';

@Resolver('Match')
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}
}
