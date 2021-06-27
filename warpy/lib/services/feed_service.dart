import 'package:flutter/foundation.dart';
import 'package:warpy/locator.dart';
import 'package:warpy/models/stream.dart';
import 'package:warpy/services/services.dart';

class FeedService extends ChangeNotifier {
  var api = locator<APIService>();

  Future<List<WarpyStream>> getStreams() async {
    return api.getStreams();
  }
}
