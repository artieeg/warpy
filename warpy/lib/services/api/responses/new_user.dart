class NewUserResponse {
  final String id;
  final String access;
  final String refresh;

  NewUserResponse(
      {required this.id, required this.access, required this.refresh});

  static NewUserResponse fromMap(Map<String, String> map) {
    return NewUserResponse(
        id: map['id'] ?? "",
        access: map['access'] ?? "",
        refresh: map['refresh'] ?? "");
  }
}
