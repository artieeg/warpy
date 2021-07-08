import 'package:flutter/foundation.dart';
import 'package:warpy/locator.dart';
import 'package:warpy/services/services.dart';

class SplashViewModel extends ChangeNotifier {
  final storageService = locator<StorageService>();
  final apiService = locator<APIService>();
  final wsService = locator<WSService>();
  final userService = locator<UserService>();

  Future<void> initializeAPI() async {
    var token = await storageService.getAccessToken();
    apiService.setAccessToken(token);
    apiService.setAccessToken(token);
    wsService.setAccessToken(token);
    wsService.auth();
    await Future.delayed(Duration(milliseconds: 400));

    await userService.getUserData();
  }
}
