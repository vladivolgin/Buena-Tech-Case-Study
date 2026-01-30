import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export enum ManagementType {
    WEG = 'WEG',
    MV = 'MV',
  }
  
  export enum PropertyStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    ARCHIVED = 'archived',
  }
  
  @Entity({ name: 'properties' })
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    name: 'management_type',
    type: 'enum',
    enum: ManagementType,
  })
  managementType!: ManagementType;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.DRAFT,
  })
  status!: PropertyStatus;

  @Column({ name: 'manager_id', type: 'text', nullable: true })
  managerId!: string | null;

  @Column({ name: 'accountant_id', type: 'text', nullable: true })
  accountantId!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
  