import 'package:warpy/locator.dart';
import 'package:warpy/services/services.dart';

class StreamService {
  var api = locator<APIService>();

  Future<String> createStream(String title, String hubId) async {
    var streamId = await api.createStream(title, hubId);

    return streamId;
  }

  Future<void> deleteStream(String id) async {
    await api.deleteStream(id);
  }
}
