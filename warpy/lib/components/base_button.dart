import 'package:flutter/material.dart';

class BaseButton extends StatelessWidget {
  final Function onTap;
  final double width, height;
  final Widget child;
  final bool opaque;

  BaseButton(
      {required this.onTap,
      required this.width,
      required this.height,
      required this.child,
      this.opaque = false});

  @override
  Widget build(BuildContext context) {
    var opacity = this.opaque ? 1.0 : 0.4;

    return GestureDetector(
        onTap: () => this.onTap(),
        child: Container(
            height: this.height,
            alignment: Alignment.center,
            width: this.width,
            decoration: BoxDecoration(
                color: Color.fromRGBO(1, 26, 40, opacity),
                borderRadius: BorderRadius.circular(height)),
            child: this.child));
  }
}
