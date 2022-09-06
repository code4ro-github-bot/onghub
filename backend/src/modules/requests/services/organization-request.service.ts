import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { OrganizationService } from 'src/modules/organization/services';
import { UserService } from 'src/modules/user/services/user.service';
import { REQUEST_FILTER_CONFIG } from '../constants/request-filters.config';
import { REQUEST_ERRORS } from '../constants/requests-errors.constants';
import { CreateOrganizationRequestDto } from '../dto/create-organization-request.dto';
import { OrganizationRequest } from '../entities/organization-request.entity';
import { RequestStatus } from '../enums/request-status.enum';
import { RequestType } from '../enums/request-type.enum';
import { OrganizationRequestRepository } from '../repositories/organization-request.repository';

@Injectable()
export class OrganizationRequestService {
  private readonly logger = new Logger(OrganizationRequestService.name);

  constructor(
    private readonly organizationRequestRepository: OrganizationRequestRepository,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
  ) {}

  public async findAll(options: BaseFilterDto) {
    const paginationOptions = {
      ...options,
      type: RequestType.CREATE_ORGANIZATION,
      status: RequestStatus.PENDING,
    };

    return this.organizationRequestRepository.getManyPaginated(
      REQUEST_FILTER_CONFIG,
      paginationOptions,
    );
  }

  public async findOne(id: number): Promise<OrganizationRequest> {
    const request = this.organizationRequestRepository.get({
      where: {
        id,
        status: RequestStatus.PENDING,
      },
      relations: [
        'organization',
        'organization.organizationGeneral',
        'organization.organizationGeneral.city',
        'organization.organizationGeneral.county',
        'organization.organizationGeneral.contact',
        'organization.organizationActivity',
        'organization.organizationActivity.federations',
        'organization.organizationActivity.coalitions',
        'organization.organizationActivity.domains',
        'organization.organizationActivity.cities',
        'organization.organizationActivity.federations',
        'organization.organizationActivity.coalitions',
        'organization.organizationActivity.branches',
        'organization.organizationActivity.regions',
        'organization.organizationLegal',
        'organization.organizationLegal.legalReprezentative',
        'organization.organizationLegal.directors',
        'organization.organizationFinancial',
        'organization.organizationReport',
        'organization.organizationReport.reports',
        'organization.organizationReport.partners',
        'organization.organizationReport.investors',
      ],
    });

    if (!request) {
      throw new NotFoundException({
        ...REQUEST_ERRORS.GET.NOT_FOUND,
      });
    }

    return request;
  }

  public async create(createReqDto: CreateOrganizationRequestDto) {
    // Check if the admin email is not in the user table already (is unique).
    const foundProfile = await this.userService.findOne({
      where: { email: createReqDto.admin.email },
    });

    if (foundProfile) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.CREATE.USER_EXISTS,
      });
    }

    // Check if there isn't already a request made by the same user.
    const foundRequest = await this.organizationRequestRepository.get({
      where: [
        { email: createReqDto.admin.email, status: RequestStatus.PENDING },
        { phone: createReqDto.admin.phone, status: RequestStatus.PENDING },
      ],
    });

    if (foundRequest) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.CREATE.REQ_EXISTS,
      });
    }

    try {
      const organization = await this.organizationService.create(
        createReqDto.organization,
      );

      return this.organizationRequestRepository.save({
        name: createReqDto.admin.name,
        email: createReqDto.admin.email,
        phone: createReqDto.admin.phone,
        organizationId: organization.id,
      });
    } catch (error) {
      this.logger.error({ error, payload: createReqDto });
      throw error;
    }
  }

  public async approve(requestId: number) {
    // 1. Get the request
    const { organizationId, email, phone, name, status, organization } =
      await this.find(requestId);

    if (status !== RequestStatus.PENDING) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    if (organization?.status !== OrganizationStatus.PENDING) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    // 2. Update organization status from PENDING to ACTIVE
    await this.organizationService.activate(organizationId);
    // 3. Create the ADMIN user
    await this.userService.createAdmin({ email, phone, name, organizationId });
    // 4. Update the request status
    await this.organizationRequestRepository.update(
      { id: requestId },
      { status: RequestStatus.APPROVED },
    );
    // TODO 5. Send email with approval

    return this.find(requestId);
  }

  public async reject(requestId: number) {
    // 1. Check if request is pending
    const found = await this.organizationRequestRepository.get({
      where: { id: requestId },
    });

    if (found && found.status !== RequestStatus.PENDING) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    // 2. Decline the request.
    await this.organizationRequestRepository.update(
      { id: requestId },
      { status: RequestStatus.DECLINED },
    );

    // TODO: 2. Send rejection by email

    return this.find(requestId);
  }

  private find(id: number): Promise<OrganizationRequest> {
    return this.organizationRequestRepository.get({
      where: { id },
      relations: ['organization'],
    });
  }
}
