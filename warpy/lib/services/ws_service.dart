import 'dart:convert';

import 'package:web_socket_channel/io.dart';
import 'package:warpy/constants.dart';

class WSService {
  var websocket = IOWebSocketChannel.connect(Uri.parse(Constants.WARPY_WS));
  late String _accessToken;

  late Function onNewUserJoin;
  late Function onParticipantRaiseHand;
  late Function onSpeakingAllowed;

  void setAccessToken(String token) {
    _accessToken = token;
  }

  void newTrack(String track) {
    websocket.sink.add(jsonEncode({"event": "new-track", "data": {
      "track": track
    }}));
  }

  void raiseHand() {
    websocket.sink.add(jsonEncode({"event": "raise-hand", "data": {}}));
  }

  void allowSpeaker(String stream, String newSpeaker) {
    websocket.sink.add(jsonEncode({
      "event": "speaker-allow",
      "data": {"stream": stream, "speaker": newSpeaker}
    }));
  }

  void join(String stream) async {
    websocket.sink.add(jsonEncode({
      "event": "join-stream",
      "data": {"stream": stream}
    }));
  }

  void auth() async {
    websocket.sink.add(jsonEncode({
      "event": "auth",
      "data": {"token": _accessToken}
    }));
  }

  void listen() {
    websocket.stream.listen((m) {
      var message = jsonDecode(m);

      var event = message["event"];
      var data = message["data"];

      print("received event ${event}");

      if (event == "user-join") {
        onNewUserJoin(data);
      } else if (event == "raise-hand") {
        onParticipantRaiseHand(data);
      } else if (event == "speaking-allowed") {
        onSpeakingAllowed(data);
      }
    });
  }
}
