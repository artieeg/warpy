import 'dart:convert';

class CreateDevUserPayload {
  String firstName;
  String lastName;
  String email;
  String username;
  String avatar;

  CreateDevUserPayload(
      this.firstName, this.lastName, this.email, this.username, this.avatar);

  Map<String, dynamic> toMap() {
    return {
      'first_name': firstName,
      'last_name': lastName,
      'username': username,
      'email': email,
      'avatar': avatar,
    };
  }

  String toJson() => json.encode(toMap());
}
