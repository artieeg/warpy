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
  final user = locator<UserService>().user;
  late ion.Signal signal;
  late ion.Client client;
  String? streamId;

  Future<void> stopStream() async {
    if (this.streamId != null) {
      await streamService.deleteStream(this.streamId!);
    }
  }

  Future<void> initPion() async {
    signal = ion.GRPCWebSignal(Constants.ION);
    client = await ion.Client.create(
          sid: streamId!, uid: user.id, signal: signal);

    localStream = await ion.LocalStream.getUserMedia(
        constraints: ion.Constraints.defaults..simulcast = true..codec = "vp8");

    localViewInitialized = true;
    client.publish(localStream);

    localRenderer.srcObject = localStream.stream;
    notifyListeners();
  }

  void initLocalRenderer() async {
    await localRenderer.initialize();
  }

  void goLive() async {
    var streamTitle = streamTitleController.text;
    var hubId = "60e3fb246c575a0041601231";

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
