import 'package:flutter/material.dart';
import '../viewmodel_provider.dart';
import './splash_viewmodel.dart';
import 'package:warpy/locator.dart';

class SplashScreen extends StatelessWidget {
  final model = locator<SplashViewModel>();

  Future<void> _onStart(BuildContext context) async {
    try {
      await model.initializeAPI();
      print("session exists");
    } catch (e) {
      Navigator.pushNamed(context, "/signup/dev");
    }
  }

  @override
  Widget build(BuildContext context) {
    _onStart(context);

    return ViewModelProvider<SplashViewModel>(
      builder: (model) => Container(
          color: Theme.of(context).backgroundColor,
          child: Center(child: FlutterLogo(size: 80))),
    );
  }
}
