import 'package:flutter/foundation.dart';
import 'package:warpy/locator.dart';
import 'package:warpy/services/services.dart';

class FeedViewModel extends ChangeNotifier {
  var feedService = locator<FeedService>();
  List<Stream> streams = [];

  FeedViewModel() : super() {
    _fetchStreams();
  }

  Future<void> _fetchStreams() async {
    var newStreams = await feedService.getStreams();
    streams = [...streams, ...newStreams as List<Stream<dynamic>>];

    notifyListeners();
  }
}
