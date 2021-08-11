import { nanoid } from "nanoid";
import {
  BaseEntity,
  Entity,
  BeforeInsert,
  Column,
  PrimaryColumn,
} from "typeorm";

export interface IStream {
  id: string;
  title: string;
  owner: string;
  hub: string;
  live: boolean;
}

@Entity()
export class Stream extends BaseEntity implements IStream {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  owner: string;

  @Column()
  hub: string;

  @Column()
  live: boolean;

  static fromJSON(data: Omit<IStream, "id">) {
    const stream = new Stream();

    stream.title = data.title;
    stream.owner = data.owner;
    stream.hub = data.hub;
    stream.live = data.live;

    return stream;
  }

  static stopStream(owner: string) {
    return this.update({ owner }, { live: false });
  }

  @BeforeInsert()
  private beforeInsert() {
    this.id = nanoid();
  }
}
