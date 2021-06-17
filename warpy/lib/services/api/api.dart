import 'dart:convert';
import 'package:http/http.dart' as http;
import 'payloads/create_dev_user.dart';
//import 'responses/new_user.dart';

class API {
  var client = http.Client();

  Future<Map<String, dynamic>> testApiRequest() async {
    var url = Uri.parse('http://jsonplaceholder.typicode.com/users/1');
    var response = await client.get(url);
    var parsed = json.decode(response.body) as Map<String, dynamic>;

    return parsed;
  }
}
