import 'package:flutter/material.dart';
import 'package:warpy/viewmodels/viewmodels.dart';

class DevSignUpScreen extends StatefulWidget {
  @override
  DevSignUpState createState() => DevSignUpState();
}

class DevSignUpState extends State<DevSignUpScreen> {
  @override
  Widget build(BuildContext context) {
    return ViewModelProvider<DevSignUpViewModel>(
      builder: (model) => Scaffold(
          body: Padding(
            padding: EdgeInsets.only(top: 50, left: 20, right: 20, bottom: 20),
            child: Column(children: [
              TextField(
                  controller: model.email,
                  decoration: InputDecoration(hintText: "E-Mail")),
              TextField(
                  controller: model.username,
                  decoration: InputDecoration(hintText: "Username")),
              TextField(
                  controller: model.password,
                  decoration: InputDecoration(hintText: "Password")),
              TextField(
                  controller: model.firstName,
                  decoration: InputDecoration(hintText: "First name")),
              TextField(
                  controller: model.lastName,
                  decoration: InputDecoration(hintText: "Last name")),
            ]),
          ),
          floatingActionButton: FloatingActionButton(
              onPressed: () => _onSignUpPressed(model),
              child: Icon(Icons.check))),
    );
  }

  Future<void> _onSignUpPressed(DevSignUpViewModel model) async {
    await model.signUp();
    Navigator.pushNamedAndRemoveUntil(context, '/', (_) => false);
  }
}
