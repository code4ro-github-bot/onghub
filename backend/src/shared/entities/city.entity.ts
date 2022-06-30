import { OrganizationActivity } from 'src/modules/organization/entities';
import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.class';

@Entity({ name: '_city' })
export class City extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;

  @ManyToMany(
    (type) => OrganizationActivity,
    (organizationActivity) => organizationActivity.cities,
  )
  organizationActivities: OrganizationActivity[];
}