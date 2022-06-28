import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities';
import { OrganizationGeneralMock } from './mocks/organization.mock';
import { OrganizationService } from './services/organization.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiBody({ type: CreateOrganizationDto })
  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    // return this.organizationService.create(createOrganizationDto);
    return this.organizationService.create({
      general: OrganizationGeneralMock,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Organization> {
    return this.organizationService.findOne(+id);
  }

  @ApiBody({ type: UpdateOrganizationDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }
}