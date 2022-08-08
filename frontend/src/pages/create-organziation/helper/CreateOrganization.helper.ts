import { emptyStringToNull, mapSelectToValue } from '../../../common/helpers/format.helper';
import { ICreateOrganizationPayload } from '../interfaces/CreateOrganization.interface';

export const createOrganizationDTOMapper = (data: any): ICreateOrganizationPayload | any => {
  const dto = {
    user: { ...emptyStringToNull(data.user), organizationId: -1 },
    general: {
      ...emptyStringToNull(data.general),
      logo: '',
      countyId: data?.general?.county.id,
      cityId: data?.general?.city.id,
    },
    activity: {
      ...emptyStringToNull(data.activity),
      branches: data?.activity?.branches ? [...data.activity.branches.map(mapSelectToValue)] : null,
      cities: data?.activity?.cities ? [...data.activity.cities.map(mapSelectToValue)] : null,
      regions: data?.activity?.regions ? [...data.activity.regions.map(mapSelectToValue)] : null,
      coalitions: data?.activity?.coalitions
        ? [...data.activity.coalitions.map(mapSelectToValue)]
        : null,
      federations: data?.activity?.federations
        ? [...data.activity.federations.map(mapSelectToValue)]
        : null,
    },
    legal: emptyStringToNull(data.legal),
  };

  console.log(dto);

  return dto;
};
