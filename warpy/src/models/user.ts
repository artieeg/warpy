export interface IUser {
  id: string;
  username: string;
  avatar: string;
  first_name: string;
  last_name: string;
}

export class User implements IUser {
  id: string;
  username: string;
  avatar: string;
  first_name: string;
  last_name: string;

  constructor(data: IUser) {
    this.id = data.id;
    this.username = data.username;
    this.avatar = data.avatar;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
  }

  static fromJSON(json: any): User {
    return new User({
      id: json.id,
      username: json.username,
      avatar: json.avatar,
      first_name: json.first_name,
      last_name: json.last_name,
    });
  }
}
