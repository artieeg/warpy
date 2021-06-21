import 'package:flutter/material.dart';
import 'package:warpy/locator.dart';
import 'package:warpy/models/new_dev_user_payload.dart';
import 'package:warpy/services/services.dart';

class DevSignUpViewModel extends ChangeNotifier {
  final storageService = locator<StorageService>();
  final signUpService = locator<SignUpService>();

  final email = TextEditingController();
  final username = TextEditingController();
  final firstName = TextEditingController();
  final lastName = TextEditingController();
  final password = TextEditingController();

  NewDevUserPayload _getPayload() {
    return NewDevUserPayload(firstName.text, lastName.text, email.text,
        username.text, password.text);
  }

  Future<void> signUp() async {
    final response = await signUpService.createDevUser(_getPayload());

    await storageService.saveAccessToken(response.access);
    await storageService.saveRefreshToken(response.refresh);
  }

  @override
  void dispose() {
    firstName.dispose();
    lastName.dispose();
    password.dispose();
    username.dispose();
    email.dispose();

    super.dispose();
  }
}
