import 'dart:convert';

class User {
  String id;
  String firstName;
  String lastName;
  String username;
  String avatar;

  User({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.username,
    required this.avatar,
  });

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'],
      firstName: map['first_name'],
      lastName: map['last_name'],
      username: map['username'],
      avatar: map['avatar'],
    );
  }

  factory User.fromJson(String json) {
    return User.fromMap(jsonDecode(json));
  }
}
