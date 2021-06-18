import 'dart:convert';

import 'package:warpy/models/user.dart';

class Stream {
  String id;
  String hub;
  User owner;

  Stream({required this.id, required this.hub, required this.owner});

  factory Stream.fromMap(Map<String, dynamic> map) {
    return Stream(
        id: map['id'], hub: map['hub'], owner: User.fromMap(map['owner']));
  }

  factory Stream.fromJson(String json) {
    return Stream.fromMap(jsonDecode(json));
  }
}
