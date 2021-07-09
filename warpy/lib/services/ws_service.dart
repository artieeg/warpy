import 'dart:convert';

import 'package:web_socket_channel/io.dart';
import 'package:warpy/constants.dart';

/*
  channel.stream.listen((message) {
    channel.sink.add('received!');
    channel.sink.close(status.goingAway);
  });
*/

class WSService {
  var websocket = IOWebSocketChannel.connect(Uri.parse(Constants.WARPY_WS));
  late String _accessToken;

  late Function onNewUserJoin;

  void setAccessToken(String token) {
    _accessToken = token;
  }

  void join(String stream) async {
    websocket.sink.add(jsonEncode({
      "event": "join-stream",
      "data": {
        "stream": stream
      }
    }));
  }

  void auth() async {
    websocket.sink.add(jsonEncode({
      "event": "auth",
      "data": {
        "token": _accessToken
      }
    }));
  }
  
  void listen() {
    websocket.stream.listen((m) {
      var message = jsonDecode(m);

      var event = message["event"];
      var data = message["data"];

      if (event == "user-join") {
        onNewUserJoin(data);
      }
    });
  }
}
