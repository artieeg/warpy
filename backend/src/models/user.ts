import { nanoid } from "nanoid";
import { IBaseUser } from "@warpy/lib";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  PrimaryColumn,
  In,
  Entity,
} from "typeorm";

export interface IUser extends IBaseUser {
  email: string;
  sub: string;
}

@Entity()
export class User extends BaseEntity implements IUser {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  avatar: string;

  @Column({ select: false })
  email: string;

  @Column({ select: false })
  sub: string;

  static fromJSON(data: Omit<IUser, "id">) {
    const user = new User();

    user.username = data.username;
    user.last_name = data.last_name;
    user.first_name = data.first_name;
    user.avatar = data.avatar;
    user.email = data.email;
    user.sub = data.sub;

    return user;
  }

  static findByIds(ids: string[]) {
    return this.find({ where: { id: In(ids) } });
  }

  @BeforeInsert()
  private beforeInsert() {
    this.id = nanoid();
  }
}
