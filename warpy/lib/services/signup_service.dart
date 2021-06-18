import 'package:flutter/foundation.dart';
import './api/responses/new_user.dart';
import './api/payloads/create_dev_user.dart';
import './api/api.dart';
import 'package:warpy/locator.dart';
import 'dart:async';

class SignUpService extends ChangeNotifier {
  final api = locator<APIService>();

  Future<NewUserResponse> createDevUser(CreateDevUserPayload payload) async {
    final response = await api.createDevUser(payload);

    return response;
  }
}
