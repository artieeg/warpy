import 'package:flutter/material.dart';
import 'package:warpy/components/components.dart';
import 'dart:ui' as ui;

class PausedMenuScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color.fromRGBO(1, 26, 40, 0.4),
        body: BackdropFilter(
          filter: ui.ImageFilter.blur(
            sigmaX: 16.0,
            sigmaY: 16.0,
          ),
          child: Padding(
            padding:
                const EdgeInsets.only(left: 32, top: 0, right: 32, bottom: 15),
            child: Center(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    RoundTextButton("Start a stream"),
                    const SizedBox(height: 16),
                    RoundTextButton("Resume", opaque: true)
                  ]),
            ),
          ),
        ));
  }
}
