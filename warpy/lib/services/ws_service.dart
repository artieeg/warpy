import 'package:web_socket_channel/io.dart';
import 'package:warpy/constants.dart';

class WSService {
  var websocket = IOWebSocketChannel.connect(Uri.parse(Constants.WARPY_WS));
}
