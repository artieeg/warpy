import 'package:flutter/material.dart';
import '../dev_signup/dev_signup.dart';

class SplashScreen extends StatelessWidget {
  void doSomeWorkAndNavigate(BuildContext context) {
    Future.delayed(Duration(milliseconds: 500), () {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => DevSignUpScreen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    doSomeWorkAndNavigate(context);

    return Container(
        color: Theme.of(context).backgroundColor,
        child: Center(child: FlutterLogo(size: 80)));
  }
}
