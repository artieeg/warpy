import 'package:flutter/material.dart';
import 'package:warpy/viewmodels/viewmodels.dart';
import 'package:warpy/locator.dart';

class SplashScreen extends StatelessWidget {
  final model = locator<SplashViewModel>();

  Future<void> _onStart(BuildContext context) async {
    try {
      await model.initializeAPI();
      Navigator.pushNamed(context, "/feed");
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
