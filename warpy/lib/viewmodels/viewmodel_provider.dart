import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:warpy/locator.dart';

class ViewModelProvider<T extends ChangeNotifier> extends StatelessWidget {
  final Widget Function(T) builder;
  final T model;

  ViewModelProvider({required this.builder, model})
      : this.model = model ?? locator<T>();

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
        create: (_) => model,
        child: Consumer<T>(
            builder: (context, model, child) => this.builder(model)));
  }
}
