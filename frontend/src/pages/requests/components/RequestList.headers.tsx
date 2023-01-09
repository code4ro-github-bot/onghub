import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../common/helpers/format.helper';
import StatusBadge from '../../../components/status-badge/StatusBadge';
import {
  RequestStatusBadgeMapper,
  REQUEST_STATUS_NAME,
} from '../constants/RequestStatus.constants';
import { IOrganizationRequest } from '../interfaces/Request.interface';
import i18n from '../../../common/config/i18n';
import NameWithLogo from '../../../components/name-with-logo/NameWithLogo';

const translations = {
  organization_name: i18n.t('requests:header.org_name'),
  name: i18n.t('requests:header.name'),
  email: i18n.t('requests:header.email'),
  phone: i18n.t('requests:header.phone'),
  status: i18n.t('requests:header.status'),
  created_on: i18n.t('requests:header.created_on'),
  status_error: i18n.t('requests:header.status_error'),
};

export const RequestListTableHeaders: TableColumn<IOrganizationRequest>[] = [
  {
    id: 'organizationName',
    name: translations.organization_name,
    sortable: true,
    selector: (row: IOrganizationRequest) => row.organizationName,
    grow: 2.5,
    minWidth: '15rem',
    cell: (row: IOrganizationRequest) => (
      <NameWithLogo name={row.organizationName} logo={row.logo} />
    ),
  },
  {
    id: 'name',
    name: translations.name,
    sortable: false,
    selector: (row: IOrganizationRequest) => row.name,
    grow: 1.5,
    minWidth: '7rem',
  },
  {
    id: 'email',
    name: translations.email,
    sortable: false,
    selector: (row: IOrganizationRequest) => row.email,
    grow: 2,
    minWidth: '10rem',
  },
  {
    id: 'phone',
    name: translations.phone,
    sortable: false,
    selector: (row: IOrganizationRequest) => row.phone,
    minWidth: '7rem',
    grow: 1,
  },
  {
    id: 'createdOn',
    name: translations.created_on,
    sortable: true,
    selector: (row: IOrganizationRequest) => formatDate(row?.createdOn as string),
    minWidth: '7rem',
    grow: 1,
  },
];
