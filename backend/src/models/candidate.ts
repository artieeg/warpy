import { ICandidate } from "@warpy/lib";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Candidate extends BaseEntity implements ICandidate {
  @PrimaryColumn()
  id: string;

  @Column()
  owner: string;

  @Column()
  title: string;

  @Column()
  hub: string;

  static fromJSON(data: ICandidate) {
    const candidate = new Candidate();

    candidate.id = data.id;
    candidate.hub = data.hub;
    candidate.title = data.title;
    candidate.owner = data.owner;

    return candidate;
  }

  static deleteByOwner(owner: string) {
    return this.delete({ owner });
  }
}
