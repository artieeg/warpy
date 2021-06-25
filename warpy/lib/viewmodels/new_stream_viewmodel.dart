import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:flutter_ion/flutter_ion.dart' as ion;
import 'package:flutter/foundation.dart';
import 'package:warpy/locator.dart';
import 'package:warpy/services/services.dart';

class NewStreamViewModel extends ChangeNotifier {
  final streamService = locator<StreamService>();
  final streamTitleController = TextEditingController();
  final localRenderer = RTCVideoRenderer();
  late ion.LocalStream localStream;
  bool localViewInitialized = false;

  void initLocalRenderer() async {
    await localRenderer.initialize();
    ion.LocalStream localStream = await ion.LocalStream.getUserMedia(
        constraints: ion.Constraints.defaults..simulcast = true);

    localRenderer.srcObject = localStream.stream;
    localViewInitialized = true;
    notifyListeners();
  }

  void goLive() async {
    var streamTitle = streamTitleController.text;
    var hubId = "test-hub-id";

    await streamService.createStream(streamTitle, hubId);
  }

  @override
  void dispose() {
    localRenderer.dispose();
    super.dispose();
  }
}
