import 'package:flutter/material.dart';

import 'base_button.dart';

class RoundIconButton extends StatelessWidget {
  final Function onTap;
  final double width;
  final double height;
  final IconData icon;

  RoundIconButton(
      {required this.onTap,
      required this.width,
      required this.height,
      required this.icon});

  @override
  Widget build(BuildContext context) {
    return BaseButton(
        onTap: onTap,
        width: width,
        height: height,
        child: Icon(icon, size: this.width - 10, color: Colors.white));
  }
}
