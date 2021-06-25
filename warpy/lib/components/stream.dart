import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

class Stream extends StatefulWidget {
  Function onTap;

  Stream({required this.onTap});

  @override
  _StreamState createState() => _StreamState();
}

class _StreamState extends State<Stream> {
  late VideoPlayerController _controller;

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.network(
        'https://media.giphy.com/media/lpWq49FLATPlCTH4Yj/giphy.mp4')
      ..initialize().then((_) {
        setState(() {});
        _controller.play();
        _controller.setLooping(true);
      });
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return GestureDetector(
      onTap: () {
        widget.onTap();
      },
      child: FittedBox(
        fit: BoxFit.cover,
        child: SizedBox(
            width: size.width,
            height: size.height,
            child: Container(color: Colors.orange))
            //VideoPlayer(_controller)),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
    _controller.dispose();
  }
}
