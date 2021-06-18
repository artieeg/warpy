import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class StorageService extends ChangeNotifier {
  final storage = FlutterSecureStorage();

  Future<void> saveAccessToken(String token) async {
    storage.write(key: 'access', value: token);
  }

  Future<void> saveRefreshToken(String token) async {
    storage.write(key: 'refresh', value: token);
  }

  Future<void> removeTokens() async {
    await storage.delete(key: 'access');
    await storage.delete(key: 'refresh');
  }

  Future<String?> getAccessToken() async {
    final result = await storage.read(key: 'access');

    return result;
  }

  Future<String?> getRefreshToken() async {
    final result = await storage.read(key: 'refresh');

    return result;
  }
}
