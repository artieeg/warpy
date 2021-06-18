import 'package:flutter/material.dart';
import 'package:warpy/screens/viewmodel_provider.dart';
import './feed_viewmodel.dart';

class FeedScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ViewModelProvider<FeedViewModel>(builder: (model) => Container());
  }
}
