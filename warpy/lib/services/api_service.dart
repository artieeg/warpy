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

  Uri _getUri(String resource) {
    return Uri.parse(Constants.WARPY_API + resource);
  }

  Future<List<Map<String, dynamic>>> getStreams() async {
    var url = _getUri("feed");
    var response = await _client.get(url, headers: _getHeaders());
    return jsonDecode(response.body)['streams'];
  }

  Future<String> createStream(String title, String hub) async {
    var url = _getUri("stream");
    var response = await _client.post(url, headers: _getHeaders());

    return jsonDecode(response.body)["stream_id"];
  }

  Future<NewUserResponse> createDevUser(NewDevUserPayload payload) async {
    var url = _getUri("user/dev");

    var response = await _client.post(url,
        body: payload.toJson(), headers: {"content-type": "application/json"});
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

  Map<String, String> _getHeaders() {
    return {"authorization": _accessToken};
  }
}
