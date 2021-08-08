import { IBaseParticipant, Roles } from "@warpy/lib";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  role: Roles;

  @Column({
    default: false,
  })
  isRaisingHand: boolean;

  constructor(data: IBaseParticipant) {
    super();

    this.id = data.id;
    this.user = data.user;
    this.role = data.role;
    this.isRaisingHand = data.isRaisingHand || false;
  }
}
