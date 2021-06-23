import 'package:flutter/material.dart';
import 'package:warpy/viewmodels/viewmodels.dart';
import 'package:warpy/components/components.dart';

class FeedScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ViewModelProvider<FeedViewModel>(
        builder: (model) => Scaffold(
            body: Container(color: Colors.lightGreen, child: Stream())));
  }
}
