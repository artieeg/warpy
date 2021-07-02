import 'package:flutter/material.dart';
import 'package:warpy/components/components.dart';
import 'dart:ui' as ui;

class PausedMenuScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
        borderRadius: BorderRadius.circular(40.0),
        child: Scaffold(
            backgroundColor: Color.fromRGBO(1, 26, 40, 0.4),
            body: BackdropFilter(
              filter: ui.ImageFilter.blur(
                sigmaX: 16.0,
                sigmaY: 16.0,
              ),
              child: Padding(
                padding: const EdgeInsets.only(
                    left: 32, top: 0, right: 32, bottom: 15),
                child: Center(
                  child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        renderPausedText(context),
                        RoundTextButton("Start a stream",
                            onTap: () => Navigator.of(context)
                                .pushReplacementNamed("/stream/new")),
                        const SizedBox(height: 16),
                        RoundTextButton("Resume",
                            opaque: true,
                            onTap: () => Navigator.of(context).pop())
                      ]),
                ),
              ),
            )));
  }

  Expanded renderPausedText(BuildContext context) {
    return Expanded(
      child: Center(
        child: Text("Paused", style: Theme.of(context).textTheme.headline1),
      ),
    );
  }
}