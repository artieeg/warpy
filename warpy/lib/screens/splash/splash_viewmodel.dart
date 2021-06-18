import 'package:flutter/foundation.dart';
import 'package:warpy/locator.dart';
import 'package:warpy/services/services.dart';

class SplashViewModel extends ChangeNotifier {
  final storageService = locator<StorageService>();
  final apiService = locator<APIService>();

  Future<void> initializeAPI() async {
    var token = await storageService.getAccessToken();
    apiService.setAccessToken(token);
    await Future.delayed(Duration(milliseconds: 400));
  }
}
