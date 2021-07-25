import { Roles } from "@app/types";
import mongoose from "mongoose";
import { IBaseUser, BaseUser } from "./user";
import { IEntity } from "./entity";

export interface IBaseParticipant extends IEntity {
  stream: string;
  role: Roles;
}

export interface IParticipant extends IBaseUser, IBaseParticipant {}

const ParticipantSchema = new mongoose.Schema<IParticipant>({
  last_name: String,
  first_name: String,
  username: String,
  avatar: String,
  role: String,
  stream: mongoose.Schema.Types.ObjectId,
});

ParticipantSchema.set("toJSON", {
  virtuals: true,
});

export const ParticipantModel = mongoose.model(
  "Participant",
  ParticipantSchema
);

export class Participant extends BaseUser implements IParticipant {
  role: Roles;
  stream: string;

  constructor(data: IParticipant) {
    console.log("construcotre data", data);
    super(data);

    this.role = data.role;
    this.stream = data.stream;
  }

  static fromUser(user: BaseUser, role: Roles, stream: string): Participant {
    console.log("from user", user);
    return new Participant({
      ...user,
      role,
      stream,
    });
  }
}
