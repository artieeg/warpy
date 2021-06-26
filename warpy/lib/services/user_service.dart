import 'package:warpy/locator.dart';
import 'package:warpy/models/user.dart';
import 'package:warpy/services/services.dart';

class UserService {
  var api = locator<APIService>();
  late User user;

  Future<void> getUserData() async {
    user = await api.getAppUserData();
  }
}
