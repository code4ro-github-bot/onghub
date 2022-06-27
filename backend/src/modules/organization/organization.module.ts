import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  OrganizationGeneral,
  Organization,
  OrganizationActivity,
  OrganizationLegal,
} from './entities';
import {
  OrganizationActivityRepository,
  OrganizationGeneralRepository,
  OrganizationRepository,
} from './repositories';
import {
  OrganizationActivityService,
  OrganizationGeneralService,
  OrganizationService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      OrganizationGeneral,
      OrganizationActivity,
      OrganizationLegal,
    ]),
  ],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    OrganizationGeneralService,
    OrganizationRepository,
    OrganizationGeneralRepository,
    OrganizationActivityService,
    OrganizationActivityRepository,
  ],
})
export class OrganizationModule {}
