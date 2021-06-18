import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:warpy/constants.dart';
import 'package:warpy/models/new_dev_user_payload.dart';
import 'package:warpy/models/new_user_response.dart';

class APIService {
  var _client = http.Client();
  late String _accessToken, _refreshToken;

  void setAccessToken(String access) {
    _accessToken = access;
  }

  void setRefreshToken(String refresh) {
    _refreshToken = refresh;
  }

  Future<NewUserResponse> createDevUser(NewDevUserPayload payload) async {
    var url = Uri.parse(Constants.WARPY_API + 'user/dev');

    var response = await _client.post(url, body: payload.toJson(), headers: {
      'Content-Type': 'application/json',
    });
    print(response.body);
    print(response.statusCode);
    print(response.headers);
    print(response.toString());

    if (response.statusCode == 200) {
      return NewUserResponse.fromJson(response.body);
    } else {
      throw Exception("TODO: Exception handling");
    }
  }

  Map<String, dynamic> _getHeaders() {
    return {"authorization": _accessToken};
  }
}
