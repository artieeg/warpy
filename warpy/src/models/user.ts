export interface IUser {
  id: string;
  username: string;
  avatar: string;
  firstName: string;
  lastName: string;
}

export class User implements IUser {
  id: string;
  username: string;
  avatar: string;
  firstName: string;
  lastName: string;

  constructor(data: IUser) {
    this.id = data.id;
    this.username = data.username;
    this.avatar = data.avatar;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }

  static fromJSON(json: any): User {
    return new User({
      id: json.id,
      username: json.username,
      avatar: json.avatar,
      firstName: json.first_name,
      lastName: json.last_name,
    });
  }
}
