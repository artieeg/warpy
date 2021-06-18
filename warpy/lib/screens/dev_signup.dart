import 'package:flutter/material.dart';
import 'package:warpy/services/services.dart';
import 'package:warpy/locator.dart';

class DevSignUpScreen extends StatefulWidget {
  @override
  DevSignUpState createState() => DevSignUpState();
}

class DevSignUpState extends State<DevSignUpScreen> {
  final storageService = locator<StorageService>();

  final email = TextEditingController();
  final username = TextEditingController();
  final firstName = TextEditingController();
  final lastName = TextEditingController();
  final password = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Padding(
          padding: EdgeInsets.only(top: 50, left: 20, right: 20, bottom: 20),
          child: Column(children: [
            TextField(
                controller: email,
                decoration: InputDecoration(hintText: "E-Mail")),
            TextField(
                controller: username,
                decoration: InputDecoration(hintText: "Username")),
            TextField(
                controller: password,
                decoration: InputDecoration(hintText: "Password")),
            TextField(
                controller: firstName,
                decoration: InputDecoration(hintText: "First name")),
            TextField(
                controller: lastName,
                decoration: InputDecoration(hintText: "Last name")),
          ]),
        ),
        floatingActionButton:
            FloatingActionButton(onPressed: _signUp, child: Icon(Icons.check)));
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

  void _signUp() async {
    final signUpService = locator<SignUpService>();

    final response = await signUpService.createDevUser(CreateDevUserPayload(
        firstName.text,
        lastName.text,
        email.text,
        username.text,
        password.text));

    await storageService.saveAccessToken(response.access);
    await storageService.saveRefreshToken(response.refresh);
  }
}
