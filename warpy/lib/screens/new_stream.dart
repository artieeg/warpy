import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';

class NewStream extends StatefulWidget {
  @override
  _NewStreamState createState() => _NewStreamState();
}

class _NewStreamState extends State<NewStream> {
  late MediaStream localStream;
  final localRenderer = RTCVideoRenderer();

  @override
  void initState() {
    super.initState();
    initLocalRenderer();
  }

  void initLocalRenderer() async {
    await localRenderer.initialize();

    final mediaConstraints = <String, dynamic>{
      'audio': false,
      'video': {
        'mandatory': {
          'minWidth': '720',
          'minHeight': '1080',
          'minFrameRate': '24',
        },
        'facingMode': 'user',
        'optional': [],
      }
    };

    var stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    localStream = stream;
    localRenderer.srcObject = localStream;

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
    localStream.dispose();
    localRenderer.dispose();

    super.dispose();
  }
}
