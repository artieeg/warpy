import 'package:flutter/material.dart';

import 'base_button.dart';

class RoundTextButton extends StatelessWidget {
  final String title;
  final bool opaque;

  RoundTextButton(this.title, {this.opaque = false});

  @override
  Widget build(BuildContext context) {
    return BaseButton(
        onTap: () {},
        opaque: this.opaque,
        height: 60,
        width: double.infinity,
        child: Text(this.title, style: Theme.of(context).textTheme.button));
  }
}
