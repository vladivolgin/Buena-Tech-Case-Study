import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum ManagementType {
  WEG = 'WEG',
  MV = 'MV',
}

@Entity({ name: 'properties' })
export class Property {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'unique_number', unique: true })
  uniqueNumber!: string;

  @Column()
  name!: string;

  @Column({
    name: 'management_type',
    type: 'enum',
    enum: ManagementType,
  })
  managementType!: ManagementType;

  @Column({ name: 'manager_id', type: 'text', nullable: true })
  managerId!: string | null;

  @Column({ name: 'accountant_id', type: 'text', nullable: true })
  accountantId!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @BeforeInsert()
  beforeInsert() {
    if (!this.id) this.id = uuidv4();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date();
  }
}
