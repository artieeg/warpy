import 'package:flutter/foundation.dart';
import 'package:warpy/services/api/api.dart';
import 'dart:async';

class AuthProvider extends ChangeNotifier {
  var api = API();

  Future<Map<String, dynamic>> testGetRequest() async {
    final response = await api.testApiRequest();

    return response;
  }
}
