import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateOrganizationActivityDto } from './update-organization-activity.dto';
import { UpdateOrganizationGeneralDto } from './update-organization-general.dto';
import { UpdateOrganizationLegalDto } from './update-organization-legal.dto';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    description: 'Organization General',
  })
  @IsOptional()
  @Type(() => UpdateOrganizationGeneralDto)
  @ValidateNested()
  general: UpdateOrganizationGeneralDto;

  @ApiPropertyOptional({
    description: 'Organization Activity',
  })
  @IsOptional()
  @Type(() => UpdateOrganizationActivityDto)
  @ValidateNested()
  activity: UpdateOrganizationActivityDto;

  @ApiPropertyOptional({
    description: 'Organization Legal',
  })
  @IsOptional()
  @Type(() => UpdateOrganizationLegalDto)
  @ValidateNested()
  legal: UpdateOrganizationLegalDto;
}
