import 'dart:convert';

class WarpyStream {
  String id;
  String hub;
  String owner;
  String title;

  WarpyStream(
      {required this.id,
      required this.hub,
      required this.owner,
      required this.title});

  factory WarpyStream.fromMap(Map<String, dynamic> map) {
    return WarpyStream(
        id: map['id'],
        hub: map['hub'],
        owner: map['owner'],
        title: map['title']);
  }

  factory WarpyStream.fromJson(String json) {
    return WarpyStream.fromMap(jsonDecode(json));
  }
}
