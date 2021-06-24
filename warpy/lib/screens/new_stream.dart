import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:flutter_ion/flutter_ion.dart' as ion;

class NewStream extends StatefulWidget {
  @override
  _NewStreamState createState() => _NewStreamState();
}

class _NewStreamState extends State<NewStream> {
  //late MediaStream localStream;
  final localRenderer = RTCVideoRenderer();
  late ion.LocalStream localStream;

  @override
  void initState() {
    super.initState();
    initLocalRenderer();
  }

  void initLocalRenderer() async {
    await localRenderer.initialize();
    ion.LocalStream localStream = await ion.LocalStream.getUserMedia(
        constraints: ion.Constraints.defaults..simulcast = true);

    localRenderer.srcObject = localStream.stream;
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
        body: FittedBox(
            fit: BoxFit.cover,
            child: SizedBox(
                width: size.width,
                height: size.height,
                child: RTCVideoView(localRenderer,
                    mirror: true,
                    objectFit:
                        RTCVideoViewObjectFit.RTCVideoViewObjectFitCover))));
  }

  @override
  void dispose() {
    localRenderer.dispose();

    super.dispose();
  }
}
