import 'package:flutter/material.dart';
import 'package:warpy/components/components.dart';
import 'package:warpy/models/stream.dart';
import './icons.dart';

class StreamViewerControl extends StatelessWidget {
  final WarpyStream stream;
  final Function onRaiseHand;

  StreamViewerControl({required this.stream, required this.onRaiseHand});

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
            Row(
              children: [
                Expanded(
                    child: Container(
                        alignment: Alignment.centerLeft,
                        height: 50,
                        child: Text(stream.title,
                            style: Theme.of(context).textTheme.subtitle1))),
                RoundIconButton(
                    onTap: () {}, width: 50, height: 50, icon: WarpyIcons.claps)
              ],
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                    child: ParticipantsRow(participants: stream.participants)),
                RoundIconButton(
                    onTap: this.onRaiseHand,
                    width: 50,
                    height: 50,
                    icon: WarpyIcons.hand)
              ],
            )
          ]),
    );
  }
}
