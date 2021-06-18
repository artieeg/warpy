import 'dart:convert';

class NewUserResponse {
  final String id;
  final String access;
  final String refresh;

  NewUserResponse(
      {required this.id, required this.access, required this.refresh});

  static NewUserResponse fromMap(Map<String, dynamic> map) {
    return NewUserResponse(
        id: map['user_id'] ?? "",
        access: map['access'] ?? "",
        refresh: map['refresh'] ?? "");
  }

  static NewUserResponse fromJson(String json) => fromMap(jsonDecode(json));
}
