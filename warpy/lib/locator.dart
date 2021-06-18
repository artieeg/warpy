import 'package:get_it/get_it.dart';
import 'package:warpy/services/services.dart';

GetIt locator = GetIt.instance;

void setupLocator() {
  locator.registerSingleton<APIService>(APIService());
  locator.registerSingleton<StorageService>(StorageService());
  locator.registerLazySingleton<SignUpService>(() => SignUpService());
}
