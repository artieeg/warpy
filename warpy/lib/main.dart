import 'package:flutter/material.dart';
import 'package:warpy/services/ws_service.dart';
import 'screens/screens.dart';
import './locator.dart';
import 'package:flutter/services.dart';

void main() {
  setupLocator();

  var wsService = locator<WSService>();
  wsService.listen();

  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setEnabledSystemUIOverlays([
    SystemUiOverlay.bottom,
  ]);

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  Widget wrapScreen(Widget screen) {
    return ClipRRect(borderRadius: BorderRadius.circular(40.0), child: screen);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
            primarySwatch: Colors.blue,
            backgroundColor: Colors.white,
            textTheme: TextTheme(
                subtitle1: TextStyle(
                    fontSize: 22,
                    color: Colors.white,
                    fontWeight: FontWeight.bold),
                headline1: TextStyle(
                    fontSize: 64,
                    color: Colors.white,
                    fontWeight: FontWeight.bold),
                button: TextStyle(fontSize: 16, color: Colors.white))),
        routes: {
          "/": (_) => wrapScreen(SplashScreen()),
          "/signup/dev": (_) => wrapScreen(DevSignUpScreen()),
          "/feed": (_) => wrapScreen(FeedScreen()),
          "/stream/new": (_) => wrapScreen(NewStream()),
          "/stream/paused": (_) => wrapScreen(PausedMenuScreen()),
        });
  }
}
