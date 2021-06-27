import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:flutter_ion/flutter_ion.dart' as ion;
import 'package:flutter/foundation.dart';
import 'package:warpy/constants.dart';
import 'package:warpy/locator.dart';
import 'package:warpy/services/services.dart';

class NewStreamViewModel extends ChangeNotifier {
  final streamService = locator<StreamService>();
  final streamTitleController = TextEditingController();
  final localRenderer = RTCVideoRenderer();
  late ion.LocalStream localStream;
  bool localViewInitialized = false;
  final ion.IonBaseConnector connector = ion.IonBaseConnector(Constants.ION);
  final user = locator<UserService>().user;
  late ion.IonAppBiz biz;
  late ion.IonSDKSFU sfu;
  String? streamId;

  Future<void> stopStream() async {
    if (this.streamId != null) {
      await streamService.deleteStream(this.streamId!);
    }
  }

  Future<void> initPion() async {
    var userId = user.id;

    biz = ion.IonAppBiz(connector);
    sfu = ion.IonSDKSFU(connector);

    biz.onJoin = (bool joined, String reason) async {
      if (!joined) {
        //TODO: handle
      }

      await sfu.connect();
      await sfu.join(streamId!, user.id);

      localStream = await ion.LocalStream.getUserMedia(
          constraints: ion.Constraints.defaults..simulcast = true..codec = "vp8");

      localViewInitialized = true;

      Future.delayed(Duration(milliseconds: 400), () {
        sfu.publish(localStream);
      });

      localRenderer.srcObject = localStream.stream;
      notifyListeners();
    };

    await biz.connect();
    biz.join(info: user.toMap(), sid: streamId!, uid: userId);

    print("connecting to ion...");
  }

  void initLocalRenderer() async {
    await localRenderer.initialize();
  }

  void goLive() async {
    var streamTitle = streamTitleController.text;
    var hubId = "test-hub-id";

    streamId = await streamService.createStream(streamTitle, hubId);

    initPion();

    notifyListeners();
  }

  @override
  void dispose() {
    localRenderer.dispose();
    super.dispose();
  }
}
