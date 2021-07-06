import 'dart:convert';

import 'package:warpy/models/user.dart';

class WarpyStream {
  String id;
  String hub;
  String owner;
  String title;
  List<User> participants;

  WarpyStream(
      {required this.id,
      required this.hub,
      required this.owner,
      required this.title,
      required this.participants});

  factory WarpyStream.fromMap(Map<String, dynamic> map) {
    print("PARTICIPATNS ${map["participants"]}");
    return WarpyStream(
        id: map['id'],
        hub: map['hub'],
        owner: map['owner'],
        title: map['title'],
        participants: List<User>.from(
            map["participants"].map((data) => User.fromMap(data)).toList()));
  }

  factory WarpyStream.fromJson(String json) {
    return WarpyStream.fromMap(jsonDecode(json));
  }
}
