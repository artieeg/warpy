import 'dart:convert';

import 'package:warpy/models/user.dart';

class WarpyStream {
  String id;
  String hub;
  String owner;

  WarpyStream({required this.id, required this.hub, required this.owner});

  factory WarpyStream.fromMap(Map<String, dynamic> map) {
    return WarpyStream(id: map['id'], hub: map['hub'], owner: map['owner']);
  }

  factory WarpyStream.fromJson(String json) {
    return WarpyStream.fromMap(jsonDecode(json));
  }
}
