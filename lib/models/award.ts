import { IUser } from "./user";
import { IAwardModel } from "./award_model";

export interface IAward {
  id: string;
  sender: IUser;
  recipent: IUser;
  award: IAwardModel;
  created_at: string;
}
