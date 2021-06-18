import 'package:flutter/foundation.dart';
import './api/api.dart';
import 'dart:async';

class AuthService extends ChangeNotifier {
  var api = APIService();

  Future<Map<String, dynamic>> testGetRequest() async {
    final response = await api.testApiRequest();

    return response;
  }
}
