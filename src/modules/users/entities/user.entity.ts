import { Role } from '../enum/role'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Interest } from '../../interest/entities/interest.entity';
import { Project } from '../../projects/entities/project.entity';
import { Investment } from '../../investments/entities/investment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.entrepreneur
  })
  role: Role;

  @ManyToMany(() => Interest, interest => interest.users, { cascade: true })
  @JoinTable()
  interests: Interest[];

  @OneToMany(() => Investment, investment => investment.investor)
  investments: Investment[];

  @OneToMany(() => Project, project => project.owner)
  projects: Project[];


  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updatedAt: Date;
}
