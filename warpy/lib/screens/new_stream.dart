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
          model.streamId == null
              ? renderCreateStreamOverlay()
              : renderStreamControl()
        ],
      )),
    );
  }

  Widget renderStreamControl() {
    return StreamControl(onStop: model.stopStream);
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
