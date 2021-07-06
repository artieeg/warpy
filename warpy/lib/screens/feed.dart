import 'package:flutter/material.dart';
import 'package:warpy/screens/paused_menu.dart';
import 'package:warpy/viewmodels/viewmodels.dart';
import 'package:warpy/components/components.dart';

class FeedScreen extends StatelessWidget {
  void _onPause(BuildContext context) {
    Navigator.of(context).push(
      PageRouteBuilder(
        opaque: false, // set to false
        pageBuilder: (_, __, ___) => PausedMenuScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ViewModelProvider<FeedViewModel>(
        builder: (model) => Scaffold(
            body: Container(
                color: Colors.green,
                child: model.streams.length == 0
                    ? SizedBox.expand(
                        child: GestureDetector(
                            onTap: () {
                              _onPause(context);
                            },
                            child: Container(
                                color: Colors.red,
                                child: Center(child: Text("No Streams")))))
                    : Stream(
                        streamId: model.streams[0].id,
                        onTap: () {
                          _onPause(context);
                        })
                )));
  }
}
