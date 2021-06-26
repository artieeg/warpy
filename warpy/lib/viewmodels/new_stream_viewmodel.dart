import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:flutter_ion/flutter_ion.dart' as ion;
import 'package:flutter/foundation.dart';
import 'package:warpy/constants.dart';
import 'package:warpy/locator.dart';
import 'package:warpy/services/services.dart';

class NewStreamViewModel extends ChangeNotifier {
  final streamService = locator<StreamService>();
  final userService = locator<UserService>();
  final streamTitleController = TextEditingController();
  final localRenderer = RTCVideoRenderer();
  late ion.LocalStream localStream;
  bool localViewInitialized = false;
  final ion.IonBaseConnector connector = ion.IonBaseConnector(Constants.ION);
  late ion.IonAppBiz biz;
  late ion.IonSDKSFU sfu;
  String? streamId;

  Future<void> stopStream() async {
    if (this.streamId != null) {
      await streamService.deleteStream(this.streamId!);
    }
  }

  void initPion() async {
    var userId = userService.user.id;
    print(userId);

    biz = ion.IonAppBiz(connector);
    sfu = ion.IonSDKSFU(connector);
    
    await biz.connect();
    //await biz.join();
  }

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

    streamId = await streamService.createStream(streamTitle, hubId);

    var userId = userService.user.id;
    print("USER ID $userId");
    notifyListeners();
  }

  @override
  void dispose() {
    localRenderer.dispose();
    super.dispose();
  }
}
