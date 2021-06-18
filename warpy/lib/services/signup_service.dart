import 'package:flutter/foundation.dart';
import 'package:warpy/models/new_dev_user_payload.dart';
import 'package:warpy/models/new_user_response.dart';
import './api/api.dart';
import 'package:warpy/locator.dart';
import 'dart:async';

class SignUpService extends ChangeNotifier {
  final api = locator<APIService>();

  Future<NewUserResponse> createDevUser(NewDevUserPayload payload) async {
    final response = await api.createDevUser(payload);

    return response;
  }
}
