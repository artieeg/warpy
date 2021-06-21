import 'package:flutter/foundation.dart';
import 'package:warpy/locator.dart';
import 'package:warpy/models/stream.dart';
import 'package:warpy/services/services.dart';

class FeedService extends ChangeNotifier {
  var api = locator<APIService>();

  Future<List<Stream>> getStreams() async {
    var streams = await api.getStreams();

    //Temporary solution because feed service is not ready yet
    streams.forEach((item) {
      item["owner"] = {
        "id": "someid",
        "firstName": "somename",
        "lastName": "somename",
        "username": "somename",
        "avatar": "someavatar"
      };
    });

    return streams.map((i) => Stream.fromMap(i)).toList();
  }
}
