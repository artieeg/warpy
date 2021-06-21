import 'package:flutter/material.dart';
import 'package:warpy/viewmodels/viewmodels.dart';

class FeedScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ViewModelProvider<FeedViewModel>(
        builder: (model) => Scaffold(
            body: Padding(
                padding: EdgeInsets.all(24),
                child: Text(model.streams.toString()))));
  }
}
