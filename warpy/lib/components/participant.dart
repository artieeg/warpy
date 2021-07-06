import 'package:flutter/material.dart';
import 'package:warpy/models/user.dart';

class Participant extends StatelessWidget {
  User user;

  Participant({required this.user});

  @override
  Widget build(BuildContext context) {
    return Container(
        width: 50,
        height: 50,
        clipBehavior: Clip.antiAlias,
        child: FittedBox(child: Image.network(user.avatar), fit: BoxFit.cover),
        decoration: BoxDecoration(borderRadius: BorderRadius.circular(25)));
  }
}
