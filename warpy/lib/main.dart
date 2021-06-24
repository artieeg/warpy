import 'package:flutter/material.dart';
import 'screens/screens.dart';
import './locator.dart';

void main() {
  setupLocator();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          backgroundColor: Colors.white,
          textTheme: TextTheme(
              button:  TextStyle(fontSize: 16, color: Colors.white)
          )
        ),
        onGenerateRoute: (settings) {},
        routes: {
          "/": (_) => SplashScreen(),
          "/signup/dev": (_) => DevSignUpScreen(),
          "/feed": (_) => FeedScreen(),
          "/stream/new": (_) => NewStream(),
          "/stream/paused": (_) => PausedMenuScreen(),
        });
  }
}
