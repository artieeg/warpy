import { IBaseParticipant, IParticipant, Roles } from "@warpy/lib";
import { nanoid } from "nanoid";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  In,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "./user";

const PARTICIPANTS_PER_PAGE = 50;

interface IQueryParams {
  excludeUserData?: boolean;
  params: FindManyOptions | FindOneOptions;
}

@Entity()
export class Participant extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  role: Roles;

  @Column()
  stream: string;

  @Column({
    default: false,
  })
  isRaisingHand: boolean;

  static fromUser(user: User, data: Omit<IBaseParticipant, "id">) {
    const p = new Participant();

    p.role = data.role;
    p.user = user;
    p.stream = data.stream;
    p.isRaisingHand = data.isRaisingHand || false;

    return p;
  }

  static async runFindQuery(
    query: FindConditions<Participant>,
    params?: IQueryParams
  ) {
    const relations = [];

    if (!params?.excludeUserData) {
      relations.push("user");
    }

    return this.find({
      where: query,
      relations,
      ...params?.params,
    });
  }

  async setRaiseHand(flag: boolean) {
    this.isRaisingHand = flag;

    return this.save();
  }

  async setStream(stream: string) {
    this.stream == stream;
    return this.save();
  }

  async setRole(role: Roles) {
    this.role == role;
    return this.save();
  }

  static async getByStream(stream: string) {
    return this.runFindQuery({ stream });
  }

  static async deleteAllByStream(stream: string) {
    return this.delete({ stream });
  }

  static async getSpeakers(stream: string) {
    return this.runFindQuery({ stream, role: In(["speaker", "streamer"]) });
  }

  static async getViewers(stream: string, page: number) {
    return this.runFindQuery(
      { stream, role: "viewer" },
      {
        params: {
          skip: page * PARTICIPANTS_PER_PAGE,
          take: PARTICIPANTS_PER_PAGE,
        },
      }
    );
  }

  static async getViewersWithRaisedHands(stream: string) {
    return this.runFindQuery({
      stream,
      role: "viewer",
      isRaisingHand: true,
    });
  }

  toJSON = (): IParticipant => {
    return {
      ...this.user.toJSON(),
      role: this.role,
      stream: this.stream,
      isRaisingHand: this.isRaisingHand,
    };
  };

  @BeforeInsert()
  private beforeInsert() {
    this.id = nanoid();
  }
}
