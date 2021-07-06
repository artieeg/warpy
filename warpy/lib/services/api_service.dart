import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:warpy/constants.dart';
import 'package:warpy/models/new_dev_user_payload.dart';
import 'package:warpy/models/new_user_response.dart';
import 'package:warpy/models/stream.dart';
import 'package:warpy/models/user.dart';

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

  Future<List<WarpyStream>> getStreams() async {
    var url = _getUri("feeds");
    var response = await _client.get(url, headers: _getHeaders());
    var streamsData = jsonDecode(response.body)['streams'] as List<dynamic>;

    return streamsData.map((i) => WarpyStream.fromMap(i)).toList();
  }

  Future<void> deleteStream(String id) async {
    var url = _getUri("streams");

    await _client.delete(url,
        body: json.encode({"id": id}), headers: _getHeaders());
  }

  Future<User> getAppUserData() async {
    var url = _getUri("whoami");

    var response = await _client.get(url, headers: _getHeaders());

    var body = jsonDecode(response.body);
    var user = User.fromMap(body['user']);

    return user;
  }

  Future<String> createStream(String title, String hub) async {
    var url = _getUri("streams");

    var response = await _client.post(url,
        body: json.encode({"title": title, "hub": hub}),
        headers: _getHeaders());

    print("RECEIVED ${response.body}");

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
    print("ACCESS TOKEN $_accessToken");

    return {"content-type": "application/json", "authorization": _accessToken};
  }
}
