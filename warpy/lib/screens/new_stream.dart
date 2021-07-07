import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:warpy/components/components.dart';
import 'package:warpy/viewmodels/viewmodels.dart';

import '../locator.dart';

class NewStream extends StatefulWidget {
  @override
  _NewStreamState createState() => _NewStreamState();
}

class _NewStreamState extends State<NewStream> {
  var model = locator<NewStreamViewModel>();

  @override
  void initState() {
    super.initState();

    model.initLocalRenderer();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return ViewModelProvider<NewStreamViewModel>(
      model: model,
      builder: (model) => Scaffold(
          body: Stack(
        children: [
          renderVideo(size),
          renderRemoteVideo(),
          model.streamId == null
              ? renderCreateStreamOverlay()
              : renderStreamControl(context)
        ],
      )),
    );
  }

  Widget renderStreamControl(BuildContext context) {
    return StreamProducerControl(onStop: () => _stopStream(context));
  }

  void _stopStream(BuildContext context) async {
    await model.stopStream();
    Navigator.of(context).popUntil(ModalRoute.withName('/feed'));
  }

  SizedBox renderCreateStreamOverlay() {
    return SizedBox.expand(
        child: Container(
            color: Color.fromRGBO(1, 26, 40, 0.4),
            child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    StreamTitleInput(controller: model.streamTitleController),
                    RoundTextButton("Go Live", onTap: model.goLive)
                  ],
                ))));
  }

  Widget renderRemoteVideo() {
    return Positioned(
        bottom: 50,
        left: 50,
      child: SizedBox(
          width: 200,
          height: 200,
          child: Container(
              color: Colors.red,
            child: RTCVideoView(model.remoteRenderer,
                mirror: true,
                objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover),
          )),
    );
  }

  FittedBox renderVideo(Size size) {
    return FittedBox(
        fit: BoxFit.cover,
        child: SizedBox(
            width: size.width,
            height: size.height,
            child: RTCVideoView(model.localRenderer,
                mirror: true,
                objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover)));
  }
}
