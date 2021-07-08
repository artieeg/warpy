import 'dart:convert';

import 'package:web_socket_channel/io.dart';
import 'package:warpy/constants.dart';

class WSService {
  var websocket = IOWebSocketChannel.connect(Uri.parse(Constants.WARPY_WS));
  late String _accessToken;

  void setAccessToken(String token) {
    _accessToken = token;
  }

  void auth() async {
    websocket.sink.add(jsonEncode({
      "event": "auth",
      "data": {
        "token": _accessToken
      }
    }));
  }
}
