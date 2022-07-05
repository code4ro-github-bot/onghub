import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApplicationType } from '../../../shared/entities/application-type.entity';

@Entity()
export class Application extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;

  @Exclude()
  @Column({
    type: 'integer',
    nullable: true,
    name: 'type_id',
  })
  typeId: number;

  @ManyToOne(
    () => ApplicationType,
    (applicationType) => applicationType.application,
    { cascade: true },
  )
  @JoinColumn({ name: 'type_id' })
  type: ApplicationType;

  @Column({ type: 'jsonb', name: 'steps' })
  steps: string[];

  @Column({ type: 'text', name: 'short_description' })
  shortDescription: string;

  @Column({ type: 'text', name: 'description' })
  description: string;

  @Column({ type: 'text', name: 'login_link' })
  loginLink: string;

  @Column({ type: 'text', name: 'video_link' })
  video: string;

  @Column({ type: 'text', name: 'logo' })
  logo: string;
}