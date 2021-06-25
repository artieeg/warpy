import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:warpy/viewmodels/viewmodels.dart';

import '../locator.dart';

class NewStream extends StatefulWidget {
  @override
  _NewStreamState createState() => _NewStreamState();
}

class _NewStreamState extends State<NewStream> {
  @override
  void initState() {
    super.initState();
    var model = locator<NewStreamViewModel>();

    model.initLocalRenderer();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return ViewModelProvider<NewStreamViewModel>(
      builder: (model) => Scaffold(
          body: FittedBox(
              fit: BoxFit.cover,
              child: SizedBox(
                  width: size.width,
                  height: size.height,
                  child: RTCVideoView(model.localRenderer,
                      mirror: true,
                      objectFit:
                          RTCVideoViewObjectFit.RTCVideoViewObjectFitCover)))),
    );
  }
}
