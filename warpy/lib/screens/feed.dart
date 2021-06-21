import 'package:flutter/material.dart';
import 'package:warpy/viewmodels/viewmodels.dart';

class FeedScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ViewModelProvider<FeedViewModel>(
        builder: (model) => Scaffold(
            body: Center(
                child: Container(width: 30, height: 30, color: Colors.red))));
  }
}
