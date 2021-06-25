import 'package:flutter/material.dart';

class StreamTitleInput extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return TextFormField(
      style: TextStyle(color: Colors.white, fontSize: 32),
      decoration: InputDecoration(
          border: InputBorder.none,
          hintText: "Stream Title 5",
          hintStyle: TextStyle(color: Colors.grey)),
    );
  }
}
