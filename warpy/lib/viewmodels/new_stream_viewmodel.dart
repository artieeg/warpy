import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:flutter_ion/flutter_ion.dart' as ion;
import 'package:flutter/foundation.dart';

class NewStreamViewModel extends ChangeNotifier {
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

  @override
  void dispose() {
    localRenderer.dispose();
    super.dispose();
  }
}
