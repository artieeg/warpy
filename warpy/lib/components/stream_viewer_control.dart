import 'package:flutter/material.dart';
import 'package:warpy/components/components.dart';
import 'package:warpy/models/stream.dart';
import './icons.dart';

class StreamViewerControl extends StatelessWidget {
  final WarpyStream stream;

  StreamViewerControl({required this.stream});

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
                    onTap: () {},
                    width: 50,
                    height: 50,
                    icon: WarpyIcons.clapping)
              ],
            ),
            SizedBox(height: 16),
            ParticipantsRow(participants: stream.participants)
            //Container(color: Colors.green, height: 50, width: 30),
          ]),
    );
  }
}
