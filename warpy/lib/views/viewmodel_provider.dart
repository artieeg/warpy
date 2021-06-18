import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:warpy/locator.dart';

class ViewModelProvider<T extends ChangeNotifier> extends StatelessWidget {
  final Widget Function(BuildContext, dynamic, Widget?) builder;

  ViewModelProvider({required this.builder});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
        create: (_) => locator<T>(), child: Consumer<T>(builder: this.builder));
  }
}
