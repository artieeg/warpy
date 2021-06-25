import 'package:flutter/material.dart';

class StreamTitleInput extends StatelessWidget {
  TextEditingController controller;

  StreamTitleInput({required this.controller});

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: this.controller,
      style: TextStyle(color: Colors.white, fontSize: 32),
      decoration: InputDecoration(
          border: InputBorder.none,
          hintText: "Stream Title 5",
          hintStyle: TextStyle(color: Colors.grey)),
    );
  }
}
