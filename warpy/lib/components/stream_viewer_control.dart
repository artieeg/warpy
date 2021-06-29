import 'package:flutter/material.dart';

class StreamViewerControl extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 20,
      left: 20,
      right: 20,
      child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Container(color: Colors.red, height: 50, width: 30),
            SizedBox(height: 16),
            Container(color: Colors.green, height: 50, width: 30),
          ]),
    );
  }
}
