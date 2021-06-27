import 'package:flutter/foundation.dart';
import 'package:warpy/locator.dart';
import 'package:warpy/models/stream.dart';
import 'package:warpy/services/services.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';

class FeedViewModel extends ChangeNotifier {
  var feedService = locator<FeedService>();
  List<WarpyStream> streams = [];

  FeedViewModel() : super() {
    _fetchStreams();
  }

  Future<void> _fetchStreams() async {
    var newStreams = await feedService.getStreams();
    streams = [...streams, ...newStreams];

    print("streams $streams");

    notifyListeners();
  }
}
