import 'package:flutter/material.dart';
import 'package:warpy/components/icon_button.dart';

class StreamProducerControl extends StatelessWidget {
  final Function onStop;

  StreamProducerControl({required this.onStop});

  @override
  Widget build(BuildContext context) {
    return SizedBox.expand(
        child: Padding(
      padding: const EdgeInsets.all(20.0),
      child:
          Column(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Row(mainAxisAlignment: MainAxisAlignment.end, children: [
          RoundIconButton(
              onTap: onStop, width: 50, height: 50, icon: Icons.stop)
        ])
      ]),
    ));
  }
}
