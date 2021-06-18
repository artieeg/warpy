import 'dart:convert';
import 'package:http/http.dart' as http;
import 'payloads/create_dev_user.dart';
import 'responses/new_user.dart';
import 'package:warpy/constants.dart';

class APIService {
  var _client = http.Client();
  late String _accessToken, _refreshToken;

  void setTokens(String access, String refresh) {
    _accessToken = access;
    _refreshToken = refresh;
  }

  Future<NewUserResponse> createDevUser(CreateDevUserPayload payload) async {
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

  Future<Map<String, dynamic>> testApiRequest() async {
    var url = Uri.parse('http://jsonplaceholder.typicode.com/users/1');
    var response = await _client.get(url);
    var parsed = json.decode(response.body) as Map<String, dynamic>;

    return parsed;
  }
}
