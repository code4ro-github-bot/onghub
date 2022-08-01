import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrganizationReportDto } from '../dto/update-organization-report.dto';
import { InvestorService } from './investor.service';
import { PartnerService } from './partner.service';
import { ReportService } from './report.service';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import {
  ERROR_CODES,
  HTTP_ERRORS_MESSAGES,
} from '../constants/errors.constants';
import { OrganizationReportRepository } from '../repositories';
import { Investor, Partner } from '../entities';

@Injectable()
export class OrganizationReportService {
  constructor(
    private readonly organizationReportRepository: OrganizationReportRepository,
    private readonly reportService: ReportService,
    private readonly partnerService: PartnerService,
    private readonly investorService: InvestorService,
  ) {}

  public async update(
    id: number,
    updateOrganizationReportDto: UpdateOrganizationReportDto,
  ) {
    const { reportId, numberOfContractors, numberOfVolunteers, report } =
      updateOrganizationReportDto;
    const reportSummary = await this.reportService.get({
      where: { id: reportId },
    });

    if (!reportSummary) {
      throw new NotFoundException({
        message: HTTP_ERRORS_MESSAGES.REPORT_NOT_FOUND,
        errorCode: ERROR_CODES.ORG011,
      });
    }

    await this.reportService.update(reportId, {
      status: report
        ? CompletionStatus.COMPLETED
        : CompletionStatus.NOT_COMPLETED,
      numberOfContractors: numberOfContractors ?? null,
      numberOfVolunteers: numberOfVolunteers ?? null,
      report: report || null,
    });

    return this.organizationReportRepository.get({
      where: { id },
      relations: ['reports', 'partners', 'investors'],
    });
  }

  public async updatePartner(
    partnerId: number,
    numberOfPartners?: number,
    link?: string,
  ): Promise<Partner> {
    return this.partnerService.update(partnerId, {
      numberOfPartners: numberOfPartners ?? null,
      status: numberOfPartners
        ? CompletionStatus.COMPLETED
        : CompletionStatus.NOT_COMPLETED,
      link: link || null,
    });
  }

  public async updateInvestor(
    investorId: number,
    numberOfInvestors?: number,
    path?: string,
    link?: string,
  ): Promise<Investor> {
    return this.investorService.update(investorId, {
      numberOfInvestors: numberOfInvestors ?? null,
      status: numberOfInvestors
        ? CompletionStatus.COMPLETED
        : CompletionStatus.NOT_COMPLETED,
      path: path || null,
      link: link || null,
    });
  }

  public async delete(reportId: number, partnerId: number, investorId: number) {
    if (investorId) {
      this.investorService.delete(investorId);
    }

    if (partnerId) {
      this.partnerService.delete(partnerId);
    }

    if (reportId) {
      this.reportService.delete(reportId);
    }
  }

  public async getInvestor(id: number) {
    return this.investorService.get({ where: { id } });
  }
}
