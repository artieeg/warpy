import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:warpy/services/auth_service.dart';

class DevLoginScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
        color: Theme.of(context).backgroundColor,
        child: Center(
            child: FutureBuilder<Map<String, dynamic>>(
                future: Provider.of<AuthService>(context, listen: false)
                    .testGetRequest(),
                builder: (BuildContext context,
                    AsyncSnapshot<Map<String, dynamic>> snapshot) {
                  if (snapshot.hasData) {
                    return Text(snapshot.data.toString());
                  } else {
                    return Text("nodata");
                  }
                })));
  }
}
